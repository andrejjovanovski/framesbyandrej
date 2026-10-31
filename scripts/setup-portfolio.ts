import {getCliClient} from 'sanity/cli';
const client=getCliClient({apiVersion:'2025-02-19'}).withConfig({useCdn:false});
const categories={
 films:[['Narrative Short Films','Наративни кратки филмови'],['Cinematic Reels','Кинематографски видеа'],['Commercial Films','Рекламни филмови'],['Music Videos','Музички спотови'],['Wedding Films','Свадбени филмови'],['Behind the Scenes','Зад сцената']],
 commercial:[['Product Photography','Фотографија на производи'],['Brand Photography','Фотографија за брендови'],['Food & Restaurant Photography','Фотографија на храна и ресторани'],['Business & Corporate Photography','Деловна и корпоративна фотографија'],['Promotional Videos','Промотивни видеа'],['Social Media Campaigns','Кампањи за социјални мрежи']],
};
async function main(){
 const existing=await client.fetch<{portfolioType?:string;slug?:{current?:string}}[]>('*[_type=="category"]{portfolioType,slug}',{},{perspective:'raw'});
 const transaction=client.transaction();let count=0;
 for(const[kind,rows]of Object.entries(categories))rows.forEach(([title,titleMk],order)=>{
  const key=title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  if(existing.some(row=>row.portfolioType===kind&&row.slug?.current===key))return;
  transaction.createIfNotExists({_id:`category-${kind}-${key}`,_type:'category',portfolioType:kind,title,titleMk,slug:{_type:'slug',current:key},order:order+1});count++;
 });
 if(count)await transaction.commit();
 console.log(`${count} starter portfolio categories created. No projects, clients, images or existing categories were changed.`);
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
