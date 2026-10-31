'use client';
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {Facebook,Instagram,Music2,Menu,X} from 'lucide-react';
import {homePath,galleryPath,type Locale} from '../lib/i18n';
import {productionTranslator} from '../lib/production-i18n';
import {projectPath,contactPath} from '../lib/paths';
import type {SiteContent} from '../lib/sanity';
export default function SiteHeader({locale,alternate,overlay=false,active='',settings}:{locale:Locale;alternate:string;overlay?:boolean;active?:string;settings?:SiteContent['settings']}){
 const t=productionTranslator(locale);const [open,setOpen]=useState(false);
 const menu=useRef<HTMLElement>(null),trigger=useRef<HTMLButtonElement>(null);
 const links=[{label:'Home',href:homePath(locale)},{label:'Photography',href:galleryPath(locale)},{label:'Films',href:projectPath(locale,'films')},{label:'Commercial',href:projectPath(locale,'commercial')},{label:'About',href:`${homePath(locale)}#about`},{label:'Contact',href:contactPath(locale)}];
 useEffect(()=>{if(!open)return;const old=document.body.style.overflow;document.body.style.overflow='hidden';menu.current?.querySelector('a')?.focus();const key=(event:KeyboardEvent)=>{if(event.key==='Escape'){event.preventDefault();setOpen(false);}if(event.key==='Tab'){const links=menu.current?.querySelectorAll('a');const last=links?.[links.length-1];if(!event.shiftKey&&document.activeElement===last){event.preventDefault();trigger.current?.focus();}if(event.shiftKey&&document.activeElement===trigger.current){event.preventDefault();last?.focus();}}};window.addEventListener('keydown',key);return()=>{document.body.style.overflow=old;window.removeEventListener('keydown',key);trigger.current?.focus({preventScroll:true});};},[open]);
 return <><header className={`site-header production-header${overlay?'':' gallery-header'}`}><div className="header-inner">
  <Link className="brand" href={homePath(locale)} aria-label={t('Go to homepage')} onClick={()=>setOpen(false)}><Image src="/branding/frames-logo-trim.png" alt="Frames by Andrej" width={190} height={130} priority/></Link>
  <nav className="desktop-nav" aria-label={locale==='mk'?'Главна навигација':'Main navigation'}>{links.map(link=><Link key={link.label} href={link.href} aria-current={active===link.label?'page':undefined}>{t(link.label)}</Link>)}</nav>
  <div className="header-right"><Link className="language-switch" href={alternate} hrefLang={locale==='mk'?'en':'mk'}>{locale==='mk'?'EN':'МК'}</Link>
   {settings?.facebookUrl&&<a className="social-icon" aria-label="Facebook" href={settings.facebookUrl} target="_blank" rel="noreferrer"><Facebook size={17}/></a>}
   {settings?.instagramUrl&&<a className="social-icon" aria-label="Instagram" href={settings.instagramUrl} target="_blank" rel="noreferrer"><Instagram size={17}/></a>}
   {settings?.tiktokUrl?.trim()&&<a className="social-icon" aria-label="TikTok" href={settings.tiktokUrl.trim()} target="_blank" rel="noreferrer"><Music2 size={17}/></a>}
   <button ref={trigger} className="menu-toggle" onClick={()=>setOpen(!open)} aria-label={t(open?'Close menu':'Open menu')} aria-expanded={open} aria-controls="site-mobile-nav">{open?<X/>:<Menu/>}</button>
  </div>
 </div></header>
 {open&&<nav ref={menu} id="site-mobile-nav" className="mobile-menu production-menu" aria-label={locale==='mk'?'Мобилна навигација':'Mobile navigation'}>{links.map(link=><Link key={link.label} href={link.href} onClick={()=>setOpen(false)}>{t(link.label)}</Link>)}</nav>}</>;
}
