import {cache} from 'react';
import Link from 'next/link';

import {notFound} from 'next/navigation';
import {ArrowLeft} from 'lucide-react';
import PhotoGallery from './PhotoGallery';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import {getSiteContent} from '../lib/sanity';
import {categoryKey,categoryOptions} from '../lib/categories';
import {translator,homePath,galleryPath,type Locale} from '../lib/i18n';
import {absolute,galleryMetadata,safeJson} from '../lib/seo';

export const galleryData=cache(async(locale:Locale,category:string,page:number)=>{
  const content=await getSiteContent({allPhotos:true,locale});
  const t=translator(locale);
  const categories=categoryOptions(content?.categories??[],[...(content?.collections.map(c=>c.category)??[]),...(content?.gallery.map(p=>p.type)??[])]).map(c=>({...c,title:t(c.title)}));
  const selected=categories.find(c=>c.key===category);
  if(content&&category&&!selected)notFound();
  const photos=content?.gallery??[];
  const visible=category?photos.filter(photo=>categoryKey(photo.type)===category):photos;
  const pages=Math.max(1,Math.ceil(visible.length/24));
  if(content&&page>pages)notFound();
  return {content,categories,selected,photos,visible,pages};
});
export const pageNumber=(value:string|string[]|undefined)=>typeof value==='string'&&/^[1-9]\d*$/.test(value)?Math.min(Number(value),100000):1;

export async function gallerySEO(locale:Locale,category='',page=1){
  const data=await galleryData(locale,category,page);
  const title=data.selected?`${data.selected.title} — ${locale==='mk'?'галерија':'gallery'}`:'';
  const description=data.selected?.description||(data.selected?(locale==='mk'?`Разгледајте ја колекцијата ${data.selected.title} на Frames by Andrej, фотограф достапен во Куманово, Скопје и низ Северна Македонија.`:`Explore ${data.selected.title} photographs by Frames by Andrej, a photographer serving North Macedonia.`):'');
  const metadata=galleryMetadata(locale,title,description,category,page);
  if(!data.content)metadata.robots={index:false,follow:true};
  return metadata;
}

export default async function GalleryPage({locale,category='',page=1}:{locale:Locale;category?:string;page?:number}){
  const {content,categories,selected,photos,visible}=await galleryData(locale,category,page);
  const t=translator(locale),path=galleryPath(locale,category,page);
  const introduction=selected?.description||(selected?(locale==='mk'?`Разгледајте ја колекцијата ${selected.title} на Frames by Andrej. За фотосесија во Куманово, Скопје или друго место во Северна Македонија, контактирајте ме со вашата идеја.`:`Explore the ${selected.title} collection by Frames by Andrej. Get in touch about a photography session in Kumanovo, Skopje or elsewhere in North Macedonia.`):t('A closer look at the moments worth remembering. Explore the full collection, one frame at a time.'));
  const breadcrumbs=[{name:t('Home'),url:homePath(locale)},{name:t('Gallery'),url:galleryPath(locale)},...(selected?[{name:selected.title,url:path}]:[])];
  const schema={'@context':'https://schema.org','@graph':[
    {'@type':'BreadcrumbList',itemListElement:breadcrumbs.map((crumb,index)=>({'@type':'ListItem',position:index+1,name:crumb.name,item:absolute(crumb.url)}))},
    {'@type':'ImageGallery',url:absolute(path),name:selected?.title||t('Gallery'),inLanguage:locale==='mk'?'mk-MK':'en',
      hasPart:visible.slice((page-1)*24,page*24).map(photo=>({'@type':'ImageObject',contentUrl:photo.src,name:photo.title,description:photo.alt||photo.title,creator:{'@type':'Organization',name:'Frames by Andrej'}}))},
  ]};
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:safeJson(schema)}}/>
    <SiteHeader locale={locale} alternate={galleryPath(locale==='mk'?'en':'mk',category,page)} active="Photography" settings={content?.settings}/>
    <main className="gallery-page container">
      <Link className="gallery-back" href={homePath(locale)}><ArrowLeft size={15}/>{t('BACK TO HOME')}</Link>
      <div className="gallery-intro"><p className="eyebrow"><span className="tiny-line"/>{t('PLACES, PEOPLE & STORIES')}</p>
        <h1>{selected?.title||t('The gallery.')}</h1><p>{introduction}</p>
      </div>
      {!content&&<p className="gallery-notice" role="status">{t('The gallery is temporarily unavailable. Please refresh in a moment.')}</p>}
      <PhotoGallery key={`${category}-${page}`} photos={photos} categories={categories} initialCategory={category} initialPage={page} locale={locale}/>
    </main>
    <SiteFooter locale={locale}/>
  </>;
}
