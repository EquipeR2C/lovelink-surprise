import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { MiniSiteData } from "@/components/MiniSitePreview";

export type PlanType = "basic" | "premium";

export interface LovePageRow {
  id: string;
  user_id: string;
  slug: string | null;
  title: string;
  recipient_name: string | null;
  main_message: string | null;
  final_message: string | null;
  relationship_date: string | null;
  theme: string;
  plan_type: PlanType;
  is_published: boolean;
  expires_at: string | null;
  music_url: string | null;
  cover_image: string | null;
  qr_code_url: string | null;
  created_at: string;
  updated_at: string;
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-\s]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 48);

const isBlobUrl = (u: string) => u.startsWith("blob:") || u.startsWith("data:");

async function uploadBlobToStorage(userId: string, pageId: string, url: string, idx: number) {
  const blob = await fetch(url).then((r) => r.blob());
  const ext = (blob.type.split("/")[1] || "jpg").replace("jpeg", "jpg");
  const path = `${userId}/${pageId}/${Date.now()}-${idx}.${ext}`;
  const { error } = await supabase.storage.from("love-images").upload(path, blob, {
    contentType: blob.type || "image/jpeg",
    upsert: false,
  });
  if (error) throw error;
  // Buckets are private — return the storage path; resolve to a signed URL on read.
  return path;
}

export async function resolveImageUrl(pathOrUrl: string): Promise<string> {
  if (!pathOrUrl) return pathOrUrl;
  if (/^https?:\/\//.test(pathOrUrl) || pathOrUrl.startsWith("blob:") || pathOrUrl.startsWith("data:")) {
    return pathOrUrl;
  }
  const { data, error } = await supabase.storage.from("love-images").createSignedUrl(pathOrUrl, 60 * 60);
  if (error || !data) return pathOrUrl;
  return data.signedUrl;
}

export const useLovePages = () => {
  const list = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("love_pages")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as LovePageRow[];
  }, []);

  const getBySlug = useCallback(async (slug: string) => {
    const { data, error } = await supabase
      .from("love_pages")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw error;
    return data as LovePageRow | null;
  }, []);

  const getImages = useCallback(async (pageId: string) => {
    const { data, error } = await supabase
      .from("love_page_images")
      .select("*")
      .eq("love_page_id", pageId)
      .order("position", { ascending: true });
    if (error) throw error;
    return data as { id: string; image_url: string; position: number }[];
  }, []);

  const remove = useCallback(async (id: string) => {
    const { error } = await supabase.from("love_pages").delete().eq("id", id);
    if (error) throw error;
  }, []);

  /**
   * Save draft (or publish) a love page including photos.
   * If `pageId` is provided, updates; otherwise inserts.
   */
  const save = useCallback(
    async (params: {
      userId: string;
      pageId?: string;
      slug?: string;
      data: MiniSiteData;
      plan: PlanType;
      publish: boolean;
    }) => {
      const { userId, data, plan, publish } = params;
      let { pageId, slug } = params;

      // Slug uniqueness for publish
      if (publish) {
        if (!slug) slug = slugify(data.title || data.honoree || "amor") + "-" + Math.random().toString(36).slice(2, 6);
        slug = slugify(slug);
      }

      const payload = {
        user_id: userId,
        slug: slug || null,
        title: data.title,
        recipient_name: data.honoree || null,
        main_message: data.message || null,
        final_message: data.finalMessage || null,
        relationship_date: data.startDate ? new Date(data.startDate).toISOString() : null,
        theme: data.themeId,
        plan_type: plan,
        is_published: publish,
        music_url: plan === "premium" ? data.music || null : null,
      };

      let row: LovePageRow;
      if (pageId) {
        const { data: r, error } = await supabase.from("love_pages").update(payload).eq("id", pageId).select().single();
        if (error) throw error;
        row = r as LovePageRow;
      } else {
        const { data: r, error } = await supabase.from("love_pages").insert(payload).select().single();
        if (error) throw error;
        row = r as LovePageRow;
        pageId = row.id;
      }

      // Upload any blob/data photos and replace stored images list
      const finalUrls: string[] = [];
      const limit = plan === "premium" ? 8 : 4;
      for (let i = 0; i < Math.min(data.photos.length, limit); i++) {
        const u = data.photos[i];
        if (isBlobUrl(u)) {
          try {
            const remote = await uploadBlobToStorage(userId, pageId!, u, i);
            finalUrls.push(remote);
          } catch (e) {
            console.error("Upload failed", e);
          }
        } else {
          finalUrls.push(u);
        }
      }

      // Reset images: delete existing and reinsert (simple + correct ordering)
      await supabase.from("love_page_images").delete().eq("love_page_id", pageId);
      if (finalUrls.length > 0) {
        const { error } = await supabase
          .from("love_page_images")
          .insert(finalUrls.map((url, i) => ({ love_page_id: pageId!, image_url: url, position: i })));
        if (error) throw error;
      }

      // Cover image = first photo
      if (finalUrls[0] && finalUrls[0] !== row.cover_image) {
        await supabase.from("love_pages").update({ cover_image: finalUrls[0] }).eq("id", pageId);
        row.cover_image = finalUrls[0];
      }

      return { row, photos: finalUrls };
    },
    []
  );

  return { list, getBySlug, getImages, save, remove };
};
