import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { BusinessHeader } from "@/components/public/BusinessHeader";
import { ServiceList } from "@/components/public/ServiceList";
import { ProfessionalList } from "@/components/public/ProfessionalList";
import { MapEmbed } from "@/components/public/MapEmbed";
import { PublicFooter } from "@/components/layout/PublicFooter";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("businesses")
    .select("name, description, cover_url, city, slug")
    .eq("slug", params.slug)
    .single();

  if (!data) return { title: "Página não encontrada" };

  const title = data.name;
  const description =
    data.description ??
    `Agende online com ${data.name}${data.city ? ` em ${data.city}` : ""}.`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://slotme.vercel.app";
  const pageUrl = `${appUrl}/${data.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: "website",
      ...(data.cover_url && {
        images: [{ url: data.cover_url, width: 1200, height: 630, alt: title }],
      }),
    },
    twitter: {
      card: data.cover_url ? "summary_large_image" : "summary",
      title,
      description,
      ...(data.cover_url && { images: [data.cover_url] }),
    },
  };
}

export default async function BusinessPage({ params }: Props) {
  const supabase = createServerSupabaseClient();

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!business) notFound();

  const [{ data: services }, { data: professionals }] = await Promise.all([
    supabase.from("services").select("*").eq("business_id", business.id),
    supabase.from("professionals").select("*").eq("business_id", business.id),
  ]);

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* BusinessHeader extends full width (cover is edge-to-edge) */}
      <BusinessHeader business={business} />

      <div className="max-w-3xl mx-auto px-4 pb-32 md:pb-16">
        <div className="flex flex-col gap-10 mt-6">
          {(services?.length ?? 0) === 0 && (professionals?.length ?? 0) === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#374151] font-medium">Em breve</p>
              <p className="text-[#6B7280] text-sm mt-1">
                Este negócio ainda está configurando seus serviços. Volte em breve.
              </p>
            </div>
          ) : (
            <>
              {(services?.length ?? 0) > 0 && (
                <ServiceList services={services ?? []} slug={params.slug} />
              )}
              {(professionals?.length ?? 0) > 0 && (
                <ProfessionalList professionals={professionals ?? []} />
              )}
            </>
          )}
          {business.maps_embed_url && (
            <MapEmbed embedUrl={business.maps_embed_url} />
          )}
        </div>

        {/* CTA desktop */}
        <div className="hidden md:flex justify-center mt-10">
          <Link
            href={`/${params.slug}/agendar`}
            className="inline-flex items-center justify-center font-semibold rounded-[12px] px-8 py-3.5 text-base
              bg-[#C2410C] text-[#F5F0E8] hover:bg-[#9A3412] transition-colors duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C] focus-visible:ring-offset-2"
          >
            Agendar agora →
          </Link>
        </div>
      </div>

      <PublicFooter />

      {/* CTA mobile fixo */}
      <div
        className="fixed bottom-0 left-0 right-0 md:hidden z-10 px-4 pb-6 pt-3"
        style={{ background: "linear-gradient(to top, #F5F0E8 70%, transparent)" }}
      >
        <Link
          href={`/${params.slug}/agendar`}
          className="flex items-center justify-center w-full font-semibold rounded-[12px] py-3.5 text-base
            bg-[#C2410C] text-[#F5F0E8] hover:bg-[#9A3412] transition-colors duration-200
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C]"
        >
          Agendar agora →
        </Link>
      </div>
    </div>
  );
}
