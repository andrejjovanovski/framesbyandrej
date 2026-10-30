import type {Metadata} from 'next';
import {galleryPath,homePath,type Locale} from './i18n';

export const SITE_URL='https://frames.andrejjovanovski.dev';
export const BRAND='Frames by Andrej';
export const isPreview=process.env.VERCEL_ENV==='preview';
export const absolute=(path:string)=>new URL(path,SITE_URL).href;
export function pageMetadata(locale:Locale,title:string,description:string,path:string,alternatePath:string):Metadata {
  const mk=locale==='mk'?path:alternatePath;
  const en=locale==='en'?path:alternatePath;
  return {
    title,description,metadataBase:new URL(SITE_URL),
    alternates:{canonical:path,languages:{'mk-MK':mk,'en-MK':en,'x-default':mk}},
    robots:isPreview?{index:false,follow:false}:{index:true,follow:true,googleBot:{index:true,follow:true,'max-image-preview':'large','max-snippet':-1,'max-video-preview':-1}},
    openGraph:{type:'website',siteName:BRAND,title,description,url:absolute(path),locale:locale==='mk'?'mk_MK':'en_MK',alternateLocale:locale==='mk'?['en_MK']:['mk_MK'],images:[{url:absolute('/branding/social-preview.png'),width:1200,height:630,alt:locale==='mk'?'Frames by Andrej — фотографија во Македонија':'Frames by Andrej — photography in North Macedonia'}]},
    twitter:{card:'summary_large_image',title,description,images:[absolute('/branding/social-preview.png')]},
  };
}
export const homeMetadata=(locale:Locale)=>pageMetadata(locale,
  locale==='mk'?'Фотограф Куманово и Скопје | Frames by Andrej':'Photographer in Kumanovo & Skopje | Frames by Andrej',
  locale==='mk'?'Портрети, свадби, настани и креативна фотографија со Frames by Andrej. Достапен во Куманово, Скопје, Кратово, Крива Паланка, Тетово и низ Македонија.':'Portraits, weddings, events and creative photography in Kumanovo, Skopje, Kratovo, Kriva Palanka, Tetovo and across North Macedonia. Explore Frames by Andrej.',
  homePath(locale),homePath(locale==='mk'?'en':'mk'));

export const galleryMetadata=(locale:Locale,title='',description='',category='',page=1)=>pageMetadata(locale,
  `${title||(locale==='mk'?'Галерија со фотографии':'Photography gallery')}${page>1?` — ${locale==='mk'?'страница':'page'} ${page}`:''} | ${BRAND}`,
  description||(locale==='mk'?'Разгледајте портрети, природа, див свет и други фотографии од Македонија. Галерија на Frames by Andrej.':'Explore portraits, landscapes, wildlife and photographs from North Macedonia in the Frames by Andrej gallery.'),
  galleryPath(locale,category,page),galleryPath(locale==='mk'?'en':'mk',category,page));

export const safeJson=(value:unknown)=>JSON.stringify(value).replace(/</g,'\\u003c');
