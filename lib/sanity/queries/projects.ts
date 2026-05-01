export const PROJECTS_QUERY = `*[_type == "project"] | order(order asc){
  _id,
  title,
  subtitle,
  "slug": slug.current,
  heroImage{
    asset,
    alt
  }
}`;