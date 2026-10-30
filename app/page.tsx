import HomePage,{homeSEO} from '../components/HomePage';

export const dynamic = 'force-dynamic';

export const generateMetadata=()=>homeSEO('mk');
export default function Home(){return <HomePage locale="mk"/>;}
