import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verificação de Idade — PT Premium Hub",
  robots: "noindex,nofollow",
};

export default function PresellLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
