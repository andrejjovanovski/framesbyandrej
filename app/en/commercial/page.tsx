import PortfolioPage,{portfolioMetadata} from '../../../components/PortfolioPage';
export const dynamic='force-dynamic';
export const generateMetadata=()=>portfolioMetadata('en','commercial');
export default function Portfolio(){return <PortfolioPage locale="en" kind="commercial"/>;}
