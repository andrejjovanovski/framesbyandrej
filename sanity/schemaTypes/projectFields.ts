import {defineField} from 'sanity';
import {videoSource} from '../../lib/video';
import {categoryKey} from '../../lib/categories';
export const localized=(name:string,title:string,long=false)=>[
  defineField({name,title:`${title} (English)`,type:long?'text':'string'}),
  defineField({name:`${name}Mk`,title:`${title} (Macedonian)`,type:long?'text':'string'}),
];
export const projectImage=defineField({name:'projectImage',title:'Project photograph',type:'object',fields:[
  defineField({name:'image',type:'image',options:{hotspot:true},validation:r=>r.required()}),
  defineField({name:'alt',title:'Image description (English)',type:'string',validation:r=>r.required()}),
  defineField({name:'altMk',title:'Image description (Macedonian)',type:'string'}),...localized('caption','Caption'),
],preview:{select:{title:'caption',subtitle:'alt',media:'image'}}});
export const commonProjectFields=(kind:'films'|'commercial')=>[
  defineField({name:'title',title:'Title (English)',type:'string',validation:r=>r.required()}),
  defineField({name:'titleMk',title:'Title (Macedonian)',type:'string'}),
  defineField({name:'slug',title:'URL ID',type:'slug',options:{source:'title',slugify:categoryKey},validation:r=>r.required().custom(value=>!value?.current||/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current)?true:'Use lowercase letters, numbers and single hyphens, or click Generate.')}),
  defineField({name:'category',type:'reference',to:[{type:'category'}],options:{filter:'portfolioType==$kind',filterParams:{kind}},validation:r=>r.required(),description:`Create a Category with Portfolio section set to ${kind} first.`}),
  defineField({name:'cover',title:kind==='films'?'Film poster':'Project cover',type:'image',options:{hotspot:true},validation:r=>r.required()}),
  ...localized('coverAlt','Cover image description'),...localized('description','Short description',true),
  defineField({name:'videoUrl',title:'YouTube, Vimeo or HTTPS video URL',type:'url',description:'Supports YouTube, Vimeo (including unlisted links), and direct .mp4 / .webm links. Nothing loads until the visitor chooses to watch.',validation:r=>r.custom((value,context)=>{
    if(!value&&kind==='films'&&!(context.document?.videoFile as {asset?:{_ref?:string}}|undefined)?.asset?._ref)return 'Add a video URL or upload a video file before publishing a film.';
    return !value||videoSource(value)?true:'Use an HTTPS YouTube, Vimeo, MP4 or WebM video URL.';
  })}),
  defineField({name:'videoFile',title:'Optional hosted video',type:'file',options:{accept:'video/mp4,video/webm'},description:'YouTube or Vimeo is preferred for long films. This file is played with native controls only after a click.'}),
  defineField({name:'images',title:kind==='films'?'Film stills':'Final photography',type:'array',of:[{type:'projectImage'}]}),
  defineField({name:'behindScenes',title:'Behind the scenes / production images',type:'array',of:[{type:'projectImage'}]}),
  ...localized('notes','Behind-the-scenes notes',true),
  defineField({name:'publicationDate',type:'datetime'}),
  defineField({name:'featured',type:'boolean',initialValue:false}),
  defineField({name:'order',type:'number',description:'Lower numbers appear first within featured and other projects.'}),
  ...localized('seoTitle','SEO title'),...localized('seoDescription','SEO description',true),
];
