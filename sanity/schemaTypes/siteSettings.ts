import {defineField,defineType} from 'sanity';
export const siteSettingsType=defineType({name:'siteSettings',title:'Website settings',type:'document',fields:[
 defineField({name:'aboutImage',type:'image',options:{hotspot:true}}),
 defineField({name:'aboutLead',type:'string'}),
 defineField({name:'aboutParagraphs',type:'array',of:[{type:'text'}]}),
 defineField({name:'contactEmail',type:'email'}),
 defineField({name:'instagramUrl',type:'url'}),
 defineField({name:'facebookUrl',title:'Facebook URL',type:'url',initialValue:'https://www.facebook.com/profile.php?id=61595732512781'}),
 ],preview:{prepare:()=>({title:'Website settings'})}});
