import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Scuderia Ferrari Maranello | Drive Experience e supercarros sob medida",
  description:
    "Scuderia Ferrari em Maranello, Itália: dirija uma Ferrari com instrutor no Drive Experience, compre sob medida ou escolha um seminovo certificado. Agende pelo WhatsApp.",
  openGraph: {
    title: "Scuderia Ferrari Maranello",
    description: "Drive Experience, compra sob medida e seminovos certificados em Maranello, Itália.",
    images: ["/img/showroom.webp"],
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0D0D0D",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={montserrat.variable}>
      <body>{children}</body>
    </html>
  );
}
