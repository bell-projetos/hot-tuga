import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import Script from "next/script";
import TrackingCapture from "@/components/TrackingCapture";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

const FB_PIXEL_ID = "1584566932662945";

export const metadata: Metadata = {
  title: "PT Premium Hub — Vazados & Conteúdo Privado de Portugal",
  description: "O hub definitivo de conteúdo privado português.",
  robots: "noindex,nofollow",
  openGraph: {
    title: "PT Premium Hub",
    description: "O hub definitivo de conteúdo privado português.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PT Premium Hub",
    description: "O hub definitivo de conteúdo privado português.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        {/* Meta Pixel */}
        <Script id="fb-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
          (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init','${FB_PIXEL_ID}');fbq('track','PageView');
        `}</Script>

        {/* UTMify — captura UTMs */}
        <Script
          src="https://cdn.utmify.com.br/scripts/utms/latest.js"
          data-utmify-prevent-xcod-sck=""
          data-utmify-prevent-subids=""
          strategy="afterInteractive"
        />
        {/* UTMify — pixel de atribuição */}
        <Script id="utmify-pixel" strategy="afterInteractive">{`
          window.pixelId = "698d0c007691ad3652d56e05";
          var a = document.createElement("script");
          a.setAttribute("async","");
          a.setAttribute("defer","");
          a.setAttribute("src","https://cdn.utmify.com.br/scripts/pixel/pixel.js");
          document.head.appendChild(a);
        `}</Script>
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        {/* noscript fallback do FB Pixel — deve estar no body */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img height="1" width="1" style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        <TrackingCapture />
        {children}
      </body>
    </html>
  );
}
