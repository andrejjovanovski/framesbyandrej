import ContactPage,{contactMetadata} from '../../../components/ContactPage';
export const dynamic='force-dynamic';
export const generateMetadata=()=>contactMetadata('en');
export default async function Contact({searchParams}:{searchParams:Promise<{service?:string|string[]}>}){return <ContactPage locale="en" service={(await searchParams).service}/>;}
