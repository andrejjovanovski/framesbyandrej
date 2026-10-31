import PortfolioPage,{portfolioMetadata} from '../../components/PortfolioPage';
export const dynamic='force-dynamic';
export const generateMetadata=()=>portfolioMetadata('mk','films');
export default function Portfolio(){return <PortfolioPage locale="mk" kind="films"/>;}
