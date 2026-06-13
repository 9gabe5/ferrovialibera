import type { Metadata } from "next";
import "@fontsource/archivo/500.css";
import "@fontsource/archivo/700.css";
import "@fontsource/archivo/800.css";
import "@fontsource/archivo/900.css";
import "@fontsource/albert-sans/400.css";
import "@fontsource/albert-sans/400-italic.css";
import "@fontsource/albert-sans/500.css";
import "@fontsource/albert-sans/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/600.css";
import "@fontsource-variable/bricolage-grotesque/wght.css";
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
      <body>
        <div className="filetto" aria-hidden="true" />
        <Nav />
        <main className="min-h-[70vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
