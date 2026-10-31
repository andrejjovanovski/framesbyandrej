import PortfolioPage,{portfolioMetadata} from '../../../components/PortfolioPage';
export const dynamic='force-dynamic';
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props){return portfolioMetadata('mk','films',(await params).slug);}
export default async function Project({params}:Props){return <PortfolioPage locale="mk" kind="films" slug={(await params).slug}/>;}
