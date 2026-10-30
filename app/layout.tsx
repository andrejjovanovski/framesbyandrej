import type { Metadata } from 'next';
import {headers} from 'next/headers';
import {SITE_URL,isPreview} from '../lib/seo';
import './globals.css';
export const metadata: Metadata = {
  metadataBase:new URL(SITE_URL),
  applicationName:'Frames by Andrej',
  title:'Frames by Andrej',
  verification:{google:process.env.GOOGLE_SITE_VERIFICATION},
  robots:isPreview?{index:false,follow:false}:undefined,
};
export default async function RootLayout({children}:{children:React.ReactNode}) {
  const locale=(await headers()).get('x-site-locale')==='en'?'en':'mk';
  return <html lang={locale==='mk'?'mk-MK':'en'}><body>{children}</body></html>;
}
