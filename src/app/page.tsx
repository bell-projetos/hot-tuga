"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Flame, Lock, ArrowRight, Shield, X,
  Play, ImageIcon, Eye, Users, Star,
  Clock, ShoppingCart, CheckCircle, Zap,
} from "lucide-react";

const CONVERSION_URL = "#";

const CARDS = [
  {
    id: 1,
    title: "Vazados das Famosinhas (PT)",
    description: "Os flagras mais comentados das criadoras portuguesas — direto das stories e DMs privados.",
    badge: "🔥 EM ALTA",
    cta: "Liberar Acesso",
    image: "/fotos/card1.gif",
    stats: { videos: 47, fotos: 312, views: "89K", membros: "2,3K" },
    price: "€19,90",
    originalPrice: "€39,90",
    rating: 4.9,
    reviews: 318,
  },
  {
    id: 2,
    title: "OnlyFans & Privacy VIP",
    description: "Pastas ocultas e conteúdos exclusivos de perfis privados portugueses.",
    badge: "💎 PRIVADO",
    cta: "Abrir Pasta",
    image: "/fotos/card2.gif",
    stats: { videos: 23, fotos: 156, views: "54K", membros: "1,8K" },
    price: "€24,90",
    originalPrice: "€49,90",
    rating: 4.8,
    reviews: 204,
  },
  {
    id: 3,
    title: "Amadoras & Flagras Reais",
    description: "Conteúdo real, sem edições, de amadoras portuguesas — exatamente como foi captado.",
    badge: "📸 NOVIDADE",
    cta: "Ver Fotos/Vídeos",
    image: "/fotos/card3.gif",
    stats: { videos: 61, fotos: 428, views: "112K", membros: "3,1K" },
    price: "€14,90",
    originalPrice: "€29,90",
    rating: 4.9,
    reviews: 521,
  },
  {
    id: 4,
    title: "Transexuais Portuguesas Vazadas",
    description: "Cenas privadas e exclusivas das criadoras trans mais seguidas em Portugal — sem censura.",
    badge: "🌟 EXCLUSIVO",
    cta: "Aceder ao Conteúdo",
    image: "/fotos/card4.mp4",
    stats: { videos: 34, fotos: 201, views: "67K", membros: "1,4K" },
    price: "€19,90",
    originalPrice: "€39,90",
    rating: 4.8,
    reviews: 176,
  },
  {
    id: 5,
    title: "Canais de Telegram Secretos",
    description: "Links diretos e sem censura para os grupos mais exclusivos — sem listas de espera.",
    badge: "⚡ IMEDIATO",
    cta: "Entrar no Grupo",
    image: "/fotos/card5.gif",
    stats: { videos: 0, fotos: 0, views: "38K", membros: "12K" },
    price: "€9,90",
    originalPrice: "€19,90",
    rating: 4.7,
    reviews: 893,
  },
  {
    id: 6,
    title: "Arquivos Excluídos & Backstage",
    description: "Conteúdos apagados das redes sociais que o algoritmo removeu — recuperados aqui.",
    badge: "🚫 EXPIRANDO",
    cta: "Recuperar Conteúdos",
    image: "/fotos/card6.gif",
    stats: { videos: 29, fotos: 187, views: "43K", membros: "890" },
    price: "€17,90",
    originalPrice: "€34,90",
    rating: 4.8,
    reviews: 142,
  },
  {
    id: 7,
    title: "Pack Premium da Semana",
    description: "Coletânea selecionada da semana com o melhor conteúdo das criadoras portuguesas.",
    badge: "⭐ COMPLETO",
    cta: "Baixar Pack",
    image: "/fotos/card7.gif",
    stats: { videos: 38, fotos: 264, views: "78K", membros: "2,7K" },
    price: "€29,90",
    originalPrice: "€59,90",
    rating: 4.9,
    reviews: 437,
  },
];

