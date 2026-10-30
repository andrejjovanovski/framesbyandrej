import {defineField, defineType} from 'sanity';
import CategoryInput from '../CategoryInput';
export const collectionType = defineType({name:'collection',title:'Collection',type:'document',fields:[
 defineField({name:'title',type:'string',validation:r=>r.required()}),
 defineField({name:'titleMk',title:'Name / title (Macedonian)',type:'string',description:'Macedonian text for the main website. The original field is used on the English version.'}),
 defineField({name:'subtitle',type:'string'}),
 defineField({name:'subtitleMk',title:'Subtitle (Macedonian)',type:'string'}),
 defineField({name:'category',type:'string',components:{input:CategoryInput},validation:r=>r.required()}),
 defineField({name:'altMk',title:'Image description (Macedonian)',type:'string',description:'Describe what is visible and the real location when relevant.'}),
 defineField({name:'image',type:'image',options:{hotspot:true},validation:r=>r.required()}),
 defineField({name:'order',type:'number'})
 ],preview:{select:{title:'title',subtitle:'category',media:'image'}}});
