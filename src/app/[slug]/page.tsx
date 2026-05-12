import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { BusinessHeader } from "@/components/public/BusinessHeader";
import { ServiceList } from "@/components/public/ServiceList";
import { ProfessionalList } from "@/components/public/ProfessionalList";
import { MapEmbed } from "@/components/public/MapEmbed";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { Button } from "@/components/ui/Button";

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
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <BusinessHeader business={business} />

        <div className="flex flex-col gap-10 mt-8">
          {(services?.length ?? 0) > 0 && (
            <ServiceList services={services ?? []} />
          )}
          {(professionals?.length ?? 0) > 0 && (
            <ProfessionalList professionals={professionals ?? []} />
          )}
          {business.maps_embed_url && (
            <MapEmbed embedUrl={business.maps_embed_url} />
          )}
        </div>

        {/* CTA desktop */}
        <div className="hidden md:flex justify-center mt-10">
          <Button href={`/${params.slug}/agendar`} size="lg">Agendar agora</Button>
        </div>
      </div>

      <PublicFooter />

      {/* CTA mobile fixo */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-[#f1f5f9] p-4 safe-bottom">
        <Button href={`/${params.slug}/agendar`} size="lg" className="w-full">Agendar agora</Button>
      </div>
    </div>
  );
}
