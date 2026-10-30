import type {MetadataRoute} from 'next';
import {getSiteContent} from '../lib/sanity';
import {categoryOptions,categoryKey} from '../lib/categories';
import {homePath,galleryPath,type Locale} from '../lib/i18n';
import {absolute} from '../lib/seo';
export const dynamic='force-dynamic';
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
  const content=await getSiteContent({allPhotos:true,locale:'mk'});
  const photos=content?.gallery??[];
  const categories=categoryOptions(content?.categories??[],photos.map(p=>p.type));
  const entries:MetadataRoute.Sitemap=[];
  for(const locale of ['mk','en'] as Locale[]){
    entries.push({url:absolute(homePath(locale)),lastModified:content?.lastUpdated,alternates:{languages:{'mk-MK':absolute(homePath('mk')),'en-MK':absolute(homePath('en'))}}});
    for(const category of ['',...categories.filter(c=>photos.some(p=>categoryKey(p.type)===c.key)).map(c=>c.key)]){
      const selected=category?photos.filter(p=>categoryKey(p.type)===category):photos;
      for(let page=1;page<=Math.max(1,Math.ceil(selected.length/24));page++){
        entries.push({url:absolute(galleryPath(locale,category,page)),lastModified:content?.lastUpdated,images:selected.slice((page-1)*24,page*24).map(p=>p.src),alternates:{languages:{'mk-MK':absolute(galleryPath('mk',category,page)),'en-MK':absolute(galleryPath('en',category,page))}}});
      }
    }
  }
  return entries;
}
