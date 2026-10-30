import {getSiteContent,type SiteContent} from '../lib/sanity';
import {absolute,homeMetadata,pageMetadata,safeJson,BRAND} from '../lib/seo';
import {homePath,type Locale} from '../lib/i18n';
import HomeClient from '../app/HomeClient';

export async function homeSEO(locale:Locale){
  const content=await getSiteContent({locale});
  const base=homeMetadata(locale);
  const metadata=pageMetadata(locale,content?.settings?.seoTitle||String(base.title),content?.settings?.seoDescription||base.description||'',homePath(locale),homePath(locale==='mk'?'en':'mk'));
  if(!content)metadata.robots={index:false,follow:true};
  return metadata;
}

function businessSchema(locale:Locale,content:SiteContent|null){
  const settings=content?.settings;
  const sameAs=[settings?.instagramUrl,settings?.facebookUrl||'https://www.facebook.com/profile.php?id=61595732512781',settings?.tiktokUrl]
    .filter((url):url is string=>Boolean(url&&/^https?:\/\//.test(url)&&!/^https?:\/\/(www\.)?instagram\.com\/?$/.test(url)));
  const cityNames=['Kumanovo','Skopje','Kratovo','Kriva Palanka','Tetovo'];
  return {'@context':'https://schema.org','@graph':[
    {'@type':'Organization','@id':absolute('/#business'),name:BRAND,url:absolute('/'),logo:absolute('/branding/frames-logo-trim.png'),sameAs,
      description:locale==='mk'?'Фотографија за портрети, свадби, настани и креативни проекти во Северна Македонија.':'Portrait, wedding, event and creative photography in North Macedonia.',
      areaServed:[{'@type':'Country',name:'North Macedonia'},...cityNames.map(name=>({'@type':'City',name}))],
      ...(settings?.contactEmail&&!settings.contactEmail.includes('example.com')?{email:settings.contactEmail}:{}),
      ...(settings?.phone?{telephone:settings.phone}:{}),
    },
    {'@type':'WebSite','@id':absolute('/#website'),url:absolute('/'),name:BRAND,inLanguage:['mk-MK','en'],publisher:{'@id':absolute('/#business')}},
    {'@type':'WebPage','@id':absolute(`${homePath(locale)}#webpage`),url:absolute(homePath(locale)),name:settings?.seoTitle||String(homeMetadata(locale).title),inLanguage:locale==='mk'?'mk-MK':'en',isPartOf:{'@id':absolute('/#website')},about:{'@id':absolute('/#business')}},
  ]};
}

export default async function HomePage({locale}:{locale:Locale}){
  const content=await getSiteContent({locale});
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:safeJson(businessSchema(locale,content))}}/><HomeClient content={content} locale={locale}/></>;
}
