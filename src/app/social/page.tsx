import { supabasePublic } from "@/lib/supabase";
import InstagramEmbeds from "@/components/InstagramEmbeds";

export const metadata = { title: "Social | FerroViaLibera", description: "I nostri post da Instagram." };
export const revalidate = 300;

async function caricaPost() {
  try {
    const { data } = await supabasePublic.from("social_post").select("url, ordine, created_at").order("ordine").order("created_at", { ascending: false });
    return (data ?? []).map((p) => p.url as string);
  } catch {
    return [];
  }
}

export default async function Social() {
  const urls = await caricaPost();
  return (
    <>
      <section className="cartello">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl">📸 Social</h1>
          <p className="normal-case tracking-normal font-body font-normal text-antracite/70 mt-2">
            Quello che combiniamo, direttamente da Instagram.
          </p>
        </div>
        <div className="filetto" aria-hidden="true" />
      </section>
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <a href="https://instagram.com/ferrovialibera" className="btn btn-accento">Seguici su Instagram → @ferrovialibera</a>
        </div>
        <InstagramEmbeds urls={urls} />
      </section>
    </>
  );
}
