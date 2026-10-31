import {defineField,defineType} from 'sanity';
import {commonProjectFields,localized} from './projectFields';
export const commercialProjectType=defineType({name:'commercialProject',title:'Commercial project',type:'document',fields:[
  ...commonProjectFields('commercial'),
  defineField({name:'projectType',title:'Project label',type:'string',initialValue:'personal',options:{list:[{title:'Client project',value:'client'},{title:'Personal Project',value:'personal'},{title:'Spec Work',value:'spec'}]},validation:r=>r.required()}),
  defineField({name:'client',title:'Client / business name',type:'string',description:'Only enter a real client. Do not add a client name for personal or spec work.',hidden:({document})=>document?.projectType!=='client',validation:r=>r.custom((value,context)=>context.document?.projectType==='client'&&!value?'Enter the real client name, or choose Personal Project / Spec Work.':true)}),
  ...localized('objective','Creative objective',true),...localized('approach','Creative approach',true),
  defineField({name:'services',title:'Services provided (English)',type:'array',of:[{type:'string'}]}),
  defineField({name:'servicesMk',title:'Services provided (Macedonian)',type:'array',of:[{type:'string'}]}),
  defineField({name:'deliverables',title:'Deliverables (English)',type:'array',of:[{type:'string'}]}),
  defineField({name:'deliverablesMk',title:'Deliverables (Macedonian)',type:'array',of:[{type:'string'}]}),
],preview:{select:{title:'title',media:'cover',subtitle:'category.title'}}});
