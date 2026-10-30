import {defineField, defineType} from 'sanity';
import {categoryKey} from '../../lib/categories';

export const categoryType = defineType({
  name: 'category', title: 'Category', type: 'document',
  fields: [
    defineField({name:'description',title:'Category introduction (English)',type:'text',rows:3}),
    defineField({name:'descriptionMk',title:'Category introduction (Macedonian)',type:'text',rows:3}),
    defineField({name: 'title', title: 'Name', type: 'string', validation: r => r.required()}),
 defineField({name:'titleMk',title:'Name / title (Macedonian)',type:'string',description:'Macedonian text for the main website. The original field is used on the English version.'}),
    defineField({
      name: 'slug', title: 'Category ID', type: 'slug',
      options: {source: 'title', slugify: categoryKey},
      description: 'Generate once before publishing. Keep this ID unchanged when renaming the category so existing photographs stay connected.',
      validation: r => r.required().custom(async (value, context) => {
        if (!value?.current || !context.document?._id) return true;
        if (categoryKey(value.current) !== value.current) return 'Use lowercase letters, numbers, and single hyphens, or click Generate.';
        const id = context.document._id.replace(/^drafts\./, '');
        const published = await context.getClient({apiVersion:'2025-02-19'}).getDocument<{slug?:{current?:string}}>(id);
        return !published?.slug?.current || published.slug.current === value.current
          ? true : 'Keep the existing Category ID. Change the Name field to rename this category.';
      }),
    }),
    defineField({name: 'order', type: 'number', description: 'Lower numbers appear first in the portfolio filters.'}),
  ],
  orderings: [{title: 'Display order', name: 'displayOrder', by: [{field: 'order', direction: 'asc'}, {field: 'title', direction: 'asc'}]}],
  preview: {select: {title: 'title', subtitle: 'slug.current'}},
});
