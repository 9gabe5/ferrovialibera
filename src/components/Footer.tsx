import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16">
      <div className="filetto-sottile" aria-hidden="true" />
      <div className="bg-antracite text-white">
        <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-marchio font-extrabold text-xl">FerroViaLibera APS</p>
            <p className="text-gray-300 text-sm mt-2">
              Per un settore ferroviario libero da discriminazioni e pienamente inclusivo.
            </p>
            <a href="mailto:info@ferrovialibera.it" className="block mt-3 underline text-sm">
              info@ferrovialibera.it
            </a>
          </div>
          <div>
            <p className="font-display font-bold uppercase text-sm tracking-wide mb-2">Esplora</p>
            <ul className="space-y-1 text-sm text-gray-300">
              <li><Link href="/tesseramento" className="hover:text-white">Tesseramento</Link></li>
              <li><Link href="/rinnovo" className="hover:text-white">Rinnovo tessera</Link></li>
              <li><Link href="/eventi" className="hover:text-white">Eventi</Link></li>
              <li><Link href="/statuto" className="hover:text-white">Statuto</Link></li>
              <li><Link href="/negozio" className="hover:text-white">Negozio</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-display font-bold uppercase text-sm tracking-wide mb-2">Seguici</p>
            <ul className="space-y-1 text-sm text-gray-300">
              <li><a href="https://instagram.com/ferrovialibera" className="hover:text-white">Instagram</a></li>
              <li><a href="https://www.facebook.com/profile.php?id=61551609314307" className="hover:text-white">Facebook</a></li>
              <li><a href="https://www.linkedin.com/company/ferrovialibera" className="hover:text-white">LinkedIn</a></li>
              <li><a href="https://www.tiktok.com/@ferrovialibera" className="hover:text-white">TikTok</a></li>
              <li><a href="https://chat.whatsapp.com/FV2NFHRpmF38fSZi4ffXGi" className="hover:text-white">Gruppo WhatsApp</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700">
          <p className="max-w-6xl mx-auto px-4 py-4 text-xs text-gray-400">
            © {new Date().getFullYear()} FerroViaLibera APS · Sito realizzato in casa, senza piattaforme terze 🏳️‍🌈
          </p>
        </div>
      </div>
    </footer>
  );
}
