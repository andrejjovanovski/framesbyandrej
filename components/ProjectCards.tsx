import Link from 'next/link';
import {ArrowUpRight,Play} from 'lucide-react';
import {responsiveSources} from '../lib/images';
import {projectPath,type Project,type ProjectKind} from '../lib/portfolio';
import {productionTranslator} from '../lib/production-i18n';
import type {Locale} from '../lib/i18n';
export default function ProjectCards({projects,kind,locale}:{projects:Project[];kind:ProjectKind;locale:Locale}){
 const t=productionTranslator(locale);return <div className="project-grid">{projects.map(project=><Link className={`project-card ${kind==='films'?'film-card':''}`} key={project.id} href={projectPath(locale,kind,project.slug)}>
  <div className="project-card-image">{project.cover&&<img src={project.cover} srcSet={responsiveSources(project.cover)} sizes="(max-width:780px) 90vw, 45vw" alt={project.coverAlt} loading="lazy"/>}{project.videoUrl&&<span className="project-play" aria-hidden="true"><Play size={24}/></span>}<span className="project-card-action">{t(kind==='films'?'View film':'View project')} <ArrowUpRight size={18}/></span></div>
  <div className="project-card-meta"><span>{project.category||t(kind==='films'?'Films':'Commercial')}</span><span>{project.year||''}{project.runtime?` · ${project.runtime}`:''}</span></div>
  <h3>{project.title}</h3>{kind==='commercial'&&project.projectType!=='client'&&<p className="project-label">{t(project.projectType==='spec'?'Spec Work':'Personal Project')}</p>}
  {kind==='commercial'&&project.projectType==='client'&&project.client&&<p className="project-client">{project.client}</p>}
  {project.description&&<p>{project.description}</p>}
 </Link>)}</div>;
}
