import {defineField, defineType} from 'sanity';
import CategoryInput from '../CategoryInput';
export const photoType = defineType({name:'photo', title:'Portfolio photograph', type:'document', fields:[
 defineField({name:'title',type:'string',validation:r=>r.required()}),
 defineField({name:'image',type:'image',options:{hotspot:true},validation:r=>r.required()}),
 defineField({name:'alt',title:'Accessible description',type:'string'}),
 defineField({name:'category',type:'string',components:{input:CategoryInput},validation:r=>r.required()}),
 defineField({name:'order',type:'number',description:'Lower numbers appear first'}),
 defineField({name:'featured',type:'boolean',initialValue:true,description:'Show this photograph in the website’s Featured Work section.'})
 ],preview:{select:{title:'title',media:'image',subtitle:'category'}}});
