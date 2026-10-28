import {type SchemaTypeDefinition} from 'sanity';
import {photoType} from './photo';
import {collectionType} from './collection';
import {heroSlideType} from './heroSlide';
import {siteSettingsType} from './siteSettings';
export const schemaTypes: SchemaTypeDefinition[] = [siteSettingsType, heroSlideType, collectionType, photoType];
