import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

const UTMIFY_URL = "https://api.utmify.com.br/api-credentials/orders";
const META_PIXEL_ID = "1584566932662945";
const META_API_VERSION = "v21.0";

function toUtmifyDate(d = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())} `
       + `${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}`;
}
const toCents = (v: number) => Math.round(Number(v) * 100);
const sha256 = (s: string) => createHash("sha256").update(s.trim().toLowerCase()).digest("hex");
const hashIf = (v?: string | null) => (v ? sha256(v) : undefined);

async function sendUtmify(payload: Record<string, unknown>) {
  const token = process.env.UTMIFY_API_TOKEN;
  if (!token) { console.warn("UTMIFY_API_TOKEN missing"); return; }
  const res = await fetch(UTMIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-token": token },
    body: JSON.stringify(payload),
  });
  console.log("UTMify paid:", res.status, await res.text());
}

async function sendMetaCAPI(data: {
  orderId: string; value: number; currency: string;
  email?: string | null; phone?: string | null;
  firstName?: string | null; lastName?: string | null;
  clientIp?: string | null; userAgent?: string | null;
  fbp?: string | null; fbc?: string | null;
  eventSourceUrl?: string | null;
  productId?: string;
}) {
  const token = process.env.META_PIXEL_ACCESS_TOKEN;
  if (!token) { console.warn("META_PIXEL_ACCESS_TOKEN missing"); return; }

  const phone = data.phone?.replace(/\D/g, "");
  const user_data: Record<string, unknown> = {
    em:      data.email     ? [sha256(data.email)]     : undefined,
    ph:      phone          ? [sha256(phone)]           : undefined,
    fn:      hashIf(data.firstName),
    ln:      hashIf(data.lastName),
    country: data.fbp ? undefined : ["pt"],
    client_ip_address: data.clientIp ?? undefined,
    client_user_agent: data.userAgent ?? undefined,
    fbp: data.fbp ?? undefined,
    fbc: data.fbc ?? undefined,
  };
  Object.keys(user_data).forEach((k) => user_data[k] === undefined && delete user_data[k]);

  const event = {
    event_name: "Purchase",
    event_time: Math.floor(Date.now() / 1000),
    event_id: data.orderId,
    action_source: "website",
    event_source_url: data.eventSourceUrl ?? "https://hot-tuga.vercel.app/",
    user_data,
    custom_data: {
      currency: data.currency ?? "EUR",
      value: Number(data.value.toFixed(2)),
      order_id: data.orderId,
      content_ids: data.productId ? [data.productId] : undefined,
      content_type: "product",
    },
  };

  const url = `https://graph.facebook.com/${META_API_VERSION}/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`;
  const body: Record<string, unknown> = { data: [event] };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  console.log("Meta CAPI:", res.status, await res.text());
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }

  console.log("Webhook received:", JSON.stringify(body));

  // WaylinxPay envia campo status / payment_status
  const rawStatus = (body.status ?? body.payment_status ?? "") as string;
  const isPaid = ["paid", "approved", "completed", "success"].includes(rawStatus.toLowerCase());

  if (!isPaid) return NextResponse.json({ ok: true, message: "Not a paid event" });

  const orderId  = (body.orderId ?? body.sessionId ?? body.checkoutSessionId ?? body.order_id ?? "") as string;
  const value    = Number(body.total_price ?? body.amount ?? body.value ?? 0);
  const currency = (body.currency ?? "EUR") as string;

  const customer = (body.customer ?? body.buyer ?? {}) as Record<string, string>;
  const tracking = (body.tracking ?? body.tracking_parameters ?? {}) as Record<string, string>;

  const ip        = req.headers.get("x-forwarded-for")?.split(",")[0] ?? null;
  const userAgent = req.headers.get("user-agent") ?? null;

  const nameParts = (customer.name ?? "").split(" ");
  const cartItems = body.cartItems as Array<{ productId?: string }> | undefined;
  const productId = (body.productId ?? cartItems?.[0]?.productId ?? "") as string;

  await Promise.allSettled([
    sendUtmify({
      orderId,
      platform: "HotTuga",
      paymentMethod: "credit_card",
      status: "paid",
      createdAt: toUtmifyDate(),
      approvedDate: toUtmifyDate(),
      customer: {
        name:     customer.name  ?? "Cliente",
        email:    customer.email ?? "",
        phone:    customer.phone ?? null,
        document: customer.document ?? null,
        country:  "PT",
      },
      products: [{
        id: productId || "prod_unknown",
        name: (body.title ?? "Produto") as string,
        planId: null, planName: null,
        quantity: 1,
        priceInCents: toCents(value),
      }],
      trackingParameters: {
        utm_source:   tracking.utm_source   ?? null,
        utm_medium:   tracking.utm_medium   ?? null,
        utm_campaign: tracking.utm_campaign ?? null,
        utm_content:  tracking.utm_content  ?? null,
        utm_term:     tracking.utm_term     ?? null,
        src: tracking.src ?? null,
        sck: tracking.sck ?? null,
      },
      commission: {
        totalPriceInCents: toCents(value),
        gatewayFeeInCents: 0,
        userCommissionInCents: toCents(value),
        currency: "EUR",
      },
      isTest: false,
    }),
    sendMetaCAPI({
      orderId,
      value,
      currency,
      email:     customer.email ?? null,
      phone:     customer.phone ?? null,
      firstName: nameParts[0] ?? null,
      lastName:  nameParts.slice(1).join(" ") || null,
      clientIp:  ip,
      userAgent,
      fbp: tracking.fbp ?? null,
      fbc: tracking.fbc ?? null,
      eventSourceUrl: `${process.env.NEXT_PUBLIC_BASE_URL ?? "https://hot-tuga.vercel.app"}/sucesso`,
      productId,
    }),
  ]);

  return NextResponse.json({ ok: true });
}
