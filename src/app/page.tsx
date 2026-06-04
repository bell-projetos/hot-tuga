"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, Lock, ArrowRight, Shield } from "lucide-react";

const CONVERSION_URL = "#";

const CARDS = [
  {
    id: 1,
    title: "Vazados das Famosinhas (PT)",
    description: "Os flagras mais comentados das criadoras portuguesas — direto das stories e DMs privados.",
    badge: "🔥 EM ALTA",
    cta: "Liberar Acesso",
    image: "/fotos/card1.gif",
  },
  {
    id: 2,
    title: "OnlyFans & Privacy VIP",
    description: "Pastas ocultas e conteúdos exclusivos de perfis privados portugueses.",
    badge: "💎 PRIVADO",
    cta: "Abrir Pasta",
    image: "/fotos/card2.gif",
  },
  {
    id: 3,
    title: "Amadoras & Flagras Reais",
    description: "Conteúdo real, sem edições, de amadoras portuguesas — exatamente como foi captado.",
    badge: "📸 NOVIDADE",
    cta: "Ver Fotos/Vídeos",
    image: "/fotos/card3.gif",
  },
  {
    id: 4,
    title: "Transexuais Portuguesas Vazadas",
    description: "Cenas privadas e exclusivas das criadoras trans mais seguidas em Portugal — sem censura.",
    badge: "🌟 EXCLUSIVO",
    cta: "Aceder ao Conteúdo",
    image: "/fotos/card4.gif",
  },
  {
    id: 5,
    title: "Canais de Telegram Secretos",
    description: "Links diretos e sem censura para os grupos mais exclusivos — sem listas de espera.",
    badge: "⚡ IMEDIATO",
    cta: "Entrar no Grupo",
    image: "/fotos/card5.gif",
  },
  {
    id: 6,
    title: "Arquivos Excluídos & Backstage",
    description: "Conteúdos apagados das redes sociais que o algoritmo removeu — recuperados aqui.",
    badge: "🚫 EXPIRANDO",
    cta: "Recuperar Conteúdos",
    image: "/fotos/card6.gif",
  },
  {
    id: 7,
    title: "Pack Premium da Semana",
    description: "Coletânea selecionada da semana com o melhor conteúdo das criadoras portuguesas.",
    badge: "⭐ COMPLETO",
    cta: "Baixar Pack",
    image: "/fotos/card7.gif",
  },
];

export default function HubPage() {
  const router = useRouter();
  const [onlineCount, setOnlineCount] = useState(1623);

  useEffect(() => {
    if (localStorage.getItem("pt_age_verified") !== "true") {
      router.replace("/presell");
    }
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount((prev) => {
        const delta = Math.floor(Math.random() * 21) - 10;
        return Math.max(1400, Math.min(1800, prev + delta));
      });
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Ticker de escassez */}
      <div className="bg-neon/15 border-b border-neon/30 py-2 px-4 text-center">
        <p className="text-sm font-medium animate-blink">
          🔥 Utilizadores online agora:{" "}
          <span className="font-bold text-neon">
            {onlineCount.toLocaleString("pt-PT")}
          </span>{" "}
          | Links atualizados há 5 minutos.
        </p>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-gradient-neon glow-neon-sm flex items-center justify-center text-white text-xs font-black">
              PT
            </div>
            <span className="font-display font-bold text-base">
              PT <span className="text-gradient-neon">Premium</span> Hub
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Lock className="size-4 text-emerald-400" />
            <span className="text-muted-foreground hidden sm:inline">Ligação Segura</span>
            <span className="text-xs px-2 py-0.5 rounded-full border border-neon/50 text-neon font-bold">
              18+
            </span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-16 md:py-24 px-4 radial-smoke">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon/40 bg-neon/10 text-neon text-sm font-semibold mb-6">
            <Flame className="size-4" />
            Acesso Liberado
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-black leading-tight mb-6">
            Vazados, flagras e os{" "}
            <span className="text-gradient-neon">
              melhores conteúdos privados
            </span>{" "}
            de Portugal
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Tudo o que saiu do privado das maiores criadoras nacionais —
            organizado, atualizado e protegido num único sítio.
          </p>
        </div>
      </section>

      {/* Grelha de cards */}
      <section className="max-w-6xl mx-auto px-4 pb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
        {CARDS.map((card) => (
          <a
            key={card.id}
            href={CONVERSION_URL}
            className="group relative rounded-2xl border border-white/10 bg-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-neon/60 hover:shadow-[0_30px_60px_-30px_rgba(229,9,20,0.6)] active:scale-[0.99]"
          >
            {/* GIF com blur */}
            <div className="relative aspect-[4/5] overflow-hidden bg-[radial-gradient(ellipse_at_center,oklch(0.18_0.08_25)_0%,oklch(0.06_0.01_20)_70%)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover blur-2xl brightness-50 scale-110 group-hover:blur-xl group-hover:brightness-60 transition-all duration-500"
              />

              {/* Overlay cadeado */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10">
                <div className="size-14 rounded-full bg-black/60 border border-neon/40 flex items-center justify-center glow-neon-sm group-hover:scale-110 group-hover:glow-neon transition-all duration-300">
                  <Lock className="size-6 text-neon" />
                </div>
                <span className="text-xs text-muted-foreground font-medium">Conteúdo Bloqueado</span>
              </div>

              {/* Gradiente de fusão */}
              <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-card to-transparent z-10" />

              {/* Badge */}
              <div className="absolute top-3 left-3 z-20">
                <span className="text-xs px-3 py-1 rounded-full bg-black/70 border border-neon/40 text-foreground font-semibold backdrop-blur-sm">
                  {card.badge}
                </span>
              </div>
            </div>

            {/* Corpo do card */}
            <div className="p-4">
              <h3 className="font-display font-bold text-base mb-1 line-clamp-1">
                {card.title}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                {card.description}
              </p>
              <button className="w-full py-3 px-4 rounded-xl bg-gradient-neon text-white font-bold text-sm flex items-center justify-center gap-2 group-hover:scale-[1.01] group-hover:glow-neon active:scale-[0.98] transition-all duration-200">
                {card.cta}
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </a>
        ))}
      </section>

      {/* Rodapé */}
      <footer className="border-t border-white/5 py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="size-8 rounded-full border border-neon/50 glow-neon-sm flex items-center justify-center text-neon font-black text-xs shrink-0">
              +18
            </span>
            <span>Acesso restrito a maiores de idade</span>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground/60">
            <a href="#" className="hover:text-foreground transition-colors">Termos de Utilização</a>
            <a href="#" className="hover:text-foreground transition-colors">Política de Privacidade</a>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="size-3 text-emerald-400 shrink-0" />
            <span>Ambiente 100% Seguro e Encriptado</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
