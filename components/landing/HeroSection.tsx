import Image from "next/image";
import { Mail } from "lucide-react";

interface HeroProps {
  image?: { src: string | null; alt: string; lqip?: string | null };
  headline: { prefix: string; highlight: string; suffix: string };
  contact: { label: string; email: string; instagramUrl: string };
}

export default function HeroSection({ image, headline, contact }: HeroProps) {
  return (
    <section className="relative h-svh w-full overflow-hidden bg-[#1a1a1a]">
      {image?.src && (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          {...(image.lqip
            ? { placeholder: "blur" as const, blurDataURL: image.lqip }
            : {})}
        />
      )}

      {/* Optional dark overlay for text legibility */}
      <div className="absolute inset-0 bg-black/30" />

      <div className="absolute inset-x-8 bottom-8 z-[2] flex items-end justify-between">
        <div className="w-3/5 max-[1000px]:w-full">
          <h1 className="text-[clamp(1.75rem,3vw,3rem)] font-normal leading-[1.1] tracking-[-0.01em] text-white">
            {headline.prefix}{" "}
            <span className="bg-white px-2 py-1 text-black">
              {headline.highlight}
            </span>{" "}
            {headline.suffix}
          </h1>
        </div>

        {/* <div className="flex flex-col items-end gap-1 text-white">
          <p className="hidden lg:block">{contact.label}</p>
          {contact.email && (
            <>
              <a href={`mailto:${contact.email}`} className="hidden lg:block">
                {contact.email}
              </a>
              <a
                href={`mailto:${contact.email}`}
                aria-label="Email"
                className="block md:hidden"
              >
                <Mail className="h-6 w-6" />
              </a>
            </>
          )}
          {contact.instagramUrl && (
            <a
              href={contact.instagramUrl}
              aria-label="Instagram"
              className="block md:hidden"
            >
              <img
                src="/images/instagram-white-icon.webp"
                alt="Instagram"
                className="h-6 w-6"
              />
            </a>
          )}
        </div> */}
      </div>
    </section>
  );
}