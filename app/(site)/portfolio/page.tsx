import type { Metadata } from "next";
import { CinematicFooter } from "@/components/motion-footer";
import AboutMeSec from "@/components/portfolio/AboutMeSec";
import InstagramFeed from "@/components/portfolio/InstagramFeed";
import PinSection from "@/components/portfolio/PinSection";
import PortfolioHeader from "@/components/portfolio/PortfolioHeader";
import PortfolioVideos from "@/components/portfolio/PortfolioVideos";
import SlidingImages from "@/components/portfolio/SlidingImages";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client"; // adjust to your client path
import { portfolioQuery } from "@/lib/sanity/queries/portfolio";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Browse the portfolio of Kenyan artist Warren Kamau — conceptual paintings, collage, sculpture and large-scale art installations from the Manserif.Think studio. Explore original artwork, behind-the-scenes process videos and recent creative projects.",
};

const instagramPosts = [
  "https://www.instagram.com/p/DW4Cgm8jGSR/?img_index=1",
  "https://www.instagram.com/p/DL7k3-us0ZS/?img_index=1",
  "https://www.instagram.com/p/C55cI6Si9CQ/?img_index=1",
];
export default async function page() {
  const data = await client.fetch(
    portfolioQuery,
    {},
    { next: { revalidate: 60 } },
  );
  if (!data) notFound();
  return (
    <div>
      <PortfolioHeader {...data.header} />
   <AboutMeSec {...data.about} />
      {/* <div className="relative mt-20">
                   <PinSection />
                   </div> */}
      {/* <ProjectsList/> */}
      <SlidingImages />
      <PortfolioVideos />
      <InstagramFeed postUrls={instagramPosts} />
      <CinematicFooter />
    </div>
  );
}
