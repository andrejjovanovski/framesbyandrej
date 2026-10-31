export type VideoSource={kind:'youtube'|'vimeo'|'file';src:string;original:string};
export function videoSource(raw?:string):VideoSource|null{
  if(!raw)return null;
  try{
    const url=new URL(raw);if(url.protocol!=='https:'||url.username||url.password)return null;
    const host=url.hostname.toLowerCase();
    if(['youtube.com','www.youtube.com','m.youtube.com','youtube-nocookie.com','www.youtube-nocookie.com','youtu.be'].includes(host)){
      const segments=url.pathname.split('/').filter(Boolean);
      const id=host==='youtu.be'?segments[0]:url.searchParams.get('v')||(['embed','shorts','live'].includes(segments[0])?segments[1]:'');
      if(!id||!/^[-\w]{11}$/.test(id))return null;
      return {kind:'youtube',src:`https://www.youtube-nocookie.com/embed/${id}?rel=0`,original:`https://www.youtube.com/watch?v=${id}`};
    }
    if(['vimeo.com','www.vimeo.com','player.vimeo.com'].includes(host)){
      const parts=url.pathname.split('/').filter(Boolean);const index=parts.findIndex(part=>/^\d+$/.test(part));if(index<0)return null;
      const id=parts[index];const hash=url.searchParams.get('h')||parts[index+1];
      if(hash&&!/^[a-zA-Z0-9]+$/.test(hash))return null;
      return {kind:'vimeo',src:`https://player.vimeo.com/video/${id}?dnt=1${hash?`&h=${encodeURIComponent(hash)}`:''}`,original:url.href};
    }
    if(/\.(mp4|webm)$/i.test(url.pathname))return {kind:'file',src:url.href,original:url.href};
  }catch{}
  return null;
}
