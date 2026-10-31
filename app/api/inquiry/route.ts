import {NextResponse,type NextRequest} from 'next/server';
import {validateInquiry,SERVICES} from '../../../lib/inquiry';
import {SITE_URL} from '../../../lib/seo';
export const runtime='nodejs';
export async function POST(request:NextRequest){
 const origin=request.headers.get('origin');
 if(origin&&origin!==request.nextUrl.origin&&origin!==SITE_URL)return NextResponse.json({ok:false,error:'submission'},{status:403});
 if(Number(request.headers.get('content-length')||0)>16000)return NextResponse.json({ok:false,error:'submission'},{status:413});
 let input:unknown;
 try{const body=await request.text();if(body.length>16000)return NextResponse.json({ok:false,error:'submission'},{status:413});input=JSON.parse(body);}catch{return NextResponse.json({ok:false,error:'submission'},{status:400});}
 const result=validateInquiry(input);
 if(!result.valid)return NextResponse.json({ok:false,error:'validation',fields:result.errors},{status:422});
 const {data}=result;const label=SERVICES.find(service=>service.id===data.service)!.label;
 try{
  const response=await fetch('https://formspree.io/f/mzeegbel',{method:'POST',headers:{Accept:'application/json','Content-Type':'application/json',Referer:origin||SITE_URL},body:JSON.stringify({name:data.name,email:data.email,phone:data.phone,service:label,serviceId:data.service,date:data.date,location:data.location,budget:data.budget,message:data.message,subject:`Frames by Andrej inquiry — ${label}`}),signal:AbortSignal.timeout(15000),cache:'no-store'});
  const responseData=await response.json().catch(()=>null);
  if(!response.ok||responseData?.ok!==true)return NextResponse.json({ok:false,error:response.status===429?'rate':'submission'},{status:response.status===429?429:502});
  return NextResponse.json({ok:true},{headers:{'Cache-Control':'no-store'}});
 }catch{return NextResponse.json({ok:false,error:'submission'},{status:502});}
}
