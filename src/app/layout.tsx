import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "FerroViaLibera | Associazione di Ferrovierə LGBTQ+",
  description:
    "FerroViaLibera: associazione che lavora per un settore ferroviario libero da discriminazioni e pienamente inclusivo.",
  metadataBase: new URL("https://www.ferrovialibera.it"),
  openGraph: {
    title: "FerroViaLibera | Associazione di Ferrovierə LGBTQ+",
    description: "Per una ferrovia libera da discriminazioni.",
    siteName: "FerroViaLibera",
    locale: "it_IT",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;700;800;900&family=Albert+Sans:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="filetto" aria-hidden="true" />
        <Nav />
        <main className="min-h-[70vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
