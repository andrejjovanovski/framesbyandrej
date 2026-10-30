import GalleryPage,{gallerySEO,pageNumber} from '../../../../components/GalleryPage';
export const dynamic='force-dynamic';
type Props={params:Promise<{category:string}>;searchParams:Promise<{page?:string}>};
export async function generateMetadata({params,searchParams}:Props){const [p,s]=await Promise.all([params,searchParams]);return gallerySEO('en',p.category,pageNumber(s.page));}
export default async function CategoryGallery({params,searchParams}:Props){const [p,s]=await Promise.all([params,searchParams]);return <GalleryPage locale="en" category={p.category} page={pageNumber(s.page)}/>;}
