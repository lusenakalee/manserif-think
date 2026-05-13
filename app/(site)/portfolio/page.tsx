import { CinematicFooter } from '@/components/motion-footer'
import InstagramFeed from '@/components/portfolio/InstagramFeed'
import PortfolioHeader from '@/components/portfolio/PortfolioHeader'
import PortfolioVideos  from '@/components/portfolio/PortfolioVideos'
import ProjectsList from '@/components/portfolio/ProjectsList'
import SlidingImages from '@/components/portfolio/SlidingImages'
import { TextBlockEffectDemo } from '@/components/portfolio/TextBlockEffectDemo'

const instagramPosts = [
  "https://www.instagram.com/p/DW4Cgm8jGSR/?img_index=1",
  "https://www.instagram.com/p/DL7k3-us0ZS/?img_index=1",
  "https://www.instagram.com/p/C55cI6Si9CQ/?img_index=1",
];

export default function page() {
  return (
    <div>
           <PortfolioHeader/>
           <TextBlockEffectDemo/>
           <ProjectsList/>
           <SlidingImages/>
           <PortfolioVideos/>
                 <InstagramFeed postUrls={instagramPosts} />

           <CinematicFooter/>

    </div>
  )
}
