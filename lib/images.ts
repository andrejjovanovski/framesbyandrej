export function responsiveSources(src:string) {
  try{
    const url=new URL(src);
    if(url.hostname!=='cdn.sanity.io')return undefined;
    return [360,640,960,1280,1800,2200].map(width=>{
      const image=new URL(url);image.searchParams.set('w',String(width));
      return `${image.href} ${width}w`;
    }).join(', ');
  }catch{return undefined;}
}
