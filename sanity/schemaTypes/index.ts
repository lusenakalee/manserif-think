import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'

import { productType } from './productType'
import { orderType } from './orderType'
import { customerType } from './customerType'
import { projectType } from './projectType'
import { heroSectionType } from './heroSectionType'
import { exhibitType } from './exhibitType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType,  productType,  categoryType , orderType ,exhibitType, customerType , projectType , heroSectionType],
}
