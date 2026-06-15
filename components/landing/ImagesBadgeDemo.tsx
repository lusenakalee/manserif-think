"use client";
import { ImagesBadge } from "@/components/ui/images-badge";

export function ImagesBadgeDemo() {
  return (
    <div className="flex h-[10rem] w-full items-center justify-center">
      <ImagesBadge
        text="View All Projects"
        images={[
          "/images/charcoal1.webp",
          "/images/charcoal2.webp",
          "/images/charcoal3.webp",
        ]}
      />
    </div>
  );
}
