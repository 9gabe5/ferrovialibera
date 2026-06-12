import Link from "next/link";

export const metadata = { title: "Progetti | FerroViaLibera" };

const progetti = [
  {
    titolo: "Onda Pride",
    testo: "FerroViaLibera partecipa attivamente ai Pride organizzati in giro per l'Italia. Il nostro Comitato Pride coordina le attività e l'organizzazione.",
    link: "https://ondapride.it/pride/",
    cta: "Partecipa al Pride",
    img: "https://static.wixstatic.com/media/11062b_adf8a5b6fe91460a89adbf38e4368df5~mv2.jpg",
  },
  {
    titolo: "Gite e Raduni",
    testo: "Organizziamo raduni e gite ogni mese, per favorire l'aggregazione sociale, farci conoscere e offrire spazi sicuri per tuttə.",
    link: "/eventi",
    cta: "Iscriviti ai nostri eventi",
    img: "https://static.wixstatic.com/media/a7f111_74cb07a3eff64109ae13bf6fa78d3df9~mv2.jpeg",
  },
  {
    titolo: "La Gente di FerroViaLibera",
    testo: "Raccogliamo anonimamente storie, messaggi e stati d'animo da chiunque voglia uno spazio dove sfogarsi, condividere qualcosa o semplicemente parlare.",
    link: "https://docs.google.com/forms/d/e/1FAIpQLScAoTM1wZOQ2palqvmeAQ6kOIqLTs5vQibFh-zfEjUP__-Jiw/viewform",
    cta: "Scrivici anonimamente",
    img: "https://static.wixstatic.com/media/11062b_35ff8ebf3a6f4dc99e81c49521ec9dfc~mv2.jpg",
  },
  {
    titolo: "Sensibilizzare sul linguaggio",
    testo: "Diffondiamo consapevolezza sull'uso del linguaggio, per istruire ed istruirci a essere il più rispettosə e inclusivə possibile.",
    link: "/tesseramento",
    cta: "Dai il tuo contributo",
    img: "https://static.wixstatic.com/media/nsplsh_ac47e0aea49647188e4fc447df5d45bc~mv2.jpg",
  },
  {
    titolo: "Riunioni Associative",
    testo: "Il cuore pulsante di FerroViaLibera: ogni mese ci riuniamo online per discutere temi, ordini del giorno e progetti.",
    link: "https://teams.live.com/l/community/FEAILYxpD9_stO-rAg",
    cta: "Prossime riunioni",
    img: "https://static.wixstatic.com/media/11062b_bb630e5ccffe475a83e356317ef57149~mv2.jpg",
  },
  {
    titolo: "Tessere Alias",
    testo: "Un'iniziativa che permette alle persone transgender, non binarie e a chiunque scelga di usare un nome diverso di viaggiare in modo sicuro e rispettoso della propria identità di genere.",
    link: "/tesseramento",
    cta: "Dai il tuo contributo",
    img: "https://static.wixstatic.com/media/nsplsh_75556b6a65577853683763~mv2_d_5616_3744_s_4_2.jpg",
  },
];

export default function Progetti() {
  return (
    <>
      <section className="cartello">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl">Progetti</h1>
          <p className="normal-case tracking-normal font-body font-normal text-blue-100 mt-2">
            I binari su cui corre il nostro impegno.
          </p>
        </div>
        <div className="filetto" aria-hidden="true" />
      </section>

      <section className="max-w-6xl mx-auto px-4 py-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {progetti.map((p) => (
          <article key={p.titolo} className="border border-gray-200 bg-white flex flex-col">
            <img src={p.img} alt="" className="w-full aspect-[16/9] object-cover" />
            <div className="p-5 flex flex-col flex-1">
              <h2 className="font-display font-bold text-xl text-blu">{p.titolo}</h2>
              <p className="mt-2 text-pietrisco flex-1">{p.testo}</p>
              {p.link.startsWith("/") ? (
                <Link href={p.link} className="btn btn-bordo mt-4 self-start text-xs">{p.cta}</Link>
              ) : (
                <a href={p.link} className="btn btn-bordo mt-4 self-start text-xs">{p.cta}</a>
              )}
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
