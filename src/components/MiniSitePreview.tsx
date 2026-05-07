import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/i18n/I18nContext";
import { LoveCounter } from "./LoveCounter";
import { getTheme } from "@/data/themes";
import { Heart, Music, Share2, QrCode, Trophy, Download, SendHorizontal, Grid2x2, ChevronLeft, ChevronRight } from "lucide-react";
import { MusicEmbed } from "./MusicEmbed";

interface MiniSiteData {
  themeId: string;
  title: string;
  honoree: string;
  startDate: string;
  message: string;
  finalMessage?: string;
  photos: string[];
  music?: string;
  hasMusic?: boolean;
  hasAnimations?: boolean;
}

interface MiniSitePreviewProps {
  data: MiniSiteData;
  compact?: boolean;
  fullPage?: boolean;
}

const monthNamesPt = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const bodasByYear: Record<number, string> = {
  1: "Papel",
  2: "Algodão",
  3: "Trigo",
  4: "Flores",
  5: "Madeira",
  6: "Perfume",
  7: "Latão",
  8: "Barro",
  9: "Cerâmica",
  10: "Estanho",
};

function getRelationshipStats(startDate: string) {
  const now = new Date();
  const start = new Date(startDate);
  const valid = !Number.isNaN(start.getTime());

  if (!valid) {
    return {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalDays: 0,
      fullMoons: 0,
      percentile: 50,
      bodasLabel: "Flores",
      daysSinceAnniversary: 0,
      formattedDate: "24 de dezembro de 2021",
    };
  }

  const diffMs = Math.max(0, now.getTime() - start.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();
  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const anniversary = new Date(start);
  anniversary.setFullYear(start.getFullYear() + years);
  const daysSinceAnniversary = Math.max(0, Math.floor((now.getTime() - anniversary.getTime()) / (1000 * 60 * 60 * 24)));
  const fullMoons = Math.floor(totalDays / 29.53);
  const percentile = Math.max(5, Math.min(50, 50 - Math.floor(totalDays / 365)));
  const bodasLabel = bodasByYear[Math.max(1, Math.min(years || 1, 10))] || "Amor";
  const formattedDate = `${start.getDate()} de ${monthNamesPt[start.getMonth()]} de ${start.getFullYear()}`;

  return {
    years,
    months,
    days,
    hours: totalHours % 24,
    minutes: totalMinutes % 60,
    seconds: totalSeconds % 60,
    totalDays,
    fullMoons,
    percentile,
    bodasLabel,
    daysSinceAnniversary,
    formattedDate,
  };
}

const FullPageMiniSitePreview = ({ data }: { data: MiniSiteData }) => {
  const [now, setNow] = useState(() => new Date());
  const stats = useMemo(() => getRelationshipStats(data.startDate), [data.startDate, now]);
  const accent = "#ef5a67";
  const isPremiumPreview = !!data.hasMusic || !!data.hasAnimations || data.photos.length > 4;
  const photoLimit = isPremiumPreview ? 8 : 4;
  const photos = (data.photos.length > 0 ? data.photos : Array.from({ length: photoLimit }).map(() => "")).slice(0, photoLimit);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const heroPhotos = Array.from({ length: Math.min(3, photos.length) }).map((_, index) => {
    const offset = index - 1;
    const safeIndex = (currentPhoto + offset + photos.length) % photos.length;
    return { src: photos[safeIndex], safeIndex, offset };
  });
  const daysHappy = stats.totalDays.toLocaleString("pt-BR");

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (photos.length <= 1) return;
    const id = setInterval(() => {
      setCurrentPhoto((prev) => (prev + 1) % photos.length);
    }, 3200);
    return () => clearInterval(id);
  }, [photos.length]);

  const timeCards = [
    { value: stats.years, label: "ANOS" },
    { value: stats.months, label: "MESES" },
    { value: stats.days, label: "DIAS" },
    { value: String(stats.hours).padStart(2, "0"), label: "HORAS" },
    { value: String(stats.minutes).padStart(2, "0"), label: "MINUTOS" },
    { value: String(stats.seconds).padStart(2, "0"), label: "SEGUNDOS" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden rounded-[2rem] bg-[#120f10] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(120,35,40,0.52),_transparent_42%),radial-gradient(circle_at_bottom_left,_rgba(96,35,35,0.45),_transparent_35%),linear-gradient(180deg,#1b1113_0%,#0f0d0e_100%)]" />
      <div className="absolute inset-0 opacity-60">
        <div className="absolute left-[12%] top-[2%] h-52 w-52 rounded-full bg-[#7d2f34]/20 blur-3xl" />
        <div className="absolute right-[10%] top-[18%] h-72 w-72 rounded-full bg-[#6c2329]/25 blur-3xl" />
        <div className="absolute left-[28%] top-[38%] h-64 w-64 rounded-full bg-[#9a4149]/20 blur-3xl" />
        <div className="absolute left-[-6%] bottom-[6%] h-80 w-80 rounded-full bg-[#8a363c]/30 blur-3xl" />
        <div className="absolute right-[8%] bottom-[4%] h-64 w-64 rounded-full bg-[#5a2328]/24 blur-3xl" />
      </div>

      <div className="relative z-10 px-6 py-12 sm:px-10 md:px-14">
        <section className="mx-auto max-w-5xl text-center">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <Heart className="h-5 w-5 text-[#ff676f]" fill="#ff676f" />
          </div>
          <h2 className="mt-6 font-display text-4xl sm:text-6xl italic tracking-tight text-white">
            {data.title || "Maria e José"}
          </h2>
          <p className="mt-3 text-sm text-white/75 sm:text-base">
            {stats.formattedDate}
          </p>
        </section>

        <section className="mx-auto mt-14 max-w-6xl">
          <div className="relative grid items-end gap-5 md:grid-cols-[0.9fr_1.15fr_0.9fr]">
            {heroPhotos.map(({ src, safeIndex, offset }) => {
              const cardClass =
                offset < 0
                  ? "md:rotate-[-6deg] md:translate-y-3"
                  : offset > 0
                    ? "md:rotate-[6deg] md:translate-y-3"
                    : "md:scale-[1.04]";
              return (
                <div
                  key={`hero-${safeIndex}`}
                  className={`overflow-hidden rounded-[1.7rem] bg-white/5 shadow-[0_18px_60px_rgba(0,0,0,0.35)] ${cardClass}`}
                >
                  {src ? (
                    <img
                      src={src}
                      alt={`Foto ${safeIndex + 1}`}
                      className={`h-[320px] w-full object-cover transition-transform duration-700 sm:h-[380px] ${offset === 0 ? "md:h-[420px]" : ""}`}
                    />
                  ) : (
                    <div className={`grid h-[320px] w-full place-items-center bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] sm:h-[380px] ${offset === 0 ? "md:h-[420px]" : ""}`}>
                      <Heart className="h-12 w-12 text-white/20" />
                    </div>
                  )}
                </div>
              );
            })}
            {photos.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentPhoto((prev) => (prev - 1 + photos.length) % photos.length)}
                  className="absolute left-0 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition-colors hover:bg-black/75"
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setCurrentPhoto((prev) => (prev + 1) % photos.length)}
                  className="absolute right-0 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition-colors hover:bg-black/75"
                  aria-label="Próxima imagem"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between text-sm text-white/60">
              <span>{isPremiumPreview ? "Galeria Premium" : "Galeria Básica"}</span>
              <span>{Math.min(data.photos.length || photoLimit, photoLimit)}/{photoLimit} fotos</span>
            </div>
            <div className="overflow-hidden">
              <div
                className="flex gap-4 transition-transform duration-700 ease-out"
                style={{ transform: `translateX(calc(${currentPhoto * -100}% - ${currentPhoto}rem))` }}
              >
                {photos.map((src, index) => (
                  <button
                    key={`gallery-${index}`}
                    onClick={() => setCurrentPhoto(index)}
                    className={`min-w-full overflow-hidden rounded-[1.2rem] border bg-white/5 shadow-[0_12px_32px_rgba(0,0,0,0.28)] sm:min-w-[calc(50%-0.5rem)] lg:min-w-[calc(33.333%-0.75rem)] ${
                      index === currentPhoto ? "border-[#ff6a73]" : "border-white/10"
                    }`}
                  >
                    {src ? (
                      <img
                        src={src}
                        alt={`Memória ${index + 1}`}
                        className="h-56 w-full object-cover sm:h-64"
                      />
                    ) : (
                      <div className="grid h-56 w-full place-items-center bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] sm:h-64">
                        <Heart className="h-10 w-10 text-white/20" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-5 flex justify-center gap-2">
              {photos.map((_, index) => (
                <button
                  key={`dot-${index}`}
                  onClick={() => setCurrentPhoto(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === currentPhoto ? "w-8 bg-[#ff6a73]" : "w-2.5 bg-white/25"
                  }`}
                  aria-label={`Ir para imagem ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {data.message && (
            <div className="mx-auto mt-10 max-w-2xl text-center">
              <p className="text-lg italic leading-9 text-white/88 sm:text-[1.45rem]">
                "{data.message}"
              </p>
            </div>
          )}

          {data.hasMusic && data.music && (
            <div className="mx-auto mt-10 max-w-2xl rounded-[1.6rem] border border-white/10 bg-white/5 px-6 py-6 backdrop-blur">
              <p className="mb-5 text-center text-xs uppercase tracking-[0.35em] text-white/55">Nossa música</p>
              <MusicEmbed url={data.music} title="Nossa música" accentHex="#ff666f" fallbackDark autoplay />
            </div>
          )}
        </section>

        <section className="mx-auto mt-20 max-w-4xl text-center">
          <h3 className="font-display text-4xl italic text-white sm:text-6xl">Tempo Juntos</h3>
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
            {timeCards.map((card) => (
              <div
                key={card.label}
                className="rounded-[2rem] border-[4px] px-4 py-8 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_12px_40px_rgba(0,0,0,0.24)]"
                style={{ borderColor: accent, background: "rgba(22, 21, 22, 0.94)" }}
              >
                <div className="text-4xl font-bold leading-none sm:text-5xl">{card.value}</div>
                <div className="mt-4 text-sm font-semibold tracking-wide text-white/92">{card.label}</div>
              </div>
            ))}
          </div>
          <p className="mt-7 text-2xl font-semibold text-white">53 luas cheias</p>
          <p className="mt-2 text-lg text-white/72">(Uma lua cheia ocorre a cada 29.5 dias)</p>
        </section>

        <section className="mx-auto mt-24 grid max-w-5xl gap-16 lg:grid-cols-2 lg:items-start">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-4">
              <Trophy className="h-16 w-16 text-[#ffb11d]" fill="#ffb11d" />
              <div>
                <p className="text-xl text-white/88">estamos entre os</p>
                <p className="font-display text-6xl italic leading-none text-white sm:text-7xl">{stats.percentile}%</p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-xl leading-8 text-white/88">
              dos casais com mais tempo juntos
            </p>
          </div>

          <div className="text-center">
            <p className="text-xl text-white/88">nosso tempo em</p>
            <h4 className="font-display text-4xl italic text-white sm:text-6xl">Bodas</h4>
            <div className="mx-auto mt-7 inline-flex rounded-full bg-[#ff8618] px-5 py-2 text-sm font-semibold text-white">
              {Math.max(stats.years, 1)} Anos
            </div>
            <div className="mx-auto mt-5 flex h-56 w-56 flex-col items-center justify-center rounded-full border-[8px] border-[#ff8618] bg-[#141314] shadow-[0_0_60px_rgba(255,134,24,0.25)]">
              <span className="text-5xl">💐</span>
              <span className="mt-3 text-2xl font-semibold">{stats.bodasLabel}</span>
            </div>
            <p className="mt-5 text-3xl font-semibold">Completo</p>
            <p className="text-lg text-white/72">há {stats.daysSinceAnniversary} dias</p>
            <button className="mt-4 rounded-lg border border-[#ff8618] px-5 py-2 text-sm font-medium text-[#ffb05b]">
              significado
            </button>
          </div>
        </section>

        <section className="mx-auto mt-24 max-w-4xl text-center">
          <h4 className="font-display text-4xl italic text-white sm:text-5xl">Sendo Feliz</h4>
          <p className="mt-2 text-5xl font-light text-white sm:text-7xl">{daysHappy} dias</p>
          <p className="mt-2 text-xl font-semibold text-white/92">ao seu lado</p>
          <div className="mt-4 text-4xl">❤️</div>

          <div className="mx-auto mt-14 max-w-md">
            <h5 className="font-display text-4xl italic text-white sm:text-5xl">Compartilhe</h5>
            <p className="mt-4 text-xl leading-8 text-white/84">
              Baixe a imagem deste momento e compartilhe
            </p>
            <button className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-base font-semibold text-[#181617] shadow-lg">
              <Download className="h-4 w-4" /> Baixar Stories
            </button>
          </div>

          <div className="mx-auto mt-14 flex max-w-md items-center gap-5 rounded-[1.4rem] bg-[#232022] px-5 py-5 text-left shadow-[0_18px_60px_rgba(0,0,0,0.3)]">
            <div className="grid h-28 w-28 place-items-center rounded-xl bg-white p-2">
              <div className="grid h-full w-full grid-cols-5 gap-[2px] rounded-md bg-white p-1">
                {Array.from({ length: 25 }).map((_, i) => (
                  <span
                    key={i}
                    className={`rounded-[1px] ${[0, 1, 4, 5, 6, 8, 10, 12, 14, 15, 18, 19, 20, 22, 24].includes(i) ? "bg-black" : "bg-white"}`}
                  />
                ))}
              </div>
            </div>
            <div className="flex-1">
              <h6 className="text-3xl font-bold text-white">Seu QR Code</h6>
              <p className="mt-2 text-base text-white/84">Baixe ou compartilhe!</p>
              <p className="mt-1 text-base text-white/62">Escaneie para acessar</p>
              <div className="mt-4 flex gap-3">
                <button className="grid h-11 w-11 place-items-center rounded-full bg-white/8 text-white/90">
                  <SendHorizontal className="h-4 w-4" />
                </button>
                <button className="grid h-11 w-11 place-items-center rounded-full bg-white/8 text-white/90">
                  <Grid2x2 className="h-4 w-4" />
                </button>
                <button className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#161315]">
                  <QrCode className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {data.finalMessage && (
          <section className="mx-auto mt-16 max-w-2xl pb-8 text-center">
            <p className="font-display text-3xl italic text-white/92 sm:text-4xl">— {data.finalMessage}</p>
          </section>
        )}
      </div>
    </div>
  );
};

export const MiniSitePreview = ({ data, compact = false, fullPage = false }: MiniSitePreviewProps) => {
  const { t } = useI18n();
  const theme = getTheme(data.themeId);
  const isDark = theme.vibe === "dark";
  const muted = isDark ? "text-white/55" : "text-black/50";

  if (fullPage) {
    return <FullPageMiniSitePreview data={data} />;
  }

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border ${isDark ? "border-white/10" : "border-black/5"} ${theme.bg} ${theme.text} ${theme.font}`}
    >
      {data.hasAnimations && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <Heart
              key={i}
              className="floating-heart"
              style={{
                left: `${(i * 13) % 100}%`,
                animationDelay: `${(i * 0.8) % 6}s`,
                animationDuration: `${6 + (i % 4)}s`,
                width: 14 + (i % 3) * 4,
                height: 14 + (i % 3) * 4,
                color: theme.accentHex,
                fill: theme.accentHex,
              }}
            />
          ))}
        </div>
      )}
      {theme.id === "midnight" && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${(i * 7.3) % 100}%`,
                top: `${(i * 11.7) % 100}%`,
                width: (i % 3) + 1,
                height: (i % 3) + 1,
                opacity: 0.4 + (i % 5) * 0.1,
              }}
            />
          ))}
        </div>
      )}

      <div className={`relative px-5 sm:px-8 ${compact ? "py-6 sm:py-8" : "py-10 sm:py-14"}`}>
        <div className="text-center">
          <Heart className={`h-6 w-6 mx-auto heartbeat ${theme.accent}`} style={{ fill: theme.accentHex }} />
          <h3 className={`mt-3 font-bold ${compact ? "text-2xl sm:text-3xl" : "text-3xl sm:text-5xl"} leading-tight`}>
            {data.title || "Eu & Você"}
          </h3>
          {data.honoree && (
            <p className={`mt-2 italic ${compact ? "text-sm" : "text-base"} ${theme.accent}`}>
              ♡ {data.honoree}
            </p>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(data.photos.length > 0 ? data.photos : Array.from({ length: 4 }).map(() => "")).slice(0, 4).map((src, i) => (
            <div
              key={i}
              className={`aspect-square rounded-xl overflow-hidden ${
                isDark ? "bg-white/5 border border-white/10" : "bg-black/5 border border-black/5"
              } grid place-items-center`}
            >
              {src ? (
                <img src={src} alt="" className="h-full w-full object-cover" />
              ) : (
                <Heart className={`h-6 w-6 opacity-30 ${theme.accent}`} />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6">
          <p className={`text-center text-xs uppercase tracking-[0.3em] ${muted}`}>{t.together}</p>
          <div className="mt-3">
            <LoveCounter
              startDate={data.startDate}
              size={compact ? "sm" : "md"}
              accentClass={theme.accent}
              textClass={theme.text}
              mutedClass={muted}
            />
          </div>
        </div>

        {data.message && (
          <p className={`mt-6 text-center ${compact ? "text-sm" : "text-base sm:text-lg"} leading-relaxed italic`}>
            "{data.message}"
          </p>
        )}

        {data.hasMusic && data.music && (
          <div className={`mt-5 flex items-center gap-3 rounded-2xl px-4 py-3 ${
            isDark ? "bg-white/5 border border-white/10" : "bg-black/5 border border-black/5"
          }`}>
            <div className="h-9 w-9 rounded-full grid place-items-center" style={{ backgroundColor: theme.accentHex }}>
              <Music className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-xs uppercase tracking-widest ${muted}`}>♪ Nossa música</div>
              <div className={`text-sm font-medium truncate ${theme.text}`}>{data.music}</div>
            </div>
          </div>
        )}

        {data.finalMessage && (
          <p className={`mt-4 text-center text-sm sm:text-base ${theme.accent}`}>
            — {data.finalMessage}
          </p>
        )}

        {!compact && (
          <div className="mt-7 flex items-center justify-center gap-3">
            <button className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs ${
              isDark ? "bg-white/10 hover:bg-white/15 text-white" : "bg-black/5 hover:bg-black/10 text-black"
            }`}>
              <Share2 className="h-3.5 w-3.5" /> {t.share}
            </button>
            <button className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs ${
              isDark ? "bg-white/10 hover:bg-white/15 text-white" : "bg-black/5 hover:bg-black/10 text-black"
            }`}>
              <QrCode className="h-3.5 w-3.5" /> QR
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export type { MiniSiteData };
