import { defineQuery } from "next-sanity";

export const galleryScrollQuery = defineQuery(`
  *[_type == "galleryScroll"][0]{
    "headingLine1": coalesce(headingLine1, "Parallax"),
    "headingLine2": coalesce(headingLine2, "Scroll"),
    "subtext": coalesce(subtext, "with gsap"),
    "layoutSeed": coalesce(layoutSeed, 1),
    "images": pieces[]->{
      "name": name,
      "slug": slug.current,
      "src": images[0].asset->url,
      "lqip": images[0].asset->metadata.lqip
    }[defined(src)]
  }
`);