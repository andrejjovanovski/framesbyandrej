import {defineField,defineType} from 'sanity';
export const siteSettingsType=defineType({name:'siteSettings',title:'Website settings',type:'document',fields:[
 defineField({name:'aboutLeadMk',title:'About introduction (Macedonian)',type:'string'}),
 defineField({name:'aboutParagraphsMk',title:'Biography (Macedonian)',type:'array',of:[{type:'text'}]}),
 defineField({name:'seoTitleMk',title:'Homepage SEO title (Macedonian)',type:'string',validation:r=>r.max(70).warning()}),
 defineField({name:'seoDescriptionMk',title:'Homepage SEO description (Macedonian)',type:'text',rows:3,validation:r=>r.max(170).warning()}),
 defineField({name:'seoTitle',title:'Homepage SEO title (English)',type:'string',validation:r=>r.max(70).warning()}),
 defineField({name:'seoDescription',title:'Homepage SEO description (English)',type:'text',rows:3,validation:r=>r.max(170).warning()}),
 defineField({name:'phone',title:'Public contact telephone',type:'string',description:'Optional. Include +389. Only add a number you want publicly displayed.'}),
 defineField({name:'aboutImage',type:'image',options:{hotspot:true}}),
 defineField({name:'aboutLead',type:'string'}),
 defineField({name:'aboutParagraphs',type:'array',of:[{type:'text'}]}),
 defineField({name:'contactEmail',type:'email'}),
 defineField({name:'instagramUrl',type:'url'}),
 defineField({name:'tiktokUrl',title:'TikTok URL',type:'url',description:'Optional. The TikTok links are hidden until you add a URL and publish.',validation:r=>r.uri({scheme:['http','https']})}),
 defineField({name:'facebookUrl',title:'Facebook URL',type:'url',initialValue:'https://www.facebook.com/profile.php?id=61595732512781'}),
 ],preview:{prepare:()=>({title:'Website settings'})}});
