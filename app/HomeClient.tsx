'use client';
import type {SiteContent} from '../lib/sanity';
import {useEffect,useState} from 'react';
import Image from 'next/image';
import {ArrowDown,ArrowLeft,ArrowRight,ArrowUpRight,ChevronLeft,ChevronRight,Facebook,Instagram,Menu,Play,X} from 'lucide-react';

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
const sampleSlides=[
  {image:photos.hero,eyebrow:'PHOTOGRAPHY & FILM · NORTH MACEDONIA',heading:<>Moments worth<br/><em>remembering.</em></>,sub:'A collection of places, people, and stories — seen through my lens.'},
  {image:photos.hero2,eyebrow:'THE ART OF SEEING',heading:<>Chasing light.<br/><em>Finding stories.</em></>,sub:'A little wonder in every frame.'},
  {image:photos.hero3,eyebrow:'FRAMES BY ANDREJ',heading:<>Every place<br/><em>has a story.</em></>,sub:'From quiet landscapes to unforgettable celebrations.'},
];
const sampleCollections=[
  {title:'Nature & landscapes',subtitle:'WILD & WONDERFUL',image:photos.landscape,category:'Nature'},
  {title:'Urban & street',subtitle:'THE EVERYDAY',image:photos.urban,category:'Urban'},
  {title:'Portraits',subtitle:'THE HUMAN SIDE',image:photos.portrait,category:'Portraits'},
  {title:'Events & weddings',subtitle:'MOMENTS THAT MATTER',image:photos.wedding,category:'Events'},
];
const sampleGallery=[
  {src:photos.mountains,title:'Where the world feels still',type:'Nature'},
  {src:photos.urban,title:'After dark',type:'Urban'},
  {src:photos.wedding,title:'A day to remember',type:'Events'},
  {src:photos.lake,title:'Reflections',type:'Nature'},
  {src:photos.portrait,title:'In her element',type:'Portraits'},
  {src:photos.architecture,title:'Lines and light',type:'Urban'},
  {src:photos.forest,title:'Into the green',type:'Nature'},
];
const filters=['All','Nature','Wildlife','Urban','Portraits','Events'];
export default function HomeClient({content}:{content:SiteContent|null}){
  const slides=content?.slides.length?content.slides.map(s=>({...s,heading:<>{s.heading}<br/><em>{s.highlight}</em></>})):sampleSlides;
  const collections=content?.collections.length?content.collections:sampleCollections;
  const gallery=content?.gallery??sampleGallery;
  const aboutImage=content?.settings?.aboutImage||photos.about;
  const aboutLead=content?.settings?.aboutLead||"A photographer drawn to light, landscapes, and honest moments.";
  const aboutParagraphs=content?.settings?.aboutParagraphs?.length?content.settings.aboutParagraphs:["Based in North Macedonia, I see photography as more than capturing an image. It is a way to preserve a feeling, a place, or a moment that deserves to last.","Whether I’m exploring a new landscape or documenting someone’s special day, I look for the little details that make each story unique."];
  const instagram=content?.settings?.instagramUrl||"https://instagram.com/";
  const facebook=content?.settings?.facebookUrl||"https://www.facebook.com/profile.php?id=61595732512781";
  const [activeSlide,setActiveSlide]=useState(0);
  const [menuOpen,setMenuOpen]=useState(false);
  const [filter,setFilter]=useState('All');
  const [lightbox,setLightbox]=useState<number|null>(null);
  const [showAll,setShowAll]=useState(false);
  const [form,setForm]=useState({name:'',email:'',type:'Wedding / event',message:''});
  const [submission,setSubmission]=useState<'idle'|'sending'|'success'|'error'>('idle');
  const [submissionError,setSubmissionError]=useState('');
  const visible=gallery.filter(p=>filter==='All'||p.type===filter);
  const displayed=showAll?visible:visible.slice(0,6);
  useEffect(()=>{
    const onKey=(e:KeyboardEvent)=>{
      if(e.key==='Escape'){setLightbox(null);setMenuOpen(false)}
      if(lightbox!==null&&e.key==='ArrowRight')setLightbox((lightbox+1)%visible.length);
      if(lightbox!==null&&e.key==='ArrowLeft')setLightbox((lightbox-1+visible.length)%visible.length);
    };
    window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey);
  },[lightbox,visible.length]);
  useEffect(()=>{document.body.style.overflow=(lightbox!==null||menuOpen)?'hidden':'';return()=>{document.body.style.overflow=''}},[lightbox,menuOpen]);
  const goTo=(id:string)=>{setMenuOpen(false);document.getElementById(id)?.scrollIntoView({behavior:'smooth'})};
  const chooseCategory=(cat:string)=>{setFilter(cat);setShowAll(true);goTo('portfolio')};
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
      <button className="brand" onClick={()=>goTo('home')} aria-label="Go to homepage"><Image src="/branding/frames-logo-trim.png" alt="Frames by Andrej Photography and Film" width={190} height={130} priority/></button>
      <nav className="desktop-nav" aria-label="Main navigation"><button onClick={()=>goTo('home')}>Home</button><button onClick={()=>goTo('collections')}>Collections</button><button onClick={()=>goTo('portfolio')}>Portfolio</button><button onClick={()=>goTo('about')}>About</button><button onClick={()=>goTo('contact')}>Contact</button></nav>
      <div className="header-right"><a href={facebook} target="_blank" rel="noreferrer" className="social-icon" aria-label="Facebook"><Facebook size={18}/></a><a href={instagram} target="_blank" rel="noreferrer" className="social-icon" aria-label="Instagram"><Instagram size={18}/></a><button className="outline-button header-cta" onClick={()=>goTo('contact')}>LET'S TALK <ArrowUpRight size={15}/></button><button className="menu-toggle" onClick={()=>setMenuOpen(!menuOpen)} aria-label={menuOpen?'Close menu':'Open menu'} aria-expanded={menuOpen}>{menuOpen?<X/>:<Menu/>}</button></div>
    </div></header>
    {menuOpen&&<div className="mobile-menu">{['home','collections','portfolio','about','contact'].map(n=><button key={n} onClick={()=>goTo(n)}>{n}</button>)}<span>FRAMES BY ANDREJ · PHOTOGRAPHY & FILM</span></div>}
    <main>
      <section className="hero" id="home" aria-label="Welcome"><div className="hero-image" key={activeSlide} style={{backgroundImage:`url('${slides[activeSlide].image}')`}}/><div className="hero-shade"/><div className="hero-inner"><div className="hero-copy">{slides.map((slide,index)=><div className="hero-slide-text" key={index} aria-hidden={index!==activeSlide} style={{visibility:index===activeSlide?"visible":"hidden"}}><p className="eyebrow gold hero-eyebrow"><span className="tiny-line"/>{slide.eyebrow}</p><h1>{slide.heading}</h1><p className="hero-description">{slide.sub}</p></div>)}<div className="hero-actions"><button className="solid-button" onClick={()=>goTo('portfolio')}>EXPLORE MY WORK <ArrowUpRight size={17}/></button><button className="text-link light" onClick={()=>goTo('about')}>THE STORY BEHIND THE LENS <ArrowRight size={17}/></button></div></div><div className="hero-bottom"><button className="scroll-cue" onClick={()=>goTo('collections')}><span className="scroll-line"/><ArrowDown size={15}/> SCROLL TO EXPLORE</button><div className="slide-controls"><button aria-label="Previous hero image" onClick={()=>setActiveSlide((activeSlide+slides.length-1)%slides.length)}><ArrowLeft size={17}/></button><span>0{activeSlide+1} <i>/</i> 0{slides.length}</span><button aria-label="Next hero image" onClick={()=>setActiveSlide((activeSlide+1)%slides.length)}><ArrowRight size={17}/></button></div></div></div><span className="vertical-label">CAPTURING WHAT MATTERS — EST. 2026</span></section>
      <section className="section collections-section" id="collections"><div className="container"><div className="section-heading"><div><p className="eyebrow"><span className="tiny-line"/>EXPLORE THE COLLECTIONS</p><h2>Stories in <em>every frame.</em></h2></div><p className="section-intro">From quiet mountain mornings to the moments that bring us together. Every story deserves to be seen.</p></div><div className="collection-grid">{collections.map((c,i)=><button key={c.title} className="collection-card" onClick={()=>chooseCategory(c.category)}><div className="photo-fill" style={{backgroundImage:`url('${c.image}')`}}/><div className="card-shade"/><span className="collection-number">{String(i+1).padStart(2,"0")} / {String(collections.length).padStart(2,"0")}</span><div className="collection-info"><span>{c.subtitle}</span><h3>{c.title}</h3><div className="card-link">VIEW COLLECTION <ArrowUpRight size={16}/></div></div></button>)}</div></div></section>
      <section className="statement-section"><div className="container statement-content"><span className="eyebrow gold">A DIFFERENT WAY OF SEEING</span><p>Photography is the art of <em>noticing</em> what the world almost lets us miss.</p><div className="statement-rule"/><span className="statement-signature">— Frames by Andrej</span></div></section>
      <section className="section portfolio-section" id="portfolio"><div className="container"><div className="section-heading portfolio-heading"><div><p className="eyebrow"><span className="tiny-line"/>SELECTED PHOTOGRAPHS</p><h2>Featured <em>work.</em></h2></div><p className="section-intro">A glimpse into the moments, details and destinations that caught my eye.</p></div><div className="filter-row" aria-label="Filter photographs">{filters.map(f=><button key={f} onClick={()=>{setFilter(f);setShowAll(false)}} className={filter===f?'active':''} aria-pressed={filter===f}>{f}</button>)}</div><div className="portfolio-grid">{visible.length===0&&<p className="portfolio-empty" role="status">{filter==="All"?"New photographs coming soon.":"No photographs in this category yet."}</p>}{displayed.map((p,i)=><button className={`portfolio-photo photo-${i%6}`} key={p.title} onClick={()=>setLightbox(i)} aria-label={`Open photo: ${p.title}`}><div className="photo-fill" style={{backgroundImage:`url('${p.src}')`}}/><div className="portfolio-overlay"><span>{p.type.toUpperCase()}</span><div><h3>{p.title}</h3><ArrowUpRight size={20}/></div></div></button>)}</div>{visible.length>6&&<div className="center-action"><button className="outline-button" onClick={()=>setShowAll(!showAll)}>{showAll?'SHOW LESS':'VIEW MORE PHOTOGRAPHS'} <ArrowUpRight size={16}/></button></div>}</div></section>
      <section className="about-section" id="about"><div className="about-photo" style={{backgroundImage:`url('${aboutImage}')`}}/><div className="about-copy"><p className="eyebrow"><span className="tiny-line"/>BEHIND THE CAMERA</p><h2>Hey, I'm <em>Andrej.</em></h2><p className="about-lead">{aboutLead}</p>{aboutParagraphs.map((paragraph,i)=><p key={i}>{paragraph}</p>)}<button className="outline-button" onClick={()=>goTo('contact')}>LET'S CREATE SOMETHING <ArrowUpRight size={16}/></button><span className="about-index">01 — THE PERSON BEHIND THE FRAMES</span></div></section>
      <section className="services-section section" id="services"><div className="container"><div className="section-heading"><div><p className="eyebrow"><span className="tiny-line"/>WHAT I CAN CAPTURE</p><h2>Let's make it <em>memorable.</em></h2></div><p className="section-intro">Thoughtful photography and film for the people and places that matter to you.</p></div><div className="services-list">{[{n:'01',t:'Weddings & celebrations',d:'Real emotion. Unscripted moments. Memories to revisit.'},{n:'02',t:'Portrait sessions',d:'Natural, expressive portraits that feel like you.'},{n:'03',t:'Creative projects & film',d:'Visual storytelling for ideas, places, and brands.'}].map(s=><button key={s.n} className="service-row" onClick={()=>{setForm({...form,type:s.t});goTo('contact')}}><span>{s.n}</span><h3>{s.t}</h3><p>{s.d}</p><ArrowUpRight size={23}/></button>)}</div></div></section>
      <section className="contact-section" id="contact"><div className="contact-bg" style={{backgroundImage:`url('${photos.hero3}')`}}/><div className="contact-overlay"/><div className="container contact-layout"><div className="contact-text"><p className="eyebrow gold"><span className="tiny-line"/>YOUR STORY STARTS HERE</p><h2>Let's create<br/><em>something timeless.</em></h2><p>Have an idea, an event, or a moment worth remembering? I'd love to hear about it.</p><a className="contact-social" href={instagram} target="_blank" rel="noreferrer"><Instagram size={17}/> FIND ME ON INSTAGRAM <ArrowUpRight size={16}/></a><br/><a className="contact-social" href={facebook} target="_blank" rel="noreferrer"><Facebook size={17}/> FIND ME ON FACEBOOK <ArrowUpRight size={16}/></a></div><form className="contact-form" action="https://formspree.io/f/mzeegbel" method="POST" onSubmit={sendInquiry} aria-busy={submission==="sending"}><p className="form-heading">TELL ME ABOUT YOUR PROJECT</p><label>Your name<input name="name" autoComplete="name" disabled={submission==="sending"} required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="How should I call you?"/></label><label>Email address<input name="email" autoComplete="email" disabled={submission==="sending"} required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com"/></label><label>I'm interested in<select name="type" disabled={submission==="sending"} value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>Wedding / event</option><option>Portrait session</option><option>Creative project</option><option>Other inquiry</option></select></label><label>Your message<textarea name="message" disabled={submission==="sending"} required rows={3} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Tell me a little about your plans..."/></label><button className="solid-button" type="submit" disabled={submission==="sending"}>{submission==="sending"?"SENDING…":"SEND INQUIRY"} <ArrowUpRight size={17}/></button><p className="form-note" role="status" aria-live="polite">{submission==="success"?"Thank you! Your inquiry has been sent. I’ll get back to you soon.":submission==="error"?submissionError:"Your inquiry will be sent directly to my inbox."}</p></form></div></section>
    </main>
    <footer className="footer"><div className="container"><div className="footer-main"><button onClick={()=>goTo('home')} className="footer-brand"><Image src="/branding/frames-logo-trim.png" alt="Frames by Andrej" width={190} height={130}/></button><p>Photography & film.<br/>Made with intention, remembered with feeling.</p><div className="footer-links"><button onClick={()=>goTo('portfolio')}>Portfolio</button><button onClick={()=>goTo('about')}>About</button><button onClick={()=>goTo('services')}>Services</button><button onClick={()=>goTo('contact')}>Contact</button></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} FRAMES BY ANDREJ. ALL RIGHTS RESERVED.</span><span>BASED IN NORTH MACEDONIA · AVAILABLE FOR YOUR NEXT STORY</span><button onClick={()=>goTo('home')} aria-label="Back to top">BACK TO TOP ↑</button></div></div></footer>
    {lightbox!==null&&visible[lightbox]&&<div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={()=>setLightbox(null)}><button className="lightbox-close" onClick={()=>setLightbox(null)} aria-label="Close photo"><X/></button><button className="lightbox-prev" onClick={e=>{e.stopPropagation();setLightbox((lightbox-1+visible.length)%visible.length)}} aria-label="Previous photo"><ChevronLeft/></button><div className="lightbox-content" onClick={e=>e.stopPropagation()}><img src={visible[lightbox].src} alt={visible[lightbox].title}/><div className="lightbox-caption"><span>{visible[lightbox].title}</span><span>{lightbox+1} / {visible.length}</span></div></div><button className="lightbox-next" onClick={e=>{e.stopPropagation();setLightbox((lightbox+1)%visible.length)}} aria-label="Next photo"><ChevronRight/></button></div>}
  </>;
}
