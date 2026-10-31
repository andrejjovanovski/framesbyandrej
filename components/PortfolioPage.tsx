import Link from 'next/link';
import {notFound} from 'next/navigation';
import {ArrowUpRight,ArrowLeft} from 'lucide-react';
import {getSiteContent} from '../lib/sanity';
import {getProjects,type ProjectKind} from '../lib/portfolio';
import {projectPath,contactPath} from '../lib/paths';
import {homePath,type Locale} from '../lib/i18n';
import {productionTranslator} from '../lib/production-i18n';
import {absolute,pageMetadata,safeJson} from '../lib/seo';
import {responsiveSources} from '../lib/images';
import {videoSource} from '../lib/video';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import ProjectCards from './ProjectCards';
import PhotoGallery from './PhotoGallery';
import VideoPlayer from './VideoPlayer';

export async function portfolioMetadata(locale:Locale,kind:ProjectKind,slug=''){
 const t=productionTranslator(locale);const projects=await getProjects(kind,locale);
 const project=slug?projects?.find(row=>row.slug===slug):undefined;
 if(slug&&projects&&!project)notFound();
 const title=project?.seoTitle||`${project?.title||t(kind==='films'?'Films':'Commercial Photography & Video')} | Frames by Andrej`;
 const description=project?.seoDescription||project?.description||(kind==='films'?t('Cinematic Films, Creative Storytelling & Visual Experiences.'):t('Photography and cinematic video production designed to showcase products, people, and businesses.'));
 const metadata=pageMetadata(locale,title,description,projectPath(locale,kind,slug),projectPath(locale==='mk'?'en':'mk',kind,slug));
 if(project?.cover){metadata.openGraph={...metadata.openGraph,images:[{url:project.cover,alt:project.coverAlt}]};metadata.twitter={card:'summary_large_image',title,description,images:[project.cover]};}
 if(projects===null)metadata.robots={index:false,follow:true};
 return metadata;
}

