'use client';

import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import {ArrowUpRight, ChevronLeft, ChevronRight, X} from 'lucide-react';
import {categoryKey, categoryOptions, type CategoryOption} from '../lib/categories';
import type {SiteContent} from '../lib/sanity';

type Props = {photos:SiteContent['gallery']; categories:CategoryOption[]; preview?:boolean; initialCategory?:string};

export default function PhotoGallery({photos,categories,preview=false,initialCategory=''}:Props) {
  const router=useRouter();
  const [limit,setLimit]=useState(24);
  const [lightbox,setLightbox]=useState<number|null>(null);
  const dialog=useRef<HTMLDivElement>(null);
  const close=useRef<HTMLButtonElement>(null);
  const options=categoryOptions(categories,photos.map(photo=>photo.type));
  const filter=categoryKey(initialCategory);
  const visible=preview?photos.filter(photo=>photo.featured!==false)
    :photos.filter(photo=>!filter||categoryKey(photo.type)===filter);
  const displayed=preview?visible:visible.slice(0,limit);
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
    {!preview&&<div className="filter-row" aria-label="Filter photographs">
      {[{key:'',title:'All'},...options].map(category=><button key={category.key}
        className={filter===category.key?'active':''} aria-pressed={filter===category.key}
        onClick={()=>router.push(category.key?`/gallery?category=${encodeURIComponent(category.key)}`:'/gallery',{scroll:false})}>{category.title}</button>)}
    </div>}
    <div className="portfolio-grid">
      {visible.length===0&&<p className="portfolio-empty" role="status">{filter?'No photographs in this category yet.':preview?'Featured photographs coming soon.':'New photographs coming soon.'}</p>}
      {displayed.map((photo,index)=><button className="portfolio-photo" key={photo.id||`${photo.src}-${index}`}
        onClick={()=>setLightbox(index)} aria-label={`Open photo: ${photo.title}`}>
        <img className="portfolio-image" src={photo.src} alt={photo.alt||photo.title} width={photo.width} height={photo.height} loading="lazy" decoding="async"/>
        <div className="portfolio-overlay"><span>{categoryLabel(photo.type).toUpperCase()}</span>
          <div><h3>{photo.title}</h3><ArrowUpRight size={20}/></div>
        </div>
      </button>)}
    </div>
    {!preview&&<div className="gallery-results"><p role="status">Showing {displayed.length} of {visible.length} photographs</p>
      {displayed.length<visible.length&&<button className="outline-button" onClick={()=>setLimit(limit+24)}>LOAD MORE PHOTOGRAPHS <ArrowUpRight size={16}/></button>}
    </div>}
    {current&&lightbox!==null&&<div ref={dialog} className="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={()=>setLightbox(null)}>
      <button ref={close} className="lightbox-close" onClick={()=>setLightbox(null)} aria-label="Close photo"><X/></button>
      <button className="lightbox-prev" onClick={event=>{event.stopPropagation();setLightbox((lightbox-1+visible.length)%visible.length);}} aria-label="Previous photo"><ChevronLeft/></button>
      <div className="lightbox-content" onClick={event=>event.stopPropagation()}>
        <img src={current.src} alt={current.alt||current.title}/>
        <div className="lightbox-caption" aria-live="polite"><span>{current.title}</span><span>{lightbox+1} / {visible.length}</span></div>
      </div>
      <button className="lightbox-next" onClick={event=>{event.stopPropagation();setLightbox((lightbox+1)%visible.length);}} aria-label="Next photo"><ChevronRight/></button>
    </div>}
  </>;
}
