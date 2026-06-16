"use client";
import { ImagesBadge } from "@/components/ui/images-badge";
import Link from "next/link";

export function ImagesBadgeDemo() {
  return (
    <Link href="/projects" className="flex h-[10rem] w-full items-center justify-center">
      <ImagesBadge
        text="Explore More"
        images={[
          "/images/charcoal1.webp",
          "/images/charcoal2.webp",
          "/images/charcoal3.webp",
        ]}
      />
    </Link>
  );
}