export default async function PortfolioPage({locale,kind,slug=''}:{locale:Locale;kind:ProjectKind;slug?:string}){
 const t=productionTranslator(locale);const [projects,site]=await Promise.all([getProjects(kind,locale),getSiteContent({locale})]);
 const project=slug?projects?.find(row=>row.slug===slug):undefined;
 if(slug&&projects&&!project)notFound();
 const film=kind==='films';const cta=contactPath(locale,film?'cinematic-film':'commercial-photo');
 const alternate=projectPath(locale==='mk'?'en':'mk',kind,slug);
 const sections=project?[
  {title:film?'Synopsis':'Project overview',text:film?(project.synopsis||project.description):project.description},
  {title:'Creative objective',text:project.objective},{title:'Creative approach',text:project.approach},
  {title:'Production details',text:project.production},{title:'Technical notes',text:project.technical},
 ].filter(section=>section.text):[];
 const schema={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[
  {'@type':'ListItem',position:1,name:t('Home'),item:absolute(homePath(locale))},
  {'@type':'ListItem',position:2,name:t(film?'Films':'Commercial'),item:absolute(projectPath(locale,kind))},
  ...(project?[{'@type':'ListItem',position:3,name:project.title,item:absolute(projectPath(locale,kind,slug))}]:[]),
 ]};
 const cover=project?.cover||projects?.find(row=>row.featured&&row.cover)?.cover||projects?.find(row=>row.cover)?.cover;
 const featured=(projects||[]).filter(row=>row.featured),others=(projects||[]).filter(row=>!row.featured);
 const bts=project?project.behindScenes:(projects||[]).flatMap(row=>row.behindScenes).slice(0,8);
 const related=project?(projects||[]).filter(row=>row.id!==project.id).sort((a,b)=>Number(b.categoryId===project.categoryId)-Number(a.categoryId===project.categoryId)).slice(0,3):[];
 return <>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:safeJson(schema)}}/>
  {project&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:safeJson({'@context':'https://schema.org','@type':film?'Movie':'CreativeWork',name:project.title,description:project.description,image:project.cover,url:absolute(projectPath(locale,kind,slug)),inLanguage:locale==='mk'?'mk-MK':'en',...(project.date?{datePublished:project.date}:{}),...(project.creator?{creator:{'@type':'Person',name:project.creator}}:{})})}}/>}
  <SiteHeader locale={locale} alternate={alternate} active={film?'Films':'Commercial'} settings={site?.settings}/>
  <main className="production-page">
   <section className={`production-hero ${project?'project-hero':''}`}>
    {cover&&<img className="production-hero-image" src={cover} srcSet={responsiveSources(cover)} sizes="100vw" alt={project?.coverAlt||''} fetchPriority="high"/>}
    <div className="production-hero-shade"/><div className="container production-hero-content">
     {project&&<Link className="gallery-back" href={projectPath(locale,kind)}><ArrowLeft size={15}/>{t(film?'Return to films':'Return to commercial projects')}</Link>}
     <p className="eyebrow"><span className="tiny-line"/>{project?.category||t(film?'Films':'Commercial Photography & Video')}</p>
     <h1>{project?.title||t(film?'Stories Told Through Motion.':"Visuals That Tell Your Brand's Story.")}</h1>
     <p>{project?.description||t(film?'Cinematic Films, Creative Storytelling & Visual Experiences.':'Photography and cinematic video production designed to showcase products, people, and businesses.')}</p>
     {!project&&<div className="hero-actions"><a href="#projects" className="solid-button">{t(film?'Explore Films':'Explore Commercial Work')} <ArrowUpRight size={17}/></a><Link className="text-link" href={cta}>{t("Let's Create Something")} <ArrowUpRight size={17}/></Link></div>}
     {project&&<div className="project-facts">
      {film&&project.year&&<span>{t('Release year')}: {project.year}</span>}{film&&project.runtime&&<span>{t('Runtime')}: {project.runtime}</span>}{project.creator&&<span>{t('Director / creator')}: {project.creator}</span>}
      {!film&&<span>{project.projectType==='client'?`${t('Client')}: ${project.client||''}`:t(project.projectType==='spec'?'Spec Work':'Personal Project')}</span>}
      {project.date&&<span>{t('Published')}: {new Intl.DateTimeFormat(locale==='mk'?'mk-MK':'en-GB',{dateStyle:'medium'}).format(new Date(project.date))}</span>}
     </div>}
    </div>
   </section>
   {projects===null&&<div className="container portfolio-empty" role="status">{t('The portfolio is temporarily unavailable. Please try again shortly.')}</div>}
   {!slug&&<section className="section container" id="projects">
    {(projects?.length||0)>0?<>
     {featured.length>0&&<><div className="section-heading"><h2>{t(film?'Featured Films':'Commercial Photography & Video')}</h2></div><ProjectCards projects={featured} kind={kind} locale={locale}/></>}
     {others.length>0&&<><div className="section-heading project-following"><h2>{t(film?'All films':'Commercial Photography & Video')}</h2></div><ProjectCards projects={others} kind={kind} locale={locale}/></>}
    </>:projects!==null&&<div className="portfolio-empty-state"><span className="empty-frame" aria-hidden="true"/><h2>{t(film?'New films are in the making.':'A space for future collaborations.')}</h2><p>{t(film?'Published films will appear here. In the meantime, get in touch about a story you would like to tell.':'Commercial projects will appear here as they are published. Let’s talk about photography or video for your business.')}</p><Link className="outline-button" href={cta}>{t(film?"Let's Make a Film":'Start a Commercial Project')} <ArrowUpRight size={16}/></Link></div>}
   </section>}
   {project&&<div className="container project-detail-body">
    {project.videoUrl&&videoSource(project.videoUrl)&&<section className="project-video" aria-label={t('Watch film')}><VideoPlayer url={project.videoUrl} poster={project.cover} title={project.title} locale={locale}/></section>}
    <div className="project-editorial">{sections.map(section=><section key={section.title}><p className="eyebrow">{t(section.title)}</p><p className="project-prose">{section.text}</p></section>)}</div>
    {(project.services.length>0||project.deliverables.length>0||project.credits.length>0)&&<div className="project-editorial">
     {project.services.length>0&&<section><h2>{t('Services provided')}</h2><ul>{project.services.map((service,i)=><li key={i}>{service}</li>)}</ul></section>}
     {project.deliverables.length>0&&<section><h2>{t('Deliverables')}</h2><ul>{project.deliverables.map((deliverable,i)=><li key={i}>{deliverable}</li>)}</ul></section>}
     {project.credits.length>0&&<section><h2>{t('Credits')}</h2><dl className="credit-list">{project.credits.map((credit,i)=><div key={i}><dt>{credit.role}</dt><dd>{credit.name}</dd></div>)}</dl></section>}
    </div>}
    {project.images.length>0&&<section className="project-stills"><div className="section-heading"><h2>{t('Final photography')}</h2></div><PhotoGallery photos={project.images} categories={[]} preview locale={locale}/></section>}
   </div>}
   {(film||bts.length>0||project?.notes)&&<section className="section production-bts"><div className="container"><div className="section-heading"><div><p className="eyebrow">{t('Production details')}</p><h2>{t('Behind the Scenes')}</h2></div><p className="section-intro">{t('Production moments, lighting and the process behind the frame.')}</p></div>
    {project?.notes&&<p className="project-prose">{project.notes}</p>}{bts.length>0?<PhotoGallery photos={bts} categories={[]} preview locale={locale}/>:<p className="section-intro">{t('Production notes and behind-the-scenes photographs will appear alongside published projects.')}</p>}
   </div></section>}
   {related.length>0&&<section className="section container"><div className="section-heading"><h2>{t(film?'Related films':'Related projects')}</h2></div><ProjectCards projects={related} kind={kind} locale={locale}/></section>}
   <section className="section production-cta"><div className="container"><p className="eyebrow">FRAMES BY ANDREJ</p><h2>{t(film?'Have a Story Worth Telling?':'Start Your Project')}</h2><Link className="solid-button" href={project?.videoUrl&&!film?contactPath(locale,'commercial-video'):cta}>{t(film?"Let's Make a Film":'Start a Commercial Project')} <ArrowUpRight size={17}/></Link></div></section>
  </main><SiteFooter locale={locale}/>
 </>;
}
