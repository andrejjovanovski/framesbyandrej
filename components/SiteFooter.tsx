import Link from 'next/link';
import {homePath,galleryPath,type Locale} from '../lib/i18n';
import {projectPath,contactPath} from '../lib/paths';
import {productionTranslator} from '../lib/production-i18n';
export default function SiteFooter({locale}:{locale:Locale}){const t=productionTranslator(locale);return <footer className="footer"><div className="container"><div className="gallery-footer"><Link href={homePath(locale)} className="footer-wordmark">FRAMES BY ANDREJ</Link><div className="footer-links"><Link href={galleryPath(locale)}>{t('Photography')}</Link><Link href={projectPath(locale,'films')}>{t('Films')}</Link><Link href={projectPath(locale,'commercial')}>{t('Commercial')}</Link><Link href={contactPath(locale)}>{t('Contact')}</Link></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} FRAMES BY ANDREJ.</span><span>{t('Photography & film. Made with intention.')}</span></div></div></footer>;}
