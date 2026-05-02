import PortfolioHeader from '@/components/portfolio/PortfolioHeader'
import ProjectsList from '@/components/portfolio/ProjectsList'
import { TextBlockEffectDemo } from '@/components/portfolio/TextBlockEffectDemo'

export default function page() {
  return (
    <div>
           <PortfolioHeader/>
           <TextBlockEffectDemo/>
           <ProjectsList/>

    </div>
  )
}
