import { Music } from "lucide-react";

interface MusicEmbedProps {
  url: string;
  title?: string;
  className?: string;
  accentHex?: string;
  fallbackDark?: boolean;
  autoplay?: boolean;
}

const parseMusicUrl = (rawUrl: string) => {
  const url = rawUrl.trim();

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      if (id) return { yt: [id, id], spTrack: null, spOther: null, url };
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      const videoId =
        parsed.searchParams.get("v") ||
        parsed.pathname.split("/").filter(Boolean).at(-1) ||
        "";
      if (videoId && videoId.length >= 11) {
        return { yt: [videoId, videoId], spTrack: null, spOther: null, url };
      }
    }

    if (host === "open.spotify.com") {
      const parts = parsed.pathname.split("/").filter(Boolean);
      const cleanedParts = parts[0]?.startsWith("intl-") ? parts.slice(1) : parts;
      if (cleanedParts[0] === "track" && cleanedParts[1]) {
        return { yt: null, spTrack: [cleanedParts[1], cleanedParts[1]], spOther: null, url };
      }
      if (["album", "playlist", "episode"].includes(cleanedParts[0]) && cleanedParts[1]) {
        return { yt: null, spTrack: null, spOther: [cleanedParts[0], cleanedParts[1], cleanedParts[1]], url };
      }
    }
  } catch {
    // fallback to regex parsing below
  }

  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|music\.youtube\.com\/watch\?v=)([\w-]{11})/);
  const spTrack = url.match(/open\.spotify\.com\/(?:intl-\w+\/)?track\/([\w]+)/);
  const spOther = url.match(/open\.spotify\.com\/(?:intl-\w+\/)?(album|playlist|episode)\/([\w]+)/);
  return { yt, spTrack, spOther, url };
};

export const MusicEmbed = ({
  url,
  title = "Nossa música",
  className = "",
  accentHex = "#ef5a67",
  fallbackDark = true,
  autoplay = true,
}: MusicEmbedProps) => {
  const parsed = parseMusicUrl(url);

  if (parsed.yt) {
    const params = new URLSearchParams({
      autoplay: autoplay ? "1" : "0",
      playsinline: "1",
      rel: "0",
      modestbranding: "1",
      loop: "1",
      playlist: parsed.yt[1],
    });

    return (
      <div className={`rounded-2xl overflow-hidden aspect-video ${className}`}>
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${parsed.yt[1]}?${params.toString()}`}
          title="YouTube"
          allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    );
  }

  if (parsed.spTrack) {
    const params = new URLSearchParams({
      theme: "0",
    });

    return (
      <div className={`rounded-2xl overflow-hidden ${className}`}>
        <iframe
          className="w-full"
          style={{ height: 152 }}
          src={`https://open.spotify.com/embed/track/${parsed.spTrack[1]}?${params.toString()}`}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title="Spotify"
        />
      </div>
    );
  }

  if (parsed.spOther) {
    const params = new URLSearchParams({
      theme: "0",
    });

    return (
      <div className={`rounded-2xl overflow-hidden ${className}`}>
        <iframe
          className="w-full"
          style={{ height: 232 }}
          src={`https://open.spotify.com/embed/${parsed.spOther[1]}/${parsed.spOther[2]}?${params.toString()}`}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title="Spotify"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl px-5 py-4 ${
        fallbackDark ? "bg-white/5 border border-white/10" : "bg-black/5 border border-black/5"
      } ${className}`}
    >
      <div className="h-10 w-10 rounded-full grid place-items-center" style={{ backgroundColor: accentHex }}>
        <Music className="h-4 w-4 text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <div className={`text-xs uppercase tracking-[0.35em] ${fallbackDark ? "text-white/55" : "text-black/50"}`}>{title}</div>
        <div className={`truncate text-sm font-medium ${fallbackDark ? "text-white" : "text-black"}`}>{parsed.url}</div>
      </div>
    </div>
  );
};

export { parseMusicUrl };
