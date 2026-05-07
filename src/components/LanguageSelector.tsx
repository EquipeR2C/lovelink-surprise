import { useI18n } from "@/i18n/I18nContext";
import { LANGUAGE_META, LANGUAGES, Lang } from "@/i18n/translations";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const flagUrl = (flagCode: string) => `https://flagcdn.com/w40/${flagCode}.png`;

export const LanguageSelector = ({ compact = false }: { compact?: boolean }) => {
  const { lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGUAGE_META[lang];

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Language selector"
        className="inline-flex min-w-[168px] items-center justify-between gap-3 rounded-full border border-primary/20 bg-white/80 px-3 py-2 text-sm shadow-soft backdrop-blur transition-all hover:border-primary/40 hover:bg-white"
      >
        <span className="inline-flex min-w-0 items-center gap-3">
          <img
            src={flagUrl(current.flagCode)}
            alt={current.label}
            className="h-6 w-6 rounded-full object-cover ring-1 ring-primary/15"
            loading="eager"
          />
          {!compact && <span className="truncate font-medium text-foreground">{current.label}</span>}
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-foreground/60 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-3xl border border-primary/15 bg-white/95 p-2 shadow-[0_24px_80px_rgba(116,18,50,0.18)] backdrop-blur z-50 animate-scale-in">
          <ul className="max-h-96 overflow-y-auto">
            {LANGUAGES.map((language) => {
              const meta = LANGUAGE_META[language.code];
              return (
                <li key={language.code}>
                  <button
                    onClick={() => { setLang(language.code as Lang); setOpen(false); }}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-primary/8 ${
                      language.code === lang ? "bg-primary/10 font-semibold text-primary" : "text-foreground"
                    }`}
                  >
                    <img
                      src={flagUrl(meta.flagCode)}
                      alt={meta.label}
                      className="h-6 w-6 rounded-full object-cover ring-1 ring-primary/15"
                      loading="lazy"
                    />
                    <span className="truncate">{meta.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
