export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : null;
}

export function captureTracking() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const fbclid = params.get("fbclid");

  if (fbclid && !getCookie("_fbc")) {
    const fbc = `fb.1.${Date.now()}.${fbclid}`;
    document.cookie = `_fbc=${fbc}; path=/; max-age=${60 * 60 * 24 * 90}`;
  }

  const tracking = {
    utm_source:   params.get("utm_source")   ?? localStorage.getItem("utm_source"),
    utm_medium:   params.get("utm_medium")   ?? localStorage.getItem("utm_medium"),
    utm_campaign: params.get("utm_campaign") ?? localStorage.getItem("utm_campaign"),
    utm_content:  params.get("utm_content")  ?? localStorage.getItem("utm_content"),
    utm_term:     params.get("utm_term")     ?? localStorage.getItem("utm_term"),
    src:   params.get("src"),
    sck:   params.get("sck"),
    fbp:   getCookie("_fbp"),
    fbc:   getCookie("_fbc"),
    fbclid,
  };

  const UTM_KEYS = ["utm_source","utm_medium","utm_campaign","utm_content","utm_term"] as const;
  UTM_KEYS.forEach((k) => { if (tracking[k]) localStorage.setItem(k, tracking[k]!); });

  return tracking;
}

export function getStoredTracking() {
  if (typeof window === "undefined") return {};
  return {
    utm_source:   localStorage.getItem("utm_source"),
    utm_medium:   localStorage.getItem("utm_medium"),
    utm_campaign: localStorage.getItem("utm_campaign"),
    utm_content:  localStorage.getItem("utm_content"),
    utm_term:     localStorage.getItem("utm_term"),
    src:  null as string | null,
    sck:  null as string | null,
    fbp:  getCookie("_fbp"),
    fbc:  getCookie("_fbc"),
  };
}
