import type {CategoryOption} from './categories';
import {createClient} from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
const projectId=process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset=process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion=process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-19';
export const client=projectId?createClient({projectId,dataset,apiVersion,useCdn:false,perspective:'published'}):null;
const builder=client?imageUrlBuilder(client):null;
export function sanityImage(source:unknown,width=1600){return source&&builder?builder.image(source).width(width).auto('format').quality(85).url():'';}
export type SiteContent={categories:CategoryOption[];slides:{image:string;eyebrow:string;heading:string;highlight:string;sub:string}[];collections:{title:string;subtitle:string;image:string;category:string}[];gallery:{src:string;title:string;type:string}[];settings:{aboutImage?:string;aboutLead?:string;aboutParagraphs?:string[];contactEmail?:string;instagramUrl?:string;facebookUrl?:string}|null};
export async function getSiteContent():Promise<SiteContent|null>{
 if(!client)return null;
 try{
 const result=await client.fetch<{categories:CategoryOption[];slides:any[];collections:any[];gallery:any[];settings:any}>(`{
 "categories":*[_type=="category" && defined(slug.current)]|order(order asc,title asc){title,"key":slug.current},
 "slides":*[_type=="heroSlide"]|order(order asc,_createdAt asc){eyebrow,heading,highlight,sub,image},
 "collections":*[_type=="collection"]|order(order asc,_createdAt asc){title,subtitle,category,image},
 "gallery":*[_type=="photo" && featured!=false]|order(order asc,_createdAt asc){title,category,image},
 "settings":*[_type=="siteSettings"][0]{aboutImage,aboutLead,aboutParagraphs,contactEmail,instagramUrl,facebookUrl}
 }`,{}, {cache:'no-store'});
 return {categories:result.categories,slides:result.slides.map(s=>({...s,image:sanityImage(s.image,2200)})).filter(s=>s.image),collections:result.collections.map(c=>({...c,image:sanityImage(c.image,1200)})).filter(c=>c.image),gallery:result.gallery.map(g=>({src:sanityImage(g.image,1800),title:g.title,type:g.category})).filter(g=>g.src),settings:result.settings?{...result.settings,aboutImage:sanityImage(result.settings.aboutImage,1300)}:null};
 }catch(e){console.error('Sanity content unavailable; displaying sample content',e);return null;}
}