const NOTIF_NAMES = [
  "João M.", "Sofia R.", "Miguel A.", "Ana C.", "Pedro S.",
  "Mariana L.", "Rui F.", "Beatriz N.", "Tiago V.", "Carolina M.",
  "André P.", "Inês R.", "Bruno S.", "Catarina F.", "Diogo M.",
];
const NOTIF_CITIES = [
  "Lisboa", "Porto", "Braga", "Coimbra", "Faro",
  "Setúbal", "Aveiro", "Leiria", "Évora", "Funchal", "Viseu", "Guimarães",
];
const NOTIF_ACTIONS = [
  "comprou o Pack Premium da Semana",
  "desbloqueou os Canais de Telegram Secretos",
  "acedeu ao OnlyFans & Privacy VIP",
  "recuperou os Arquivos Excluídos",
  "desbloqueou os Vazados das Famosinhas",
  "abriu a Pasta VIP",
  "acedeu ao conteúdo Trans Exclusivo",
  "comprou os Flagras Reais",
  "entrou no grupo secreto",
];

interface Toast {
  id: number;
  name: string;
  city: string;
  action: string;
}

type Card = typeof CARDS[0];

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatCountdown(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

export default function HubPage() {
  const router = useRouter();
  const [onlineCount, setOnlineCount] = useState(1623);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [countdown, setCountdown] = useState(897);
  let toastId = 0;

  useEffect(() => {
    if (localStorage.getItem("pt_age_verified") !== "true") {
      router.replace("/presell");
    }
  }, [router]);

  /* Ticker */
  useEffect(() => {
    const t = setInterval(() => {
      setOnlineCount((p) => Math.max(1400, Math.min(1800, p + Math.floor(Math.random() * 21) - 10)));
    }, 3500);
    return () => clearInterval(t);
  }, []);

  /* Countdown no modal */
  useEffect(() => {
    if (!selectedCard) return;
    setCountdown(Math.floor(Math.random() * 600) + 600);
    const t = setInterval(() => {
      setCountdown((p) => (p <= 1 ? Math.floor(Math.random() * 600) + 600 : p - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [selectedCard]);

  /* Toast notifications */
  useEffect(() => {
    const fire = () => {
      const toast: Toast = {
        id: ++toastId,
        name: rand(NOTIF_NAMES),
        city: rand(NOTIF_CITIES),
        action: rand(NOTIF_ACTIONS),
      };
      setToasts((prev) => [...prev.slice(-2), toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 5000);
    };

    const schedule = () => {
      const delay = Math.floor(Math.random() * 7000) + 8000;
      return setTimeout(() => { fire(); schedule(); }, delay);
    };

    const initial = setTimeout(fire, 3000);
    const loop = schedule();
    return () => { clearTimeout(initial); clearTimeout(loop); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Fechar modal com Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setSelectedCard(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const openCard = useCallback((card: Card) => setSelectedCard(card), []);

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Ticker */}
      <div className="bg-neon/15 border-b border-neon/30 py-2 px-4 text-center">
        <p className="text-sm font-medium animate-blink">
          🔥 Utilizadores online agora:{" "}
          <span className="font-bold text-neon">{onlineCount.toLocaleString("pt-PT")}</span>{" "}
          | Links atualizados há 5 minutos.
        </p>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-gradient-neon glow-neon-sm flex items-center justify-center text-white text-xs font-black">PT</div>
            <span className="font-display font-bold text-base">
              PT <span className="text-gradient-neon">Premium</span> Hub
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Lock className="size-4 text-emerald-400" />
            <span className="text-muted-foreground hidden sm:inline">Ligação Segura</span>
            <span className="text-xs px-2 py-0.5 rounded-full border border-neon/50 text-neon font-bold">18+</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-16 md:py-24 px-4 radial-smoke">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon/40 bg-neon/10 text-neon text-sm font-semibold mb-6">
            <Flame className="size-4" />Acesso Liberado
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-black leading-tight mb-6">
            Vazados, flagras e os{" "}
            <span className="text-gradient-neon">melhores conteúdos privados</span>{" "}
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
          <div
            key={card.id}
            onClick={() => openCard(card)}
            className="group relative rounded-2xl border border-white/10 bg-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-neon/60 hover:shadow-[0_30px_60px_-30px_rgba(229,9,20,0.6)] active:scale-[0.99] cursor-pointer"
          >
            {/* Media */}
            <div className="relative aspect-[4/5] overflow-hidden bg-[radial-gradient(ellipse_at_center,oklch(0.18_0.08_25)_0%,oklch(0.06_0.01_20)_70%)]">
              {card.image.endsWith(".mp4") ? (
                <video
                  src={card.image}
                  autoPlay loop muted playsInline
                  className="absolute inset-0 w-full h-full object-cover blur-md brightness-75 scale-110 group-hover:blur-sm group-hover:brightness-90 transition-all duration-500"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={card.image} alt=""
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  className="absolute inset-0 w-full h-full object-cover blur-md brightness-75 scale-110 group-hover:blur-sm group-hover:brightness-90 transition-all duration-500"
                />
              )}

              {/* Lock overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10">
                <div className="size-14 rounded-full bg-black/60 border border-neon/40 flex items-center justify-center glow-neon-sm group-hover:scale-110 group-hover:glow-neon transition-all duration-300">
                  <Lock className="size-6 text-neon" />
                </div>
                <span className="text-xs text-muted-foreground font-medium">Conteúdo Bloqueado</span>
              </div>

              {/* Gradiente fusão */}
              <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-card to-transparent z-10" />

              {/* Badge */}
              <div className="absolute top-3 left-3 z-20">
                <span className="text-xs px-3 py-1 rounded-full bg-black/70 border border-neon/40 text-foreground font-semibold backdrop-blur-sm">
                  {card.badge}
                </span>
              </div>

              {/* Mini stats overlay */}
              <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between">
                {card.stats.videos > 0 && (
                  <span className="flex items-center gap-1 text-[10px] text-white/70 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
                    <Play className="size-2.5" />{card.stats.videos} vídeos
                  </span>
                )}
                <span className="flex items-center gap-1 text-[10px] text-white/70 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full ml-auto">
                  <Eye className="size-2.5" />{card.stats.views}
                </span>
              </div>
            </div>

            {/* Corpo */}
            <div className="p-4">
              <h3 className="font-display font-bold text-base mb-1 line-clamp-1">{card.title}</h3>
              <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{card.description}</p>

              {/* Rating */}
              <div className="flex items-center gap-1.5 mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`size-3 ${i < Math.floor(card.rating) ? "text-yellow-400 fill-yellow-400" : "text-white/20"}`} />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">{card.rating} ({card.reviews})</span>
                <span className="ml-auto text-xs text-neon font-bold">{card.price}</span>
              </div>

              <button className="w-full py-3 px-4 rounded-xl bg-gradient-neon text-white font-bold text-sm flex items-center justify-center gap-2 group-hover:scale-[1.01] group-hover:glow-neon active:scale-[0.98] transition-all duration-200">
                {card.cta}
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Rodapé */}
      <footer className="border-t border-white/5 py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="size-8 rounded-full border border-neon/50 glow-neon-sm flex items-center justify-center text-neon font-black text-xs shrink-0">+18</span>
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

      {/* ── Toast Notifications ── */}
      <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-card/95 border border-white/10 backdrop-blur-xl shadow-2xl max-w-[300px] animate-slide-left"
          >
            <div className="size-9 rounded-full bg-gradient-neon flex items-center justify-center text-white font-bold text-sm shrink-0 glow-neon-sm">
              {toast.name[0]}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground leading-tight">
                {toast.name} <span className="text-muted-foreground font-normal">de {toast.city}</span>
              </p>
              <p className="text-xs text-neon leading-tight truncate">{toast.action}</p>
            </div>
            <CheckCircle className="size-4 text-emerald-400 shrink-0" />
          </div>
        ))}
      </div>

      {/* ── Modal de Detalhe ── */}
      {selectedCard && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-sm animate-fade-in"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedCard(null); }}
        >
          <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border border-neon/20 bg-card overflow-hidden animate-slide-up shadow-[0_40px_80px_-20px_rgba(229,9,20,0.4)]">

            {/* Preview media */}
            <div className="relative h-48 overflow-hidden bg-[radial-gradient(ellipse_at_center,oklch(0.18_0.08_25)_0%,oklch(0.06_0.01_20)_70%)]">
              {selectedCard.image.endsWith(".mp4") ? (
                <video src={selectedCard.image} autoPlay loop muted playsInline
                  className="absolute inset-0 w-full h-full object-cover blur-sm brightness-60" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selectedCard.image} alt=""
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  className="absolute inset-0 w-full h-full object-cover blur-sm brightness-60" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-card via-black/40 to-transparent" />

              {/* Close button */}
              <button
                onClick={() => setSelectedCard(null)}
                className="absolute top-3 right-3 size-8 rounded-full bg-black/60 border border-white/20 flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                <X className="size-4" />
              </button>

              {/* Badge */}
              <div className="absolute top-3 left-3">
                <span className="text-xs px-3 py-1 rounded-full bg-black/70 border border-neon/40 text-foreground font-semibold backdrop-blur-sm">
                  {selectedCard.badge}
                </span>
              </div>

              {/* Lock */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-16 rounded-full bg-black/70 border border-neon/50 flex items-center justify-center glow-neon">
                  <Lock className="size-7 text-neon" />
                </div>
              </div>
            </div>

            {/* Conteúdo do modal */}
            <div className="p-5">
              <h2 className="font-display font-black text-xl mb-1">{selectedCard.title}</h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`size-3.5 ${i < Math.floor(selectedCard.rating) ? "text-yellow-400 fill-yellow-400" : "text-white/20"}`} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">{selectedCard.rating} · {selectedCard.reviews} avaliações</span>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {selectedCard.stats.videos > 0 && (
                  <div className="flex items-center gap-3 bg-black/40 rounded-xl p-3 border border-white/5">
                    <Play className="size-5 text-neon shrink-0" />
                    <div>
                      <p className="font-bold text-base leading-none">{selectedCard.stats.videos}</p>
                      <p className="text-xs text-muted-foreground">Vídeos</p>
                    </div>
                  </div>
                )}
                {selectedCard.stats.fotos > 0 && (
                  <div className="flex items-center gap-3 bg-black/40 rounded-xl p-3 border border-white/5">
                    <ImageIcon className="size-5 text-neon shrink-0" />
                    <div>
                      <p className="font-bold text-base leading-none">{selectedCard.stats.fotos}</p>
                      <p className="text-xs text-muted-foreground">Fotos</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 bg-black/40 rounded-xl p-3 border border-white/5">
                  <Eye className="size-5 text-neon shrink-0" />
                  <div>
                    <p className="font-bold text-base leading-none">{selectedCard.stats.views}</p>
                    <p className="text-xs text-muted-foreground">Visualizações</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-black/40 rounded-xl p-3 border border-white/5">
                  <Users className="size-5 text-neon shrink-0" />
                  <div>
                    <p className="font-bold text-base leading-none">{selectedCard.stats.membros}</p>
                    <p className="text-xs text-muted-foreground">Membros</p>
                  </div>
                </div>
              </div>

              {/* Countdown */}
              <div className="flex items-center justify-center gap-2 bg-neon/10 border border-neon/30 rounded-xl py-2 px-4 mb-4">
                <Clock className="size-4 text-neon" />
                <span className="text-sm font-medium">Oferta expira em</span>
                <span className="font-mono font-bold text-neon text-sm">{formatCountdown(countdown)}</span>
                <Zap className="size-4 text-yellow-400" />
              </div>

              {/* Preço */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-muted-foreground line-through">{selectedCard.originalPrice}</p>
                  <p className="font-display font-black text-3xl text-gradient-neon">{selectedCard.price}</p>
                </div>
                <div className="bg-neon/20 border border-neon/40 rounded-xl px-3 py-1.5 text-center">
                  <p className="text-xs text-muted-foreground">Poupas</p>
                  <p className="font-bold text-neon text-sm">50% OFF</p>
                </div>
              </div>

              {/* Botão comprar */}
              <a
                href={CONVERSION_URL}
                className="w-full py-4 rounded-xl bg-gradient-neon text-white font-black text-base flex items-center justify-center gap-2 glow-neon animate-pulse hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                <ShoppingCart className="size-5" />
                COMPRAR AGORA
                <ArrowRight className="size-5" />
              </a>

              {/* Segurança */}
              <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted-foreground/60">
                <span className="flex items-center gap-1"><Shield className="size-3 text-emerald-400" />Pagamento seguro</span>
                <span className="flex items-center gap-1"><CheckCircle className="size-3 text-emerald-400" />Acesso imediato</span>
                <span className="flex items-center gap-1"><Lock className="size-3 text-emerald-400" />100% privado</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
