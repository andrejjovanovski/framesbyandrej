import {type SchemaTypeDefinition} from 'sanity';
import {photoType} from './photo';
import {collectionType} from './collection';
import {heroSlideType} from './heroSlide';
import {siteSettingsType} from './siteSettings';
import {categoryType} from './category';
export const schemaTypes: SchemaTypeDefinition[] = [siteSettingsType, categoryType, heroSlideType, collectionType, photoType];
