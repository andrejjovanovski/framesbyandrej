import HomePage,{homeSEO} from '../../components/HomePage';
export const dynamic='force-dynamic';
export const generateMetadata=()=>homeSEO('en');
export default function EnglishHome(){return <HomePage locale="en"/>;}
