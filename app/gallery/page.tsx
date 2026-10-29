import type {Metadata} from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {ArrowLeft, ArrowUpRight} from 'lucide-react';
import PhotoGallery from '../../components/PhotoGallery';
import {getSiteContent} from '../../lib/sanity';
import {categoryOptions} from '../../lib/categories';

export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Gallery | Frames by Andrej',description:'Explore photographs by Andrej: landscapes, wildlife, portraits, and more.'};

export default async function GalleryPage({searchParams}:{searchParams:Promise<{category?:string|string[]}>}) {
  const [content,params]=await Promise.all([getSiteContent({allPhotos:true}),searchParams]);
  const category=typeof params.category==='string'?params.category:'';
  const categories=categoryOptions(content?.categories??[],content?.collections.map(collection=>collection.category)??[]);
  return <>
    <header className="site-header gallery-header"><div className="header-inner">
      <Link href="/" className="brand" aria-label="Go to homepage"><Image src="/branding/frames-logo-trim.png" alt="Frames by Andrej Photography and Film" width={190} height={130} priority/></Link>
      <nav className="gallery-nav" aria-label="Main navigation"><Link href="/">Home</Link><Link href="/gallery" aria-current="page">Gallery</Link><Link href="/#contact">Contact <ArrowUpRight size={14}/></Link></nav>
    </div></header>
    <main className="gallery-page container">
      <Link className="gallery-back" href="/"><ArrowLeft size={15}/> BACK TO HOME</Link>
      <div className="gallery-intro"><p className="eyebrow"><span className="tiny-line"/>PLACES, PEOPLE & STORIES</p>
        <h1>The <em>gallery.</em></h1><p>A closer look at the moments worth remembering. Explore the full collection, one frame at a time.</p>
      </div>
      {!content&&<p className="gallery-notice" role="status">The gallery is temporarily unavailable. Please refresh in a moment.</p>}
      <PhotoGallery key={category} photos={content?.gallery??[]} categories={categories} initialCategory={category}/>
    </main>
    <footer className="footer"><div className="container gallery-footer"><p>Photography & film. Made with intention.</p><Link className="outline-button" href="/#contact">LET’S CREATE SOMETHING <ArrowUpRight size={16}/></Link></div></footer>
  </>;
}
