import {defineField,defineType} from 'sanity';
import {commonProjectFields,localized} from './projectFields';
export const filmType=defineType({name:'film',title:'Film',type:'document',fields:[
  ...commonProjectFields('films'),
  ...localized('synopsis','Synopsis',true),
  defineField({name:'year',title:'Release year',type:'number',validation:r=>r.integer().min(1900).max(2200)}),
  defineField({name:'runtime',title:'Runtime',type:'string',description:'For example 04:32. Enter the actual runtime.'}),
  defineField({name:'creator',title:'Director / creator',type:'string'}),
  defineField({name:'credits',type:'array',of:[{type:'object',fields:[defineField({name:'role',title:'Role (English)',type:'string',validation:r=>r.required()}),defineField({name:'roleMk',title:'Role (Macedonian)',type:'string'}),defineField({name:'name',type:'string',validation:r=>r.required()})]}]}),
  ...localized('production','Production details',true),...localized('technical','Equipment / technical notes',true),
],preview:{select:{title:'title',media:'cover',subtitle:'category.title'}}});
