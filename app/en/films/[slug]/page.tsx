import PortfolioPage,{portfolioMetadata} from '../../../../components/PortfolioPage';
export const dynamic='force-dynamic';
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props){return portfolioMetadata('en','films',(await params).slug);}
export default async function Project({params}:Props){return <PortfolioPage locale="en" kind="films" slug={(await params).slug}/>;}
