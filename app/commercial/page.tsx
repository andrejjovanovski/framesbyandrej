import PortfolioPage,{portfolioMetadata} from '../../components/PortfolioPage';
export const dynamic='force-dynamic';
export const generateMetadata=()=>portfolioMetadata('mk','commercial');
export default function Portfolio(){return <PortfolioPage locale="mk" kind="commercial"/>;}
