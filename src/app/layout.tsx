import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
