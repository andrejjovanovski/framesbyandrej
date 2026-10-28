import {defineField,defineType} from 'sanity';
export const heroSlideType=defineType({name:'heroSlide',title:'Homepage hero slide',type:'document',fields:[
 defineField({name:'eyebrow',type:'string'}),
 defineField({name:'heading',type:'string',validation:r=>r.required()}),
 defineField({name:'highlight',title:'Italic second line',type:'string'}),
 defineField({name:'sub',title:'Description',type:'text',rows:2}),
 defineField({name:'image',type:'image',options:{hotspot:true},validation:r=>r.required()}),
 defineField({name:'order',type:'number'})
 ],preview:{select:{title:'heading',media:'image'}}});
