'use client';
import {useState} from 'react';
import {Play,ArrowUpRight} from 'lucide-react';
import {videoSource} from '../lib/video';
import {productionTranslator} from '../lib/production-i18n';
import type {Locale} from '../lib/i18n';
export default function VideoPlayer({url,poster,title,locale}:{url:string;poster?:string;title:string;locale:Locale}){
 const t=productionTranslator(locale),source=videoSource(url);const [started,setStarted]=useState(false),[loaded,setLoaded]=useState(false),[error,setError]=useState(false);
 if(!source)return <p className="portfolio-empty">{t('Video could not be loaded.')}</p>;
 return <div className="video-block"><div className="video-frame">
  {!started?<button className="video-start" onClick={()=>setStarted(true)} aria-label={`${t('Watch video')}: ${title}`}>
   {poster&&<img src={poster} alt="" loading="lazy"/>}<span className="video-play"><Play size={30}/><span>{t('Watch video')}</span></span>
  </button>:source.kind==='file'?<video src={source.src} controls playsInline preload="none" poster={poster} onLoadedData={()=>setLoaded(true)} onError={()=>setError(true)} aria-label={title}/>:
   <iframe src={source.src} title={title} allow="fullscreen; picture-in-picture; encrypted-media" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" onLoad={()=>setLoaded(true)} onError={()=>setError(true)}/>
  }
  {started&&!loaded&&!error&&source.kind!=='file'&&<p className="video-loading" role="status">{t('Loading video…')}</p>}
 </div><p className="video-privacy">{t('Playing this video connects to its hosting provider. No video is downloaded before you choose to load it.')}</p>
 {started&&<p className="video-provider">{error&&<span role="alert">{t('Video could not be loaded.')} </span>}<a href={source.original} target="_blank" rel="noreferrer">{t('Watch on provider')} <ArrowUpRight size={14}/></a></p>}
 </div>;
}
