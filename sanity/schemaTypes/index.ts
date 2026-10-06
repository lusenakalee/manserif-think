import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import { heroSectionType } from './heroSectionType'
import { exhibitType } from './exhibitType'
import { portfolioType } from './portfolioType'
import { landingHeroType } from './landingHeroType'
import { textMaskType } from './textMaskType'
import { artType } from './artType'
import { galleryType } from './gallerytype'


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, galleryType, artType, categoryType, exhibitType, heroSectionType, portfolioType, landingHeroType, textMaskType],
}
