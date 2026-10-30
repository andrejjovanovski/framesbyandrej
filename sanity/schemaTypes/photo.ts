import {defineField, defineType} from 'sanity';
import CategoryInput from '../CategoryInput';
export const photoType = defineType({name:'photo', title:'Portfolio photograph', type:'document', fields:[
 defineField({name:'title',type:'string',validation:r=>r.required()}),
 defineField({name:'titleMk',title:'Name / title (Macedonian)',type:'string',description:'Macedonian text for the main website. The original field is used on the English version.'}),
 defineField({name:'altMk',title:'Image description (Macedonian)',type:'string',description:'Describe what is visible and the real location when relevant.'}),
 defineField({name:'image',type:'image',options:{hotspot:true},validation:r=>r.required()}),
 defineField({name:'alt',title:'Accessible description',type:'string'}),
 defineField({name:'category',type:'string',components:{input:CategoryInput},validation:r=>r.required()}),
 defineField({name:'order',type:'number',description:'Lower numbers appear first'}),
 defineField({name:'featured',type:'boolean',initialValue:true,description:'Show on the homepage in Order sequence, with no image limit. All published photographs remain in the full gallery.'})
 ],preview:{select:{title:'title',media:'image',subtitle:'category'}}});
