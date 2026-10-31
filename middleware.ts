import {NextResponse,type NextRequest} from 'next/server';

export function middleware(request:NextRequest) {
  const headers=new Headers(request.headers);
  headers.set('x-site-locale',request.nextUrl.pathname==='/en'||request.nextUrl.pathname.startsWith('/en/')?'en':'mk');
  const response=NextResponse.next({request:{headers}});
  if(process.env.VERCEL_ENV==='preview'||request.nextUrl.pathname.startsWith('/studio')){
    response.headers.set('X-Robots-Tag','noindex, nofollow');
  }
  return response;
}
export const config={matcher:['/','/gallery/:path*','/films/:path*','/commercial/:path*','/contact','/en/:path*','/studio/:path*']};
