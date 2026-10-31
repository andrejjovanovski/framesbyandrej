import {cache} from 'react';
import type {Locale} from './i18n';
import {client,sanityImage,type SiteContent} from './sanity';
export type ProjectKind='films'|'commercial';
export {projectPath,contactPath} from './paths';
export type Project={id:string;slug:string;title:string;description:string;category:string;categoryId:string;cover:string;coverAlt:string;featured:boolean;date?:string;updatedAt?:string;year?:number;runtime?:string;creator?:string;videoUrl?:string;client?:string;projectType?:string;synopsis?:string;objective?:string;approach?:string;production?:string;technical?:string;notes?:string;services:string[];deliverables:string[];credits:{role:string;name:string}[];images:SiteContent['gallery'];behindScenes:SiteContent['gallery'];seoTitle?:string;seoDescription?:string};
export const getProjects=cache(async(kind:ProjectKind,locale:Locale):Promise<Project[]|null>=>{
  if(!client)return null;
  try{
    const data=await client.fetch<any[]>(`*[_type==$type && defined(slug.current)]|order(featured desc,order asc,publicationDate desc,_createdAt desc){
      _id,_updatedAt,slug,title,titleMk,description,descriptionMk,cover,coverAlt,coverAltMk,featured,publicationDate,year,runtime,creator,videoUrl,"hostedVideo":videoFile.asset->url,client,projectType,
      synopsis,synopsisMk,objective,objectiveMk,approach,approachMk,production,productionMk,technical,technicalMk,notes,notesMk,services,servicesMk,deliverables,deliverablesMk,credits,
      seoTitle,seoTitleMk,seoDescription,seoDescriptionMk,"category":category->{title,titleMk,"key":slug.current},
      images[]{_key,image,alt,altMk,caption,captionMk,"dimensions":image.asset->metadata.dimensions},
      behindScenes[]{_key,image,alt,altMk,caption,captionMk,"dimensions":image.asset->metadata.dimensions}
    }`,{type:kind==='films'?'film':'commercialProject'},{cache:'no-store'});
    const text=(row:any,key:string)=>locale==='mk'?(row[`${key}Mk`]||row[key]||''):(row[key]||'');
    const images=(rows:any[]|undefined)=> (rows||[]).map(row=>({id:row._key,src:sanityImage(row.image?.asset,1800),title:text(row,'caption')||text(row,'alt'),alt:text(row,'alt'),type:'',width:row.dimensions?.width,height:row.dimensions?.height})).filter(row=>row.src);
    return data.map(row=>({id:row._id,slug:row.slug.current,title:text(row,'title'),description:text(row,'description'),category:row.category?text(row.category,'title'):'',categoryId:row.category?.key||'',cover:sanityImage(row.cover,2200),coverAlt:text(row,'coverAlt')||text(row,'title'),featured:row.featured===true,date:row.publicationDate,updatedAt:row._updatedAt,year:row.year,runtime:row.runtime,creator:row.creator,videoUrl:row.videoUrl||row.hostedVideo,client:row.client,projectType:row.projectType,
      synopsis:text(row,'synopsis'),objective:text(row,'objective'),approach:text(row,'approach'),production:text(row,'production'),technical:text(row,'technical'),notes:text(row,'notes'),services:(locale==='mk'?row.servicesMk:undefined)||row.services||[],deliverables:(locale==='mk'?row.deliverablesMk:undefined)||row.deliverables||[],credits:(row.credits||[]).map((credit:any)=>({role:text(credit,'role'),name:credit.name})),images:images(row.images),behindScenes:images(row.behindScenes),seoTitle:text(row,'seoTitle'),seoDescription:text(row,'seoDescription')}));
  }catch(error){console.error('Portfolio content unavailable',error);return null;}
});
