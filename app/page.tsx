import {getSiteContent} from '../lib/sanity';
import HomeClient from './HomeClient';

export default async function Home() {
  const content = await getSiteContent();
  return <HomeClient content={content}/>;
}
