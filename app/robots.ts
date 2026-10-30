import type {MetadataRoute} from 'next';
import {SITE_URL,isPreview} from '../lib/seo';
export default function robots():MetadataRoute.Robots{
  return {rules:isPreview?{userAgent:'*',disallow:'/'}:{userAgent:'*',allow:'/',disallow:['/studio','/api/']},sitemap:`${SITE_URL}/sitemap.xml`,host:SITE_URL};
}
