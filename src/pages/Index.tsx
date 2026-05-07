import { useState } from "react";
import { Header } from "@/components/Header";
import { ThemesSection } from "@/components/sections/ThemesSection";
import { CreatorSection } from "@/components/sections/CreatorSection";
import { PlansSection } from "@/components/sections/PlansSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { LoginModal } from "@/components/LoginModal";
import { MiniSitePreview, MiniSiteData } from "@/components/MiniSitePreview";
import { FloatingHearts } from "@/components/FloatingHearts";
import { SupportSection } from "@/components/sections/SupportSection";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { useI18n } from "@/i18n/I18nContext";
import { Heart, ArrowRight, Sparkles, Palette, Edit3, Eye, Send, Instagram, Facebook, Youtube, Star, Users, ShieldCheck, Gift, Music2 } from "lucide-react";

const defaultData = (): MiniSiteData => ({
  themeId: "minimal",
  title: "Maria & João",
  honoree: "Maria",
  startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 2.4).toISOString(),
  message: "Cada segundo ao seu lado é uma página da minha história favorita.",
  finalMessage: "Para sempre, eu",
  photos: [],
  music: "Perfect — Ed Sheeran",
  hasMusic: true,
  hasAnimations: true,
});

const Index = () => {
  const { t, prices } = useI18n();
  const [data, setData] = useState<MiniSiteData>(defaultData);
  const [themeId, setThemeId] = useState("minimal");
  const [plan, setPlan] = useState<"basic" | "premium">("premium");
  const [loginOpen, setLoginOpen] = useState(false);

  const scrollToCreator = () => document.getElementById("creator")?.scrollIntoView({ behavior: "smooth" });
  const scrollToHow = () => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" });

  const steps = [
    { i: Palette, t: t.how.s1t, d: t.how.s1d },
    { i: Edit3, t: t.how.s2t, d: t.how.s2d },
    { i: Eye, t: t.how.s3t, d: t.how.s3d },
    { i: Send, t: "Compartilhe e emocione", d: "Mande o link no WhatsApp ou imprima o QR Code para uma surpresa inesquecível." },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onLogin={() => setLoginOpen(true)} onCreate={scrollToCreator} />

      {/* Hero */}
      <section id="hero" className="relative overflow-hidden bg-gradient-hero">
        <FloatingHearts count={14} />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-16 sm:pt-24 pb-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fadeInUp">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 backdrop-blur px-4 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-[11px] uppercase tracking-[0.3em] text-foreground/70">{t.hero.badge}</span>
            </div>
            <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] text-balance">
              {t.hero.title1}{" "}
              <span className="text-gradient-rose italic">{t.hero.titleEm}</span>{" "}
              {t.hero.tagline}
            </h1>
            <p className="mt-6 text-lg text-foreground/65 leading-relaxed max-w-xl">{t.hero.sub}</p>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-foreground/70">
              <div className="inline-flex items-center gap-1.5">
                <div className="flex text-primary">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <b className="text-foreground">4.9/5</b>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4 text-primary" /><b className="text-foreground">+7.000</b> pessoas
              </div>
              <div className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary" /> Garantia de 7 dias
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button onClick={scrollToCreator} className="btn-shimmer glow-rose group inline-flex items-center gap-2 rounded-full bg-gradient-rose text-primary-foreground px-7 py-4 font-semibold hover:scale-[1.03] transition-transform">
                {t.hero.cta1} <Heart className="h-4 w-4 fill-current group-hover:scale-125 transition-transform" />
              </button>
              <button onClick={scrollToHow} className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur px-7 py-4 font-semibold hover:border-primary/40 hover:bg-card transition-colors">
                {t.hero.cta2} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="relative animate-fadeInUp hero-device-scene" style={{ animationDelay: "0.2s" }}>
            <div className="absolute -inset-6 bg-gradient-rose opacity-20 blur-3xl rounded-full pointer-events-none" />
            <div className="hero-floating-card hero-floating-card-top">
              <div className="hero-floating-icon">
                <Gift className="h-4 w-4" />
              </div>
              <div>
                <div className="text-lg font-semibold text-foreground">+7.000</div>
                <div className="text-sm text-foreground/60">Pessoas já acessaram</div>
              </div>
            </div>
            <div className="hero-side-phone hero-side-phone-left">
              <div className="hero-phone-notch" />
              <div className="hero-side-phone-screen hero-side-phone-screen-dark">
                <div className="rounded-full bg-emerald-400/20 px-2 py-1 text-[10px] font-medium text-emerald-300">WhatsApp</div>
                <div className="pt-10 text-2xl font-semibold leading-tight text-white/90">
                  Alguém vai receber um <span className="text-emerald-400">presente</span>
                </div>
                <div className="mt-3 text-sm leading-relaxed text-white/55">
                  Um momento único para celebrar o amor de um jeito inesquecível.
                </div>
              </div>
            </div>
            <div className="hero-side-phone hero-side-phone-right">
              <div className="hero-phone-notch" />
              <div className="hero-side-phone-screen hero-side-phone-screen-blue">
                <div className="inline-flex items-center gap-2 text-sm font-medium text-white/75">
                  <Music2 className="h-4 w-4" /> Nossa música
                </div>
                <div className="pt-8 text-xl font-semibold leading-tight text-white">
                  Você poderia ser tudo.
                </div>
                <div className="mt-4 text-sm leading-relaxed text-white/70">
                  Uma mensagem, fotos e música tocando dentro do minisite.
                </div>
              </div>
            </div>
            <div className="hero-heart hero-heart-1" />
            <div className="hero-heart hero-heart-2" />
            <div className="hero-heart hero-heart-3" />
            <div className="relative hero-main-phone mx-auto">
              <div className="hero-phone-shell">
                <div className="hero-phone-status">
                  <span>18:33</span>
                  <div className="flex items-center gap-1 text-[10px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
                    <span className="h-1.5 w-3 rounded-full bg-white/60" />
                    <span className="h-1.5 w-5 rounded-full bg-white/30" />
                  </div>
                </div>
                <div className="hero-phone-notch hero-phone-notch-main" />
                <div className="hero-phone-content">
                  <MiniSitePreview data={data} compact />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How */}
      <section id="how" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-[11px] uppercase tracking-[0.3em] text-primary font-semibold">{t.how.kicker}</div>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-balance">
              {t.how.title} <span className="text-gradient-rose italic">{t.how.titleEm}</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="relative rounded-3xl border border-border bg-card p-7 shadow-soft hover:-translate-y-1 transition-transform">
                <div className="absolute -top-4 -right-4 font-display text-7xl font-bold text-primary/15 leading-none select-none">
                  0{i + 1}
                </div>
                <div className="relative">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-rose grid place-items-center text-primary-foreground shadow-rose">
                    <s.i className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-bold">{s.t}</h3>
                  <p className="mt-2 text-sm text-foreground/60 leading-relaxed">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ThemesSection selected={themeId} onSelect={(id) => { setThemeId(id); scrollToCreator(); }} />

      <BenefitsSection />

      <CreatorSection
        themeId={themeId}
        setThemeId={setThemeId}
        data={data}
        setData={setData}
        plan={plan}
        setPlan={setPlan}
        prices={prices}
      />

      <TestimonialsSection />

      <PlansSection prices={prices} onSelect={(p) => { setPlan(p); scrollToCreator(); }} />

      <FaqSection />

      <SupportSection />

      {/* Final CTA */}
      <section className="py-24 text-center bg-gradient-to-br from-foreground via-foreground to-primary/70 text-background relative overflow-hidden">
        <FloatingHearts count={10} color="hsl(348 90% 70%)" />
        <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
          <Heart className="h-12 w-12 fill-primary text-primary mx-auto heartbeat" />
          <h2 className="mt-6 font-display text-4xl sm:text-6xl font-bold leading-[1.05] text-balance">
            {t.hero.title1} <span className="italic text-gradient-sunset">{t.hero.titleEm}</span>
          </h2>
          <button onClick={scrollToCreator} className="btn-shimmer mt-8 inline-flex items-center gap-2 rounded-full bg-background text-foreground px-8 py-4 font-semibold hover:scale-[1.03] transition-transform shadow-rose">
            {t.nav.cta} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 text-center text-sm text-foreground/60">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="flex items-center justify-center gap-2 font-display text-base">
            <Heart className="h-4 w-4 fill-primary text-primary" />
            <span>My Love <span className="text-gradient-rose font-bold">Page</span></span>
          </div>
          <p className="mt-3 text-xs">{t.footer.tag}</p>

          <div className="mt-5 flex items-center justify-center gap-3">
            {[
              { Icon: Instagram, href: "https://instagram.com", label: "Instagram" },
              { Icon: Facebook, href: "https://facebook.com", label: "Facebook" },
              { Icon: Youtube, href: "https://youtube.com", label: "YouTube" },
              {
                Icon: (props: React.SVGProps<SVGSVGElement>) => (
                  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.93a8.16 8.16 0 0 0 4.77 1.52V7a4.85 4.85 0 0 1-1.84-.31z" />
                  </svg>
                ),
                href: "https://tiktok.com",
                label: "TikTok",
              },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="h-9 w-9 grid place-items-center rounded-full border border-border bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          <p className="mt-5 text-xs">© {new Date().getFullYear()} · My Love Page · {t.footer.rights}</p>
        </div>
      </footer>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
};

export default Index;
