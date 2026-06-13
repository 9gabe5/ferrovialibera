"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const voci = [
  { href: "/", label: "Home" },
  { href: "/su-di-noi", label: "Su di noi" },
  { href: "/progetti", label: "Progetti" },
  { href: "/eventi", label: "Eventi" },
  { href: "/tessera", label: "Tessera" },
  { href: "/social", label: "Social" },
  { href: "/press", label: "Press" },
  { href: "/statuto", label: "Statuto" },
  { href: "/contatti", label: "Contatti" },
];

export default function Nav() {
  const [aperto, setAperto] = useState(false);
  const path = usePathname();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16" aria-label="Principale">
        <Link href="/" className="flex items-center gap-2 font-marchio font-extrabold text-2xl text-accento tracking-tight" onClick={() => setAperto(false)}>
          <img src="/immagini/logo-fvl.png" alt="" width={40} height={40} />
          FerroViaLibera
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {voci.map((v) => (
            <li key={v.href}>
              <Link
                href={v.href}
                className={`px-3 py-2 font-display font-semibold text-sm uppercase tracking-wide hover:text-accento ${path === v.href ? "text-accento border-b-2 border-accento" : "text-antracite"}`}
              >
                {v.label}
              </Link>
            </li>
          ))}
          <li className="ml-2">
            <Link href="/tesseramento" className="btn btn-accento text-xs">Tesserati</Link>
          </li>
        </ul>

        <button
          className="md:hidden p-2"
          aria-expanded={aperto}
          aria-label={aperto ? "Chiudi menu" : "Apri menu"}
          onClick={() => setAperto(!aperto)}
        >
          <span className="block w-6 h-0.5 bg-antracite mb-1.5" />
          <span className="block w-6 h-0.5 bg-antracite mb-1.5" />
          <span className="block w-6 h-0.5 bg-antracite" />
        </button>
      </nav>

      {aperto && (
        <ul className="md:hidden bg-white border-t border-gray-200 px-4 py-2">
          {voci.map((v) => (
            <li key={v.href}>
              <Link
                href={v.href}
                className="block py-3 font-display font-semibold uppercase tracking-wide border-b border-gray-100"
                onClick={() => setAperto(false)}
              >
                {v.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/tesseramento" className="block py-3 font-display font-bold uppercase text-accento" onClick={() => setAperto(false)}>
              Tesserati →
            </Link>
          </li>
        </ul>
      )}
    </header>
  );
}
