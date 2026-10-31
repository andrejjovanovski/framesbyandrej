import {cache} from 'react';
import type {CategoryOption} from './categories';
import {translator,type Locale} from './i18n';
import {createClient} from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
const projectId=process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset=process.env.NEXT_PUBLIC_SANITY_DATASET||'production';
const apiVersion=process.env.NEXT_PUBLIC_SANITY_API_VERSION||'2025-02-19';
export const client=projectId?createClient({projectId,dataset,apiVersion,useCdn:false,perspective:'published'}):null;
const builder=client?imageUrlBuilder(client):null;
export function sanityImage(source:unknown,width=1600){return source&&builder?builder.image(source).width(width).auto('format').quality(85).url():'';}
export type SiteContent={
 categories:CategoryOption[];lastUpdated?:string;
 slides:{image:string;alt?:string;eyebrow:string;heading:string;highlight:string;sub:string}[];
 collections:{title:string;subtitle:string;image:string;category:string;alt?:string}[];
 gallery:{id?:string;featured?:boolean;src:string;title:string;type:string;alt?:string;width?:number;height?:number}[];
 settings:{aboutImage?:string;aboutLead?:string;aboutParagraphs?:string[];contactEmail?:string;instagramUrl?:string;facebookUrl?:string;tiktokUrl?:string;seoTitle?:string;seoDescription?:string;phone?:string}|null;
};
const loadSiteContent=cache(async(allPhotos:boolean,locale:Locale):Promise<SiteContent|null>=>{
 if(!client)return null;
 try{
  const result=await client.fetch<{categories:any[];slides:any[];collections:any[];gallery:any[];settings:any;lastUpdated?:string}>(`{
   "lastUpdated":*[_type in ["category","photo","collection","heroSlide","siteSettings"]]|order(_updatedAt desc)[0]._updatedAt,
   "categories":*[_type=="category" && coalesce(portfolioType,"photography")=="photography" && defined(slug.current)]|order(order asc,title asc){title,titleMk,description,descriptionMk,"key":slug.current},
   "slides":*[_type=="heroSlide"]|order(order asc,_createdAt asc){eyebrow,eyebrowMk,heading,headingMk,highlight,highlightMk,sub,subMk,image,alt,altMk},
   "collections":*[_type=="collection"]|order(order asc,_createdAt asc){title,titleMk,subtitle,subtitleMk,alt,altMk,category,image},
   "gallery":*[_type=="photo" && defined(image.asset)${allPhotos?'':' && featured!=false'}]|order(order asc,_createdAt asc){_id,featured,title,titleMk,alt,altMk,category,image,"dimensions":image.asset->metadata.dimensions},
   "settings":*[_type=="siteSettings"][0]{aboutImage,aboutLead,aboutLeadMk,aboutParagraphs,aboutParagraphsMk,contactEmail,instagramUrl,facebookUrl,tiktokUrl,seoTitle,seoTitleMk,seoDescription,seoDescriptionMk,phone}
  }`,{}, {cache:'no-store'});
  const t=translator(locale);
  const text=(doc:any,field:string)=>locale==='mk'?(doc[`${field}Mk`]||t(doc[field]||'')):(doc[field]||'');
  return {
   lastUpdated:result.lastUpdated,
   categories:result.categories.map(c=>({key:c.key,title:text(c,'title'),description:locale==='mk'?(c.descriptionMk||''):(c.description||'')})),
   slides:result.slides.map(s=>({...s,image:sanityImage(s.image,2200),heading:text(s,'heading'),highlight:text(s,'highlight'),eyebrow:text(s,'eyebrow'),sub:text(s,'sub'),alt:text(s,'alt')})).filter(s=>s.image),
   collections:result.collections.map(c=>({...c,image:sanityImage(c.image,1200),title:text(c,'title'),subtitle:text(c,'subtitle'),alt:text(c,'alt')})).filter(c=>c.image),
   gallery:result.gallery.map(g=>({id:g._id,featured:g.featured,src:sanityImage(g.image?.asset,1800),title:text(g,'title'),type:g.category,alt:text(g,'alt'),width:g.dimensions?.width,height:g.dimensions?.height})).filter(g=>g.src),
   settings:result.settings?{...result.settings,aboutImage:sanityImage(result.settings.aboutImage,1300),aboutLead:text(result.settings,'aboutLead'),aboutParagraphs:(locale==='mk'?result.settings.aboutParagraphsMk:undefined)||result.settings.aboutParagraphs?.map(t),seoTitle:locale==='mk'?(result.settings.seoTitleMk||''):(result.settings.seoTitle||''),seoDescription:locale==='mk'?(result.settings.seoDescriptionMk||''):(result.settings.seoDescription||'')}:null,
  };
 }catch(error){console.error('Sanity content unavailable',error);return null;}
});
export function getSiteContent({allPhotos=false,locale='mk'}:{allPhotos?:boolean;locale?:Locale}={}){return loadSiteContent(allPhotos,locale);}
