import Link from 'next/link';
import {getSiteContent} from '../lib/sanity';
import {validService} from '../lib/inquiry';
import {productionTranslator} from '../lib/production-i18n';
import {contactPath} from '../lib/paths';
import {pageMetadata} from '../lib/seo';
import {type Locale} from '../lib/i18n';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import InquiryForm from './InquiryForm';
export const contactMetadata=(locale:Locale)=>pageMetadata(locale,`${productionTranslator(locale)('Contact')} | Frames by Andrej`,productionTranslator(locale)('Tell me what you are planning, and I’ll get back to you about availability and next steps.'),contactPath(locale),contactPath(locale==='mk'?'en':'mk'));
export default async function ContactPage({locale,service}:{locale:Locale;service?:string|string[]}){
 const t=productionTranslator(locale),content=await getSiteContent({locale});const selected=validService(service)?service:'';
 return <><SiteHeader locale={locale} alternate={contactPath(locale==='mk'?'en':'mk',selected)} active="Contact" settings={content?.settings}/><main className="container booking-page"><section className="booking-intro"><p className="eyebrow">{t('YOUR STORY STARTS HERE')}</p><h1>{t('Your next story starts here.')}</h1><p>{t('Tell me what you are planning, and I’ll get back to you about availability and next steps.')}</p>
 {content?.settings?.contactEmail&&<p><a href={`mailto:${content.settings.contactEmail}`}>{content.settings.contactEmail}</a></p>}{content?.settings?.phone&&<p><a href={`tel:${content.settings.phone.replace(/[^+0-9]/g,'')}`}>{content.settings.phone}</a></p>}
 <div className="booking-social">{content?.settings?.instagramUrl&&<a href={content.settings.instagramUrl} target="_blank" rel="noreferrer">Instagram</a>}{content?.settings?.facebookUrl&&<a href={content.settings.facebookUrl} target="_blank" rel="noreferrer">Facebook</a>}{content?.settings?.tiktokUrl&&<a href={content.settings.tiktokUrl} target="_blank" rel="noreferrer">TikTok</a>}</div>
 <Link className="text-link" href={locale==='mk'?'/gallery':'/en/gallery'}>{t('VIEW FULL GALLERY')} →</Link></section><InquiryForm key={selected} locale={locale} service={selected}/></main><SiteFooter locale={locale}/></>;
}
