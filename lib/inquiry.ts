export const SERVICES=[
  {id:'portrait',label:'Portrait Photography'}, {id:'wedding-photo',label:'Wedding Photography'},
  {id:'event',label:'Event Photography'}, {id:'commercial-photo',label:'Commercial Photography'},
  {id:'commercial-video',label:'Commercial Video Production'}, {id:'wedding-video',label:'Wedding Videography'},
  {id:'cinematic-film',label:'Cinematic Filmmaking'}, {id:'other',label:'Other'},
] as const;
export type Service=typeof SERVICES[number]['id'];
export const validService=(value:unknown):value is Service=>typeof value==='string'&&SERVICES.some(service=>service.id===value);
export type Inquiry={name:string;email:string;phone:string;service:Service|'';date:string;location:string;budget:string;message:string;website:string};
export type InquiryField=keyof Inquiry;
export const emptyInquiry=(service:Service|'') : Inquiry=>({name:'',email:'',phone:'',service,date:'',location:'',budget:'',message:'',website:''});
export function validateInquiry(input:unknown){
  const value=(input&&typeof input==='object'?input:{}) as Record<string,unknown>;
  const data=Object.fromEntries(['name','email','phone','service','date','location','budget','message','website'].map(key=>[key,typeof value[key]==='string'?(value[key] as string).trim():''])) as unknown as Inquiry;
  const errors:Partial<Record<InquiryField,string>>={};
  if(!data.name||data.name.length>120)errors.name='Please enter your full name (up to 120 characters).';
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)||data.email.length>254)errors.email='Please enter a valid email address.';
  if(!validService(data.service))errors.service='Please choose a service.';
  if(!data.message||data.message.length>5000)errors.message='Please describe your project (up to 5,000 characters).';
  if(data.phone.length>50)errors.phone='Please shorten your phone number.';
  if(data.location.length>200)errors.location='Please shorten the location (up to 200 characters).';
  if(data.budget.length>100)errors.budget='Please shorten the budget (up to 100 characters).';
  if(data.date&&(!/^\d{4}-\d{2}-\d{2}$/.test(data.date)||!Number.isFinite(Date.parse(data.date))||new Date(data.date).toISOString().slice(0,10)!==data.date))errors.date='Please choose a valid project date.';
  return {data,errors,valid:Object.keys(errors).length===0&&!data.website};
}
