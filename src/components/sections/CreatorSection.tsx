import { useI18n } from "@/i18n/I18nContext";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { THEMES } from "@/data/themes";
import { MiniSitePreview, MiniSiteData } from "../MiniSitePreview";
import { Camera, Heart, Sparkles, X, Maximize2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useLovePages } from "@/hooks/useLovePages";

interface Props {
  themeId: string;
  setThemeId: (id: string) => void;
  data: MiniSiteData;
  setData: (d: MiniSiteData) => void;
  plan: "basic" | "premium";
  setPlan: (p: "basic" | "premium") => void;
  prices: { basic: string; premium: string };
}

const MAX_BASIC = 4;
const MAX_PREMIUM = 8;

export const CreatorSection = ({ themeId, setThemeId, data, setData, plan, setPlan, prices }: Props) => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { save } = useLovePages();
  const [slug, setSlug] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [pageId, setPageId] = useState<string | undefined>();
  const fileRef = useRef<HTMLInputElement>(null);
  const photoLimit = plan === "premium" ? MAX_PREMIUM : MAX_BASIC;

  const update = <K extends keyof MiniSiteData>(k: K, v: MiniSiteData[K]) =>
    setData({ ...data, [k]: v });

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).slice(0, photoLimit - data.photos.length);
    const urls = arr.map((f) => URL.createObjectURL(f));
    const next = [...data.photos, ...urls].slice(0, photoLimit);
    update("photos", next);
    if (Array.from(files).length > arr.length) {
      toast.warning(`Limite de ${photoLimit} fotos para o plano ${plan === "premium" ? "Premium" : "Básico"}`);
    }
  };

  const removePhoto = (i: number) => update("photos", data.photos.filter((_, idx) => idx !== i));

  const persist = async (publish: boolean) => {
    if (!user) {
      toast.info("Faça login para salvar sua página");
      navigate("/auth");
      return;
    }
    setBusy(true);
    try {
      const { row, photos } = await save({ userId: user.id, pageId, slug: slug || undefined, data: { ...data, themeId }, plan, publish });
      setPageId(row.id);
      if (row.slug) setSlug(row.slug);
      // Replace blob URLs with persistent ones
      setData({ ...data, themeId, photos });
      toast.success(publish ? "Página publicada!" : "Rascunho salvo", {
        description: publish && row.slug ? `${window.location.origin}/p/${row.slug}` : undefined,
      });
      if (publish) navigate("/account");
    } catch (e: any) {
      toast.error(e.message || "Erro ao salvar");
    } finally {
      setBusy(false);
    }
  };

  const finalize = () => persist(true);
  const saveDraft = () => persist(false);

  const inputBase =
    "w-full px-4 py-3 rounded-xl border border-border bg-background/60 backdrop-blur text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all placeholder:text-foreground/40";
  const labelBase = "block text-xs uppercase tracking-[0.2em] text-foreground/60 font-semibold mb-2";

  return (
    <section id="creator" className="py-20 sm:py-28 bg-gradient-romance relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-[11px] uppercase tracking-[0.3em] text-primary font-semibold">{t.creator.kicker}</div>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-balance">
            {t.creator.title} <span className="text-gradient-rose italic">{t.creator.titleEm}</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="rounded-3xl bg-card/80 backdrop-blur border border-border p-6 sm:p-8 shadow-soft space-y-5">
            <div>
              <label className={labelBase}>{t.creator.coupleName}</label>
              <input className={inputBase} value={data.title} onChange={(e) => update("title", e.target.value)} maxLength={60} placeholder="Maria & João" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelBase}>{t.creator.honoree}</label>
                <input className={inputBase} value={data.honoree} onChange={(e) => update("honoree", e.target.value)} maxLength={40} placeholder="Maria" />
              </div>
              <div>
                <label className={labelBase}>{t.creator.startDate}</label>
                <input type="datetime-local" className={inputBase} value={data.startDate.slice(0, 16)} onChange={(e) => update("startDate", e.target.value)} />
              </div>
            </div>
            <div>
              <label className={labelBase}>{t.creator.message}</label>
              <textarea className={`${inputBase} resize-none`} rows={3} value={data.message} onChange={(e) => update("message", e.target.value)} maxLength={300} placeholder="Te amo desde o primeiro segundo..." />
            </div>
            <div>
              <label className={labelBase}>{t.creator.finalMessage}</label>
              <input className={inputBase} value={data.finalMessage || ""} onChange={(e) => update("finalMessage", e.target.value)} maxLength={120} placeholder="Para sempre seu(sua)" />
            </div>

            {/* Photos */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={`${labelBase} mb-0`}>{t.creator.photos}</label>
                <span className="text-xs text-foreground/50">{data.photos.length}/{photoLimit}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {data.photos.map((p, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                    <img src={p} alt="" className="h-full w-full object-cover" />
                    <button onClick={() => removePhoto(i)} className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-white grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {data.photos.length < photoLimit && (
                  <button onClick={() => fileRef.current?.click()} className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-colors grid place-items-center text-foreground/50">
                    <Camera className="h-5 w-5" />
                  </button>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
              <p className="mt-2 text-xs text-foreground/50">{t.creator.uploadHint}</p>
            </div>

            <div>
              <label className={labelBase}>{t.creator.music}</label>
              <input
                className={inputBase}
                value={data.music || ""}
                onChange={(e) =>
                  setData({
                    ...data,
                    music: e.target.value,
                    hasMusic: plan === "premium" && !!e.target.value.trim(),
                  })
                }
                disabled={plan !== "premium"}
                placeholder={plan === "premium" ? "Perfect — Ed Sheeran" : t.creator.premiumOnly}
              />
            </div>

            <div>
              <label className={labelBase}>{t.creator.slug}</label>
              <div className="flex items-center rounded-xl border border-border bg-background/60 overflow-hidden">
                <span className="px-3 py-3 text-xs text-foreground/50 border-r border-border">mylovepage.com/</span>
                <input className="flex-1 px-3 py-3 text-sm bg-transparent focus:outline-none" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} placeholder="maria-e-joao" maxLength={32} />
              </div>
            </div>

            {/* Plan toggle */}
            <div>
              <label className={labelBase}>{t.creator.plan}</label>
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-muted">
                {(["basic", "premium"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setPlan(p);
                      const newMax = p === "premium" ? MAX_PREMIUM : MAX_BASIC;
                      if (data.photos.length > newMax) update("photos", data.photos.slice(0, newMax));
                      setData({ ...data, hasMusic: p === "premium" && !!data.music, hasAnimations: p === "premium", photos: data.photos.slice(0, newMax) });
                    }}
                    className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                      plan === p ? "bg-card shadow-sm text-foreground" : "text-foreground/60"
                    }`}
                  >
                    {p === "basic" ? `${t.plans.basic} · ${prices.basic}` : `${t.plans.premium} · ${prices.premium}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
              <button
                onClick={finalize}
                disabled={busy}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-rose text-primary-foreground px-6 py-4 text-base font-semibold shadow-rose hover:scale-[1.02] transition-transform disabled:opacity-60"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {t.creator.finalize}
              </button>
              <button
                onClick={saveDraft}
                disabled={busy}
                className="rounded-xl border border-border bg-background px-5 py-4 text-sm font-semibold hover:bg-accent transition-colors disabled:opacity-60"
              >
                Salvar rascunho
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-24 self-start">
            <div className="text-xs uppercase tracking-[0.3em] text-foreground/50 font-semibold mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2"><Heart className="h-3 w-3 fill-primary text-primary" /> {t.creator.preview}</span>
              <button onClick={() => setExpanded(true)} className="inline-flex items-center gap-1.5 normal-case tracking-normal text-xs text-foreground/70 hover:text-primary transition-colors">
                <Maximize2 className="h-3.5 w-3.5" /> {t.creator.expand}
              </button>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-rose opacity-20 blur-2xl rounded-[2rem] pointer-events-none" />
              <div className="relative max-h-[88vh] overflow-auto rounded-[2rem] border border-border bg-card shadow-soft">
                <MiniSitePreview data={{ ...data, themeId, hasMusic: plan === "premium" && !!data.music, hasAnimations: plan === "premium" }} fullPage />
              </div>
            </div>
            {/* Theme quick selector */}
            <div className="mt-4 flex flex-wrap gap-2">
              {THEMES.map((th) => (
                <button
                  key={th.id}
                  onClick={() => setThemeId(th.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    th.id === themeId ? "bg-foreground text-background border-foreground" : "bg-card border-border hover:border-primary/40"
                  }`}
                >
                  {th.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogContent className="max-w-[96vw] h-[96vh] p-0 bg-transparent border-0 shadow-none">
          <div className="relative h-full overflow-auto rounded-[2rem]">
            <button
              onClick={() => setExpanded(false)}
              className="absolute right-4 top-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/65 text-white shadow-lg backdrop-blur transition-colors hover:bg-black/80"
              aria-label="Fechar prévia"
            >
              <X className="h-5 w-5" />
            </button>
            <MiniSitePreview data={{ ...data, themeId, hasMusic: plan === "premium" && !!data.music, hasAnimations: plan === "premium" }} fullPage />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};
