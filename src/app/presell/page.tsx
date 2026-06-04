"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Shield } from "lucide-react";

export default function PresellPage() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("pt_age_verified") === "true") {
      router.replace("/");
    }
  }, [router]);

  const handleEnter = () => {
    localStorage.setItem("pt_age_verified", "true");
    router.replace("/");
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4 radial-smoke">
      <div className="w-full max-w-lg">
        <div className="rounded-3xl border border-neon/20 bg-black/80 backdrop-blur-xl p-8 shadow-[0_40px_80px_-20px_rgba(229,9,20,0.3)]">

          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-neon/40 bg-neon/10 text-neon text-sm font-semibold animate-blink">
              <AlertTriangle className="size-4" />
              ACESSO RESTRITO 18+
            </div>
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-black text-center mb-4 text-gradient-neon">
            ⚠️ ALERTA DE CONTEÚDO RESTRITO
          </h1>

          <p className="text-center text-muted-foreground text-sm md:text-base mb-8 leading-relaxed">
            Estás prestes a aceder a{" "}
            <span className="text-foreground font-medium">
              flagras, conteúdos privados e vazados de Portugal
            </span>
            . Este material é exclusivamente para maiores de 18 anos.{" "}
            <span className="text-neon/80 text-xs">
              Qualquer gravação de ecrã é estritamente proibida.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleEnter}
              className="flex-1 py-4 px-6 rounded-xl bg-gradient-neon text-white font-bold text-base animate-pulse glow-neon hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer"
            >
              ENTRAR E VER AGORA (18+)
            </button>
            <a
              href="https://www.google.com"
              className="flex-1 py-4 px-6 rounded-xl border border-white/20 bg-transparent text-foreground font-medium text-base text-center hover:bg-white/5 active:scale-[0.98] transition-all"
            >
              SAIR
            </a>
          </div>

          <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-6">
            <Shield className="size-3 text-emerald-400" />
            Ambiente seguro e encriptado. A tua privacidade está protegida.
          </p>
        </div>
      </div>
    </main>
  );
}
