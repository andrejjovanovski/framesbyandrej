import {defineField, defineType} from 'sanity';
export const collectionType = defineType({name:'collection',title:'Collection',type:'document',fields:[
 defineField({name:'title',type:'string',validation:r=>r.required()}),
 defineField({name:'subtitle',type:'string'}),
 defineField({name:'category',type:'string',options:{list:['Nature','Wildlife','Urban','Portraits','Events']},validation:r=>r.required()}),
 defineField({name:'image',type:'image',options:{hotspot:true},validation:r=>r.required()}),
 defineField({name:'order',type:'number'})
 ],preview:{select:{title:'title',subtitle:'category',media:'image'}}});
