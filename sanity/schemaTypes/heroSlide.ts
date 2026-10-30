import {defineField,defineType} from 'sanity';
export const heroSlideType=defineType({name:'heroSlide',title:'Homepage hero slide',type:'document',fields:[
 defineField({name:'headingMk',title:'Heading (Macedonian)',type:'string'}),
 defineField({name:'highlightMk',title:'Second line (Macedonian)',type:'string'}),
 defineField({name:'eyebrowMk',title:'Eyebrow (Macedonian)',type:'string'}),
 defineField({name:'subMk',title:'Description (Macedonian)',type:'text',rows:2}),
 defineField({name:'alt',title:'Image description (English)',type:'string'}),
 defineField({name:'altMk',title:'Image description (Macedonian)',type:'string'}),
 defineField({name:'eyebrow',type:'string'}),
 defineField({name:'heading',type:'string',validation:r=>r.required()}),
 defineField({name:'highlight',title:'Italic second line',type:'string'}),
 defineField({name:'sub',title:'Description',type:'text',rows:2}),
 defineField({name:'image',type:'image',options:{hotspot:true},validation:r=>r.required()}),
 defineField({name:'order',type:'number'})
 ],preview:{select:{title:'heading',media:'image'}}});
