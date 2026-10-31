import ContactPage,{contactMetadata} from '../../components/ContactPage';
export const dynamic='force-dynamic';
export const generateMetadata=()=>contactMetadata('mk');
export default async function Contact({searchParams}:{searchParams:Promise<{service?:string|string[]}>}){return <ContactPage locale="mk" service={(await searchParams).service}/>;}
