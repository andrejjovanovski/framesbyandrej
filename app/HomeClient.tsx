'use client';
import {translator,homePath,galleryPath,localIntro,type Locale} from '../lib/i18n';
import {responsiveSources} from '../lib/images';
import type {SiteContent} from '../lib/sanity';
import {categoryKey,categoryOptions} from '../lib/categories';
import {useEffect,useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PhotoGallery from '../components/PhotoGallery';
import {ArrowDown,ArrowLeft,ArrowRight,ArrowUpRight,Facebook,Instagram,Music2,Menu,Play,X} from 'lucide-react';

// Replace these sample Unsplash photographs with your own image paths, e.g. /photos/hero.jpg.
const photos = {
  hero:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2200&q=85',
  hero2:'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2200&q=85',
  hero3:'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=2200&q=85',
  landscape:'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1100&q=85',
  urban:'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1100&q=85',
  portrait:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1100&q=85',
  wedding:'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1100&q=85',
  lake:'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1100&q=85',
  mountains:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1100&q=85',
  architecture:'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1100&q=85',
  forest:'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1100&q=85',
  about:'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1300&q=85',
};
const sampleSlides:SiteContent['slides']=[
  {image:photos.hero,eyebrow:'PHOTOGRAPHY & FILM · NORTH MACEDONIA',heading:"Moments worth",highlight:"remembering.",sub:'A collection of places, people, and stories — seen through my lens.'},
  {image:photos.hero2,eyebrow:'THE ART OF SEEING',heading:"Chasing light.",highlight:"Finding stories.",sub:'A little wonder in every frame.'},
  {image:photos.hero3,eyebrow:'FRAMES BY ANDREJ',heading:"Every place",highlight:"has a story.",sub:'From quiet landscapes to unforgettable celebrations.'},
];
const sampleCollections=[
  {title:'Nature & landscapes',subtitle:'WILD & WONDERFUL',image:photos.landscape,category:'Nature'},
  {title:'Urban & street',subtitle:'THE EVERYDAY',image:photos.urban,category:'Urban'},
  {title:'Portraits',subtitle:'THE HUMAN SIDE',image:photos.portrait,category:'Portraits'},
  {title:'Events & weddings',subtitle:'MOMENTS THAT MATTER',image:photos.wedding,category:'Events'},
];
const sampleGallery:SiteContent['gallery']=[
  {src:photos.mountains,title:'Where the world feels still',type:'Nature'},
  {src:photos.urban,title:'After dark',type:'Urban'},
  {src:photos.wedding,title:'A day to remember',type:'Events'},
  {src:photos.lake,title:'Reflections',type:'Nature'},
  {src:photos.portrait,title:'In her element',type:'Portraits'},
  {src:photos.architecture,title:'Lines and light',type:'Urban'},
  {src:photos.forest,title:'Into the green',type:'Nature'},
];

export default function HomeClient({content,locale="mk"}:{content:SiteContent|null;locale?:Locale}){
  const t=translator(locale);
  const intro=localIntro[locale];
  const baseSlides=content?.slides.length?content.slides:sampleSlides;
  const slides=baseSlides.map(s=>({...s,alt:s.alt,eyebrow:t(s.eyebrow),sub:t(s.sub),heading:<>{t(s.heading)}<br/><em>{t(s.highlight)}</em></>}));
  const collections=(content?.collections.length?content.collections:sampleCollections).map(c=>({...c,title:t(c.title),subtitle:t(c.subtitle)}));
  const gallery=content?.gallery??sampleGallery;
  const categories=categoryOptions(content?.categories??[],[...collections.map(c=>c.category),...gallery.map(p=>p.type)]);
  const aboutImage=content?.settings?.aboutImage||photos.about;
  const aboutLead=content?.settings?.aboutLead||"A photographer drawn to light, landscapes, and honest moments.";
  const aboutParagraphs=content?.settings?.aboutParagraphs?.length?content.settings.aboutParagraphs:["Based in North Macedonia, I see photography as more than capturing an image. It is a way to preserve a feeling, a place, or a moment that deserves to last.","Whether I’m exploring a new landscape or documenting someone’s special day, I look for the little details that make each story unique."];
  const instagram=content?.settings?.instagramUrl||"https://instagram.com/";
  const facebook=content?.settings?.facebookUrl||"https://www.facebook.com/profile.php?id=61595732512781";
  const tiktok=content?.settings?.tiktokUrl?.trim()||"";
  const [activeSlide,setActiveSlide]=useState(0);
  const [menuOpen,setMenuOpen]=useState(false);
  const [form,setForm]=useState({name:'',email:'',type:'Wedding / event',message:''});
  const [submission,setSubmission]=useState<'idle'|'sending'|'success'|'error'>('idle');
  const [submissionError,setSubmissionError]=useState('');
  useEffect(()=>{
    document.body.style.overflow=menuOpen?'hidden':'';
    const onKey=(event:KeyboardEvent)=>{if(event.key==='Escape')setMenuOpen(false);};
    window.addEventListener('keydown',onKey);
    return()=>{document.body.style.overflow='';window.removeEventListener('keydown',onKey);};
  },[menuOpen]);
  const goTo=(id:string)=>{setMenuOpen(false);document.getElementById(id)?.scrollIntoView({behavior:'smooth'})};
  const sendInquiry=async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    if(submission==='sending')return;
    setSubmission('sending');
    setSubmissionError('');
    const controller=new AbortController();
    const timeout=window.setTimeout(()=>controller.abort(),20000);
    try{
      const response=await fetch('https://formspree.io/f/mzeegbel',{
        method:'POST',
        headers:{'Accept':'application/json','Content-Type':'application/json'},
        body:JSON.stringify({...form,subject:`Frames by Andrej inquiry — ${form.type}`}),
        signal:controller.signal,
      });
      if(!response.ok)throw new Error(response.status===429
        ?'Too many inquiries sent. Please wait a little and try again.'
        :'Your inquiry could not be sent. Please try again or contact me on Instagram or Facebook.');
      setSubmission('success');
      setForm({name:'',email:'',type:'Wedding / event',message:''});
    }catch(error){
      setSubmission('error');
      setSubmissionError(error instanceof Error&&error.name!=='AbortError'&&!(error instanceof TypeError)
        ?error.message
        :'Unable to confirm delivery. Check your connection and try again, or contact me on Instagram or Facebook.');
    }finally{
      window.clearTimeout(timeout);
    }
  };
  return <>
    <header className="site-header"><div className="header-inner">
      <button className="brand" onClick={()=>goTo('home')} aria-label={t("Go to homepage")}><Image src="/branding/frames-logo-trim.png" alt="Frames by Andrej Photography and Film" width={190} height={130} priority/></button>
      <nav className="desktop-nav" aria-label="Main navigation"><button onClick={()=>goTo('home')}>{t("Home")}</button><button onClick={()=>goTo('collections')}>{t("Collections")}</button><Link href={galleryPath(locale)}>{t("Gallery")}</Link><button onClick={()=>goTo('about')}>{t("About")}</button><button onClick={()=>goTo('contact')}>{t("Contact")}</button></nav>
      <div className="header-right"><Link className="language-switch" href={homePath(locale==="mk"?"en":"mk")} hrefLang={locale==="mk"?"en":"mk"}>{locale==="mk"?"EN":"МК"}</Link><a href={facebook} target="_blank" rel="noreferrer" className="social-icon" aria-label="Facebook"><Facebook size={18}/></a><a href={instagram} target="_blank" rel="noreferrer" className="social-icon" aria-label="Instagram"><Instagram size={18}/></a>{tiktok&&<a href={tiktok} target="_blank" rel="noreferrer" className="social-icon" aria-label="TikTok" title="TikTok"><Music2 size={18}/></a>}<button className="outline-button header-cta" onClick={()=>goTo('contact')}>{t("LET'S TALK")}<ArrowUpRight size={15}/></button><button className="menu-toggle" onClick={()=>setMenuOpen(!menuOpen)} aria-label={t(menuOpen?'Close menu':'Open menu')} aria-expanded={menuOpen}>{menuOpen?<X/>:<Menu/>}</button></div>
    </div></header>
    {menuOpen&&<div className="mobile-menu">{['home','collections','about','contact'].map(n=><button key={n} onClick={()=>goTo(n)}>{t(({home:"Home",collections:"Collections",about:"About",contact:"Contact"} as Record<string,string>)[n])}</button>)}<Link href={galleryPath(locale)} onClick={()=>setMenuOpen(false)}>{t("Gallery")}</Link><span>FRAMES BY ANDREJ · PHOTOGRAPHY & FILM</span></div>}
    <main>
      <section className="hero" id="home" aria-label={t("Welcome")}><img className="hero-image" key={activeSlide} src={slides[activeSlide].image} srcSet={responsiveSources(slides[activeSlide].image)} sizes="100vw" alt={slides[activeSlide].alt||t("Photography in North Macedonia")} fetchPriority="high" decoding="async"/><div className="hero-shade"/><div className="hero-inner"><div className="hero-copy">{slides.map((slide,index)=><div className="hero-slide-text" key={index} aria-hidden={index!==activeSlide} style={{visibility:index===activeSlide?"visible":"hidden"}}><p className="eyebrow gold hero-eyebrow"><span className="tiny-line"/>{slide.eyebrow}</p><p className="hero-title" style={{visibility:"hidden"}} aria-hidden="true">{slide.heading}</p><p className="hero-description">{slide.sub}</p></div>)}<h1 className="hero-title">{slides[activeSlide].heading}</h1><div className="hero-actions"><button className="solid-button" onClick={()=>goTo('portfolio')}>{t("EXPLORE MY WORK")}<ArrowUpRight size={17}/></button><button className="text-link light" onClick={()=>goTo('about')}>{t("THE STORY BEHIND THE LENS")}<ArrowRight size={17}/></button></div></div><div className="hero-bottom"><button className="scroll-cue" onClick={()=>goTo('collections')}><span className="scroll-line"/><ArrowDown size={15}/>{t("SCROLL TO EXPLORE")}</button><div className="slide-controls"><button aria-label={t("Previous hero image")} onClick={()=>setActiveSlide((activeSlide+slides.length-1)%slides.length)}><ArrowLeft size={17}/></button><span>0{activeSlide+1} <i>/</i> 0{slides.length}</span><button aria-label={t("Next hero image")} onClick={()=>setActiveSlide((activeSlide+1)%slides.length)}><ArrowRight size={17}/></button></div></div></div><span className="vertical-label">{t("CAPTURING WHAT MATTERS — EST. 2026")}</span></section>
      <section className="local-intro section"><div className="container"><p className="eyebrow">{locale==="mk"?"ФОТОГРАФ ВО МАКЕДОНИЈА":"PHOTOGRAPHY IN NORTH MACEDONIA"}</p><h2>{intro.heading}</h2><p>{intro.body}</p><p>{intro.detail}</p><a className="text-link" href="#contact">{intro.cta} <ArrowUpRight size={16}/></a></div></section><section className="section collections-section" id="collections"><div className="container"><div className="section-heading"><div><p className="eyebrow"><span className="tiny-line"/>{t("EXPLORE THE COLLECTIONS")}</p><h2>{t("Stories in ")}<em>{t("every frame.")}</em></h2></div><p className="section-intro">{t("From quiet mountain mornings to the moments that bring us together. Every story deserves to be seen.")}</p></div><div className="collection-grid">{collections.map((c,i)=><Link key={c.title} className="collection-card" href={galleryPath(locale,categoryKey(c.category))}><img className="photo-fill collection-cover" src={c.image} alt={c.title} loading="lazy" decoding="async"/><div className="card-shade"/><span className="collection-number">{String(i+1).padStart(2,"0")} / {String(collections.length).padStart(2,"0")}</span><div className="collection-info"><span>{c.subtitle}</span><h3>{c.title}</h3><div className="card-link">{t("VIEW COLLECTION")}<ArrowUpRight size={16}/></div></div></Link>)}</div></div></section>
      <section className="statement-section"><div className="container statement-content"><span className="eyebrow gold">{t("A DIFFERENT WAY OF SEEING")}</span><p>{t("Photography is the art of ")}<em>{t("noticing")}</em>{t(" what the world almost lets us miss.")}</p><div className="statement-rule"/><span className="statement-signature">— Frames by Andrej</span></div></section>
      <section className="section portfolio-section" id="portfolio"><div className="container"><div className="section-heading portfolio-heading"><div><p className="eyebrow"><span className="tiny-line"/>{t("SELECTED PHOTOGRAPHS")}</p><h2>{t("Featured ")}<em>{t("work.")}</em></h2></div><p className="section-intro">{t("A glimpse into the moments, details and destinations that caught my eye.")}</p></div><PhotoGallery photos={gallery} categories={categories} preview locale={locale}/><div className="center-action"><Link className="outline-button" href={galleryPath(locale)}>{t("VIEW FULL GALLERY")}<ArrowUpRight size={16}/></Link></div></div></section>
      <section className="about-section" id="about"><div className="about-photo" style={{backgroundImage:`url('${aboutImage}')`}}/><div className="about-copy"><p className="eyebrow"><span className="tiny-line"/>{t("BEHIND THE CAMERA")}</p><h2>{t("Hey, I'm ")}<em>{t("Andrej.")}</em></h2><p className="about-lead">{t(aboutLead)}</p>{aboutParagraphs.map((paragraph,i)=><p key={i}>{t(paragraph)}</p>)}<button className="outline-button" onClick={()=>goTo('contact')}>{t("LET'S CREATE SOMETHING")}<ArrowUpRight size={16}/></button><span className="about-index">{t("01 — THE PERSON BEHIND THE FRAMES")}</span></div></section>
      <section className="services-section section" id="services"><div className="container"><div className="section-heading"><div><p className="eyebrow"><span className="tiny-line"/>{t("WHAT I CAN CAPTURE")}</p><h2>{t("Let's make it ")}<em>{t("memorable.")}</em></h2></div><p className="section-intro">{t("Thoughtful photography and film for the people and places that matter to you.")}</p></div><div className="services-list">{[{n:'01',t:'Weddings & celebrations',d:'Real emotion. Unscripted moments. Memories to revisit.'},{n:'02',t:'Portrait sessions',d:'Natural, expressive portraits that feel like you.'},{n:'03',t:'Creative projects & film',d:'Visual storytelling for ideas, places, and brands.'}].map(s=><button key={s.n} className="service-row" onClick={()=>{setForm({...form,type:s.n==="01"?"Wedding / event":s.n==="02"?"Portrait session":"Creative project"});goTo('contact')}}><span>{s.n}</span><h3>{t(s.t)}</h3><p>{t(s.d)}</p><ArrowUpRight size={23}/></button>)}</div></div></section>
      <section className="contact-section" id="contact"><div className="contact-bg" style={{backgroundImage:`url('${photos.hero3}')`}}/><div className="contact-overlay"/><div className="container contact-layout"><div className="contact-text"><p className="eyebrow gold"><span className="tiny-line"/>{t("YOUR STORY STARTS HERE")}</p><h2>{t("Let's create")}<br/><em>{t("something timeless.")}</em></h2><p>{t("Have an idea, an event, or a moment worth remembering? I'd love to hear about it.")}</p>{content?.settings?.contactEmail&&<p><a href={`mailto:${content.settings.contactEmail}`}>{content.settings.contactEmail}</a></p>}{content?.settings?.phone&&<p><a href={`tel:${content.settings.phone.replace(/[^+0-9]/g,"")}`}>{content.settings.phone}</a></p>}<a className="contact-social" href={instagram} target="_blank" rel="noreferrer"><Instagram size={17}/>{t("FIND ME ON INSTAGRAM")}<ArrowUpRight size={16}/></a><br/><a className="contact-social" href={facebook} target="_blank" rel="noreferrer"><Facebook size={17}/>{t("FIND ME ON FACEBOOK")}<ArrowUpRight size={16}/></a>{tiktok&&<><br/><a className="contact-social" href={tiktok} target="_blank" rel="noreferrer"><Music2 size={17}/>{t("FIND ME ON TIKTOK")}<ArrowUpRight size={16}/></a></>}</div><form className="contact-form" action="https://formspree.io/f/mzeegbel" method="POST" onSubmit={sendInquiry} aria-busy={submission==="sending"}><p className="form-heading">{t("TELL ME ABOUT YOUR PROJECT")}</p><label>{t("Your name")}<input name="name" autoComplete="name" disabled={submission==="sending"} required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder={t("How should I call you?")}/></label><label>{t("Email address")}<input name="email" autoComplete="email" disabled={submission==="sending"} required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com"/></label><label>{t("I'm interested in")}<select name="type" disabled={submission==="sending"} value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option value="Wedding / event">{t("Wedding / event")}</option><option value="Portrait session">{t("Portrait session")}</option><option value="Creative project">{t("Creative project")}</option><option value="Other inquiry">{t("Other inquiry")}</option></select></label><label>{t("Your message")}<textarea name="message" disabled={submission==="sending"} required rows={3} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder={t("Tell me a little about your plans...")}/></label><button className="solid-button" type="submit" disabled={submission==="sending"}>{submission==="sending"?t("SENDING…"):t("SEND INQUIRY")} <ArrowUpRight size={17}/></button><p className="form-note" role="status" aria-live="polite">{submission==="success"?t("Thank you! Your inquiry has been sent. I’ll get back to you soon."):submission==="error"?t(submissionError):t("Your inquiry will be sent directly to my inbox.")}</p></form></div></section>
    </main>
    <footer className="footer"><div className="container"><div className="footer-main"><button onClick={()=>goTo('home')} className="footer-brand"><Image src="/branding/frames-logo-trim.png" alt="Frames by Andrej" width={190} height={130}/></button><p>{t("Photography & film.")}<br/>{t("Made with intention, remembered with feeling.")}</p><div className="footer-links"><Link href={galleryPath(locale)}>{t("Gallery")}</Link><button onClick={()=>goTo('about')}>{t("About")}</button><button onClick={()=>goTo('services')}>{t("Services")}</button><button onClick={()=>goTo('contact')}>{t("Contact")}</button></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} FRAMES BY ANDREJ. {t("ALL RIGHTS RESERVED.")}</span><span>{t("BASED IN NORTH MACEDONIA · AVAILABLE FOR YOUR NEXT STORY")}</span><button onClick={()=>goTo('home')} aria-label={t("Back to top")}>{t("BACK TO TOP ↑")}</button></div></div></footer>
  </>;
}
