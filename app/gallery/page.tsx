import {permanentRedirect} from 'next/navigation';
import GalleryPage,{gallerySEO,pageNumber} from '../../components/GalleryPage';
import {categoryKey} from '../../lib/categories';
import {galleryPath} from '../../lib/i18n';
export const dynamic='force-dynamic';
type Props={searchParams:Promise<{category?:string;page?:string}>};
export async function generateMetadata({searchParams}:Props){const params=await searchParams;return gallerySEO('mk',categoryKey(params.category||''),pageNumber(params.page));}
export default async function Gallery({searchParams}:Props){const params=await searchParams;const page=pageNumber(params.page);if(params.category)permanentRedirect(galleryPath('mk',categoryKey(params.category),page));return <GalleryPage locale="mk" page={page}/>;}
