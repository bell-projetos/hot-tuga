import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { CARDS } from "@/lib/cards";

const UTMIFY_URL = "https://api.utmify.com.br/api-credentials/orders";

function toUtmifyDate(d = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())} `
       + `${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}`;
}
const toCents = (v: number) => Math.round(v * 100);

async function sendUtmify(payload: Record<string, unknown>) {
  const token = process.env.UTMIFY_API_TOKEN;
  if (!token) { console.warn("[utmify] UTMIFY_API_TOKEN missing"); return; }
  const res = await fetch(UTMIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-token": token },
    body: JSON.stringify(payload),
  });
  console.log("[utmify] waiting_payment →", res.status, await res.text());
}

export async function POST(req: NextRequest) {
  const { cardId, tracking } = await req.json();

  const card = CARDS.find((c) => c.id === cardId);
  if (!card) return NextResponse.json({ error: "Card not found" }, { status: 404 });

  const apiKey = process.env.NEXOR_SECRET_KEY;
  const workspaceId = process.env.NEXOR_WORKSPACE_ID;

  if (!apiKey || !workspaceId) {
    console.error("[checkout] env vars missing: NEXOR_SECRET_KEY or NEXOR_WORKSPACE_ID");
    return NextResponse.json({ error: "Configuração de pagamento em falta" }, { status: 503 });
  }

  const sessionToken = randomBytes(12).toString("hex");
  const orderId = `sess_${sessionToken}`;

  // Payload mínimo conforme a documentação da WaylinxPay
  const checkoutPayload = {
    workspaceId,
    item_count: 1,
    total_price: card.priceAmount,
    currency: "BRL",
    language: "pt-BR",
    sessionId: orderId,
    cartItems: [{
      productId: `prod_${cardId}`,
      title: card.title,
      price: card.priceAmount,
      quantity: 1,
    }],
  };

  console.log("[checkout] → WaylinxPay payload:", JSON.stringify(checkoutPayload));

  let checkoutRes: Response;
  try {
    checkoutRes = await fetch("https://api.waylinxpay.com/checkout/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(checkoutPayload),
    });
  } catch (e) {
    console.error("[checkout] fetch NETWORK ERROR:", String(e));
    return NextResponse.json({ error: "Erro de rede ao contactar gateway", detail: String(e) }, { status: 502 });
  }

  const responseText = await checkoutRes.text();
  console.log("[checkout] ← WaylinxPay status:", checkoutRes.status, "body:", responseText);

  if (!checkoutRes.ok) {
    return NextResponse.json(
      { error: "Falha ao criar checkout", detail: responseText, wlStatus: checkoutRes.status },
      { status: 502 }
    );
  }

  let parsed: { checkoutUrl?: string; checkoutSessionId?: string };
  try { parsed = JSON.parse(responseText); } catch {
    return NextResponse.json({ error: "Resposta inválida do gateway" }, { status: 502 });
  }

  const { checkoutUrl, checkoutSessionId } = parsed;
  if (!checkoutUrl) {
    return NextResponse.json({ error: "checkoutUrl não retornado", detail: responseText }, { status: 502 });
  }

  // UTMify waiting_payment (fire-and-forget)
  sendUtmify({
    orderId,
    platform: "HotTuga",
    paymentMethod: "credit_card",
    status: "waiting_payment",
    createdAt: toUtmifyDate(),
    approvedDate: null,
    customer: { name: "Cliente", email: "cliente@email.com", country: "PT" },
    products: [{
      id: `prod_${cardId}`,
      name: card.title,
      planId: null, planName: null,
      quantity: 1,
      priceInCents: toCents(card.priceAmount),
    }],
    trackingParameters: {
      utm_source:   tracking?.utm_source   ?? null,
      utm_medium:   tracking?.utm_medium   ?? null,
      utm_campaign: tracking?.utm_campaign ?? null,
      utm_content:  tracking?.utm_content  ?? null,
      utm_term:     tracking?.utm_term     ?? null,
      src: tracking?.src ?? null,
      sck: tracking?.sck ?? null,
    },
    commission: {
      totalPriceInCents: toCents(card.priceAmount),
      gatewayFeeInCents: 0,
      userCommissionInCents: toCents(card.priceAmount),
      currency: "EUR",
    },
    isTest: false,
  }).catch(console.error);

  return NextResponse.json({ checkoutUrl, orderId, checkoutSessionId });
}
