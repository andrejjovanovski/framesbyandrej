import type {Locale} from './i18n';
export const projectPath=(locale:Locale,kind:'films'|'commercial',slug='')=>`${locale==='en'?'/en':''}/${kind}${slug?`/${encodeURIComponent(slug)}`:''}`;
export const contactPath=(locale:Locale,service='')=>`${locale==='en'?'/en':''}/contact${service?`?service=${encodeURIComponent(service)}`:''}`;
