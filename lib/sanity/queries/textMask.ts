import { defineQuery } from "next-sanity";

export const textMaskQuery = defineQuery(`
  *[_type == "textMask"][0]{
    "videoUrl": coalesce(video.asset->url, "")
  }
`);