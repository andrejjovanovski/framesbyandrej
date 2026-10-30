import {permanentRedirect} from 'next/navigation';
import GalleryPage,{gallerySEO,pageNumber} from '../../../components/GalleryPage';
import {categoryKey} from '../../../lib/categories';
import {galleryPath} from '../../../lib/i18n';
export const dynamic='force-dynamic';
type Props={searchParams:Promise<{category?:string;page?:string}>};
export async function generateMetadata({searchParams}:Props){const p=await searchParams;return gallerySEO('en',categoryKey(p.category||''),pageNumber(p.page));}
export default async function EnglishGallery({searchParams}:Props){const p=await searchParams;const page=pageNumber(p.page);if(p.category)permanentRedirect(galleryPath('en',categoryKey(p.category),page));return <GalleryPage locale="en" page={page}/>;}
