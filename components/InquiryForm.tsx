'use client';
import {useEffect,useRef,useState} from 'react';
import {ArrowUpRight} from 'lucide-react';
import {SERVICES,emptyInquiry,validateInquiry,type Service,type InquiryField} from '../lib/inquiry';
import {productionTranslator} from '../lib/production-i18n';
import type {Locale} from '../lib/i18n';
export default function InquiryForm({locale,service=''}:{locale:Locale;service?:Service|''}){
 const t=productionTranslator(locale);
 const [form,setForm]=useState(()=>emptyInquiry(service));
 const [status,setStatus]=useState<'idle'|'sending'|'success'|'error'>('idle');
 const [errors,setErrors]=useState<Partial<Record<InquiryField,string>>>({});
 const [message,setMessage]=useState('');const pending=useRef(false);const ref=useRef<HTMLFormElement>(null);
 useEffect(()=>setForm(current=>({...current,service})),[service]);
 const update=(field:InquiryField,value:string)=>{setForm(current=>({...current,[field]:value}));setErrors(current=>({...current,[field]:undefined}));if(status!=='sending')setStatus('idle');};
 const input=(field:InquiryField)=>({name:field,id:`inquiry-${field}`,value:form[field],disabled:status==='sending','aria-invalid':Boolean(errors[field]),'aria-describedby':errors[field]?`error-${field}`:undefined,onChange:(event:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>)=>update(field,event.target.value)});
 const error=(field:InquiryField)=>errors[field]?<span className="field-error" id={`error-${field}`}>{t(errors[field]!)}</span>:null;
 async function submit(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault();if(pending.current)return;
  const check=validateInquiry(form);setErrors(check.errors);
  if(!check.valid){setStatus('error');setMessage('Please check the highlighted fields.');const field=Object.keys(check.errors)[0];if(field)ref.current?.querySelector<HTMLElement>(`[name="${field}"]`)?.focus();return;}
  pending.current=true;setStatus('sending');setMessage('');
  try{
   const response=await fetch('/api/inquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(check.data),signal:AbortSignal.timeout(20000)});
   const data=await response.json();
   if(!response.ok||data.ok!==true){if(data.fields)setErrors(data.fields);throw new Error(data.error==='rate'?'Too many inquiries sent. Please wait a little and try again.':data.error==='validation'?'Please check the highlighted fields.':'Your inquiry could not be sent. Please try again.');}
   setStatus('success');setForm(emptyInquiry(service));
  }catch(error){setStatus('error');setMessage(error instanceof Error&&['Too many inquiries sent. Please wait a little and try again.','Please check the highlighted fields.','Your inquiry could not be sent. Please try again.'].includes(error.message)?error.message:'Unable to confirm delivery. Check your connection and try again, or contact me on Instagram or Facebook.');}
  finally{pending.current=false;}
 }
 return <form ref={ref} className="contact-form inquiry-form" onSubmit={submit} noValidate aria-busy={status==='sending'}>
  <p className="form-heading">{t('TELL ME ABOUT YOUR PROJECT')}</p>
  <fieldset><legend>{t('Contact information')}</legend>
   <label htmlFor="inquiry-name">{t('Full name')}<input {...input('name')} required autoComplete="name" maxLength={120}/>{error('name')}</label>
   <label htmlFor="inquiry-email">{t('Email address')}<input {...input('email')} required type="email" autoComplete="email" maxLength={254}/>{error('email')}</label>
   <label htmlFor="inquiry-phone">{t('Phone number (optional)')}<input {...input('phone')} type="tel" autoComplete="tel" maxLength={50}/>{error('phone')}</label>
  </fieldset>
  <fieldset><legend>{t('Project information')}</legend>
   <label htmlFor="inquiry-service">{t('Service type')}<select {...input('service')} required><option value="">{t('Choose a service')}</option>{SERVICES.map(option=><option key={option.id} value={option.id}>{t(option.label)}</option>)}</select>{error('service')}</label>
   <div className="inquiry-row"><label htmlFor="inquiry-date">{t('Project date (optional)')}<input {...input('date')} type="date"/>{error('date')}</label>
   <label htmlFor="inquiry-location">{t('Location (optional)')}<input {...input('location')} maxLength={200}/>{error('location')}</label></div>
   <label htmlFor="inquiry-budget">{t('Estimated budget (optional)')}<input {...input('budget')} maxLength={100}/>{error('budget')}</label>
   <label htmlFor="inquiry-message">{t('Project description')}<textarea {...input('message')} required rows={5} maxLength={5000}/>{error('message')}</label>
  </fieldset>
  <div className="inquiry-trap" aria-hidden="true"><label>Website<input name="website" value={form.website} onChange={e=>update('website',e.target.value)} tabIndex={-1} autoComplete="off"/></label></div>
  <button className="solid-button" type="submit" disabled={status==='sending'}>{t(status==='sending'?'SENDING…':'SEND INQUIRY')} <ArrowUpRight size={17}/></button>
  <p className="form-note" role={status==='error'?'alert':'status'} aria-live="polite">{status==='success'?t('Thank you! Your inquiry has been sent. I’ll get back to you soon.'):status==='error'?t(message):t('An inquiry is not a confirmed booking. I’ll reply to discuss your project and availability.')}</p>
 </form>;
}
