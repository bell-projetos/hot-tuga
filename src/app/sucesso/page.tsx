"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Lock, ArrowRight, Loader2 } from "lucide-react";

declare global {
  interface Window { fbq?: (...a: unknown[]) => void }
}

function SucessoContent() {
  const router = useRouter();
  const params = useSearchParams();
  const fired = useRef(false);

  const orderId  = params.get("orderId")  ?? "";
  const value    = Number(params.get("value") ?? 0);
  const currency = params.get("currency") ?? "EUR";

  useEffect(() => {
    if (fired.current || !orderId) return;
    const tryFire = (n = 0) => {
      if (typeof window.fbq === "function") {
        window.fbq("track", "Purchase",
          { value: Number(value.toFixed(2)), currency, order_id: orderId },
          { eventID: orderId }
        );
        fired.current = true;
      } else if (n < 20) {
        setTimeout(() => tryFire(n + 1), 250);
      }
    };
    tryFire();
  }, [orderId, value, currency]);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4 radial-smoke">
      <div className="w-full max-w-md text-center">
        <div className="size-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="size-10 text-emerald-400" />
        </div>
        <h1 className="font-display font-black text-3xl md:text-4xl mb-3">
          Pagamento <span className="text-gradient-neon">Confirmado!</span>
        </h1>
        <p className="text-muted-foreground text-base mb-8">
          O teu acesso foi ativado. Verifica o teu e-mail para receber os detalhes de acesso.
        </p>
        <div className="rounded-2xl border border-white/10 bg-card p-5 mb-6 text-left space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="size-4 text-emerald-400" /><span>Acesso imediato ativado</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="size-4 text-emerald-400" /><span>E-mail de confirmação enviado</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="size-4 text-emerald-400" /><span>Pagamento processado com segurança</span>
          </div>
        </div>
        <button
          onClick={() => router.push("/")}
          className="w-full py-4 rounded-xl bg-gradient-neon text-white font-bold text-base flex items-center justify-center gap-2 glow-neon"
        >
          Voltar ao Hub<ArrowRight className="size-5" />
        </button>
      </div>
    </main>
  );
}

export default function SucessoPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="size-8 text-neon animate-spin" />
      </main>
    }>
      <SucessoContent />
    </Suspense>
  );
}
