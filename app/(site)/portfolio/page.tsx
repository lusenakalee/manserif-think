import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client"; // adjust to your client path
import { portfolioQuery } from "@/lib/sanity/queries/portfolio";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Browse the portfolio of Kenyan artist Warren Kamau — conceptual paintings, collage, sculpture and large-scale art installations from the Manserif.Think studio. Explore original artwork, behind-the-scenes process videos and recent creative projects.",
};

export default async function Page() {
  const data = await client.fetch(
    portfolioQuery,
    {},
    { next: { revalidate: 60 } },
  );

  if (!data) notFound();

  const { header, about } = data;
  const paragraphs: string[] = about?.paragraphs ?? [];

  return (
    <main className="min-h-screen w-full bg-white text-black">
      <div className="mx-auto max-w-[1600px] px-6 pb-24 pt-28 md:px-12 md:pt-32 lg:px-16">
        {/* Heading */}
        <h1 className="mb-10 text-5xl font-bold uppercase tracking-tight md:mb-14 md:text-7xl">
          {about?.heading || "Bio"}
        </h1>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12 lg:gap-16">
          {/* Image */}
          <div className="md:col-span-6 lg:col-span-5">
            {header?.imageUrl && (
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100 md:sticky md:top-28">
                <Image
                  src={header.imageUrl}
                  alt={header.imageAlt || "Portfolio image"}
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover object-top"
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-6 lg:col-span-6 lg:col-start-7">
            <div className="max-w-[560px] space-y-4 text-[15px] leading-[1.6] text-neutral-900 md:text-base">
              {paragraphs.map((text, i) => (
                <p key={i}>{text}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}