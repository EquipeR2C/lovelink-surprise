import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { Lang, LANGUAGES, translations, TranslationDict } from "./translations";

interface Currency {
  code: string;
  locale: string;
}

interface MarketPrice {
  currency: keyof typeof CURRENCIES;
  basic: number;
  premium: number;
}

const CURRENCIES = {
  BRL: { code: "BRL", locale: "pt-BR" },
  USD: { code: "USD", locale: "en-US" },
  EUR: { code: "EUR", locale: "es-ES" },
  GBP: { code: "GBP", locale: "en-GB" },
  JPY: { code: "JPY", locale: "ja-JP" },
  CNY: { code: "CNY", locale: "zh-CN" },
  INR: { code: "INR", locale: "hi-IN" },
  RUB: { code: "RUB", locale: "ru-RU" },
  IDR: { code: "IDR", locale: "id-ID" },
  SAR: { code: "SAR", locale: "ar-SA" },
  BDT: { code: "BDT", locale: "bn-BD" },
  PKR: { code: "PKR", locale: "ur-PK" },
} satisfies Record<string, Currency>;

const MARKET_PRICES: Record<string, MarketPrice> = {
  BR: { currency: "BRL", basic: 9.9, premium: 34.9 },
  US: { currency: "USD", basic: 1.99, premium: 6.99 },
  GB: { currency: "GBP", basic: 1.59, premium: 5.59 },
  EU: { currency: "EUR", basic: 1.79, premium: 5.99 },
  JP: { currency: "JPY", basic: 320, premium: 1100 },
  CN: { currency: "CNY", basic: 13.9, premium: 47.9 },
  IN: { currency: "INR", basic: 179, premium: 649 },
  RU: { currency: "RUB", basic: 149, premium: 529 },
  ID: { currency: "IDR", basic: 32000, premium: 113000 },
  SA: { currency: "SAR", basic: 7.49, premium: 26.99 },
  BD: { currency: "BDT", basic: 239, premium: 849 },
  PK: { currency: "PKR", basic: 559, premium: 1999 },
};

function detectLang(): Lang {
  const saved = localStorage.getItem("mlp_lang") as Lang | null;
  if (saved && LANGUAGES.find((l) => l.code === saved)) return saved;
  const nav = (navigator.language || "en").toLowerCase();
  if (nav.startsWith("pt")) return "pt-BR";
  if (nav.startsWith("es")) return "es";
  if (nav.startsWith("fr")) return "fr";
  if (nav.startsWith("it")) return "it";
  if (nav.startsWith("ru")) return "ru";
  if (nav.startsWith("ja")) return "ja";
  if (nav.startsWith("zh")) return "zh";
  if (nav.startsWith("hi")) return "hi";
  if (nav.startsWith("ar")) return "ar";
  if (nav.startsWith("bn")) return "bn";
  if (nav.startsWith("id")) return "id";
  if (nav.startsWith("ur")) return "ur";
  return "en";
}

function marketForLang(lang: Lang): MarketPrice {
  const marketByLang: Record<Lang, keyof typeof MARKET_PRICES> = {
    "pt-BR": "BR",
    en: "US",
    es: "EU",
    fr: "EU",
    it: "EU",
    ru: "RU",
    ja: "JP",
    zh: "CN",
    hi: "IN",
    ar: "SA",
    id: "ID",
    bn: "BD",
    ur: "PK",
  };

  return MARKET_PRICES[marketByLang[lang]];
}

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: TranslationDict;
  rtl: boolean;
  currency: string;
  setCurrency: (c: string) => void;
  prices: { basic: string; premium: string };
}

const Ctx = createContext<I18nValue | null>(null);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => detectLang());
  const [currency, setCurrencyState] = useState<string>(() => {
    return marketForLang(detectLang()).currency;
  });

  useEffect(() => {
    localStorage.setItem("mlp_lang", lang);
    const isRtl = !!LANGUAGES.find((l) => l.code === lang)?.rtl;
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    setCurrencyState(marketForLang(lang).currency);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("mlp_currency", currency);
  }, [currency]);

  const value = useMemo<I18nValue>(() => {
    const selectedMarket =
      Object.values(MARKET_PRICES).find((market) => market.currency === currency) ||
      marketForLang(lang);
    const cur = CURRENCIES[selectedMarket.currency] || CURRENCIES.USD;
    const fmt = (n: number) => {
      try {
        return new Intl.NumberFormat(cur.locale, {
          style: "currency",
          currency: cur.code,
          maximumFractionDigits: ["JPY", "IDR", "PKR"].includes(cur.code) ? 0 : 2,
        }).format(n);
      } catch {
        return `${cur.code} ${n.toFixed(2)}`;
      }
    };

    const rtl = !!LANGUAGES.find((l) => l.code === lang)?.rtl;
    return {
      lang,
      setLang: (l) => setLangState(l),
      t: translations[lang],
      rtl,
      currency,
      setCurrency: setCurrencyState,
      prices: { basic: fmt(selectedMarket.basic), premium: fmt(selectedMarket.premium) },
    };
  }, [lang, currency]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useI18n = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n must be inside I18nProvider");
  return v;
};

export const CURRENCY_OPTIONS = Object.keys(CURRENCIES);
