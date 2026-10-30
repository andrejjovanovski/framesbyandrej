'use client';

import {useEffect, useRef, useState} from 'react';
import Link from 'next/link';
import {translator,galleryPath,type Locale} from '../lib/i18n';
import {responsiveSources} from '../lib/images';
import {ArrowUpRight, ChevronLeft, ChevronRight, X} from 'lucide-react';
import {categoryKey, categoryOptions, type CategoryOption} from '../lib/categories';
import type {SiteContent} from '../lib/sanity';

type Props = {photos:SiteContent['gallery']; categories:CategoryOption[]; preview?:boolean; initialCategory?:string;initialPage?:number;locale?:Locale};

export default function PhotoGallery({photos,categories,preview=false,initialCategory='',initialPage=1,locale='mk'}:Props) {
  const t=translator(locale);
  const [limit,setLimit]=useState(initialPage*24);
  const [lightbox,setLightbox]=useState<number|null>(null);
  const dialog=useRef<HTMLDivElement>(null);
  const close=useRef<HTMLButtonElement>(null);
  const options=categoryOptions(categories,photos.map(photo=>photo.type)).map(c=>({...c,title:t(c.title)}));
  const filter=categoryKey(initialCategory);
  const visible=preview?photos.filter(photo=>photo.featured!==false)
    :photos.filter(photo=>!filter||categoryKey(photo.type)===filter);
  const offset=preview?0:(initialPage-1)*24;
  const displayed=preview?visible:visible.slice(offset,limit);
  const current=lightbox===null?null:visible[lightbox];
  const opened=lightbox!==null;
  const categoryLabel=(value:string)=>options.find(category=>category.key===categoryKey(value))?.title||value;

  useEffect(()=>{
    if(!opened)return;
    const previous=document.activeElement instanceof HTMLElement?document.activeElement:null;
    const overflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    close.current?.focus();
    return()=>{document.body.style.overflow=overflow;previous?.focus({preventScroll:true});};
  },[opened]);

  useEffect(()=>{
    if(!opened)return;
    const onKey=(event:KeyboardEvent)=>{
      if(event.key==='Escape'){event.preventDefault();setLightbox(null);}
      if(event.key==='ArrowRight'){event.preventDefault();setLightbox(index=>index===null?null:(index+1)%visible.length);}
      if(event.key==='ArrowLeft'){event.preventDefault();setLightbox(index=>index===null?null:(index-1+visible.length)%visible.length);}
      if(event.key==='Tab'){
        const buttons=dialog.current?.querySelectorAll<HTMLButtonElement>('button');
        const first=buttons?.[0],last=buttons?.[buttons.length-1];
        if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
        if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
      }
    };
    window.addEventListener('keydown',onKey);
    return()=>window.removeEventListener('keydown',onKey);
  },[opened,visible.length]);

  return <>
    {!preview&&<nav className="filter-row" aria-label={t('Filter photographs')}>
      {[{key:'',title:t('All')},...options].map(category=><Link key={category.key}
        className={filter===category.key?'active':''} aria-current={filter===category.key?'page':undefined}
        href={galleryPath(locale,category.key)} scroll={false}>{category.title}</Link>)}
    </nav>}
    <div className="portfolio-grid">
      {visible.length===0&&<p className="portfolio-empty" role="status">{t(filter?'No photographs in this category yet.':preview?'Featured photographs coming soon.':'New photographs coming soon.')}</p>}
      {displayed.map((photo,index)=><button className="portfolio-photo" key={photo.id||`${photo.src}-${index}`}
        onClick={()=>setLightbox(index+offset)} aria-label={`${locale==='mk'?'Отвори фотографија':'Open photo'}: ${photo.title}`}>
        <img className="portfolio-image" src={photo.src} srcSet={responsiveSources(photo.src)} sizes="(max-width:520px) 88vw, (max-width:900px) 44vw, 410px" alt={photo.alt||photo.title} width={photo.width} height={photo.height} loading="lazy" decoding="async"/>
        <div className="portfolio-overlay"><span>{categoryLabel(photo.type).toUpperCase()}</span>
          <div><h3>{photo.title}</h3><ArrowUpRight size={20}/></div>
        </div>
      </button>)}
    </div>
    {!preview&&<div className="gallery-results"><p role="status">{locale==='mk'?`Прикажани ${displayed.length} од ${visible.length} фотографии`:`Showing ${displayed.length} of ${visible.length} photographs`}</p>
      {offset+displayed.length<visible.length&&<button className="outline-button" onClick={()=>setLimit(limit+24)}>{t('LOAD MORE PHOTOGRAPHS')} <ArrowUpRight size={16}/></button>}
      {visible.length>24&&<nav className="gallery-pagination" aria-label={locale==='mk'?'Страници во галеријата':'Gallery pages'}>
        {initialPage>1&&<Link href={galleryPath(locale,filter,initialPage-1)} rel="prev">← {t('Previous page')}</Link>}
        <span>{initialPage} / {Math.ceil(visible.length/24)}</span>
        {initialPage<Math.ceil(visible.length/24)&&<Link href={galleryPath(locale,filter,initialPage+1)} rel="next">{t('Next page')} →</Link>}
      </nav>}
    </div>}
    {current&&lightbox!==null&&<div ref={dialog} className="lightbox" role="dialog" aria-modal="true" aria-label={t('Photo viewer')} onClick={()=>setLightbox(null)}>
      <button ref={close} className="lightbox-close" onClick={()=>setLightbox(null)} aria-label={t('Close photo')}><X/></button>
      <button className="lightbox-prev" onClick={event=>{event.stopPropagation();setLightbox((lightbox-1+visible.length)%visible.length);}} aria-label={t('Previous photo')}><ChevronLeft/></button>
      <div className="lightbox-content" onClick={event=>event.stopPropagation()}>
        <img src={current.src} alt={current.alt||current.title}/>
        <div className="lightbox-caption" aria-live="polite"><span>{current.title}</span><span>{lightbox+1} / {visible.length}</span></div>
      </div>
      <button className="lightbox-next" onClick={event=>{event.stopPropagation();setLightbox((lightbox+1)%visible.length);}} aria-label={t('Next photo')}><ChevronRight/></button>
    </div>}
  </>;
}
