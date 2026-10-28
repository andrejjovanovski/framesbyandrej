import {getCliClient} from 'sanity/cli';

const client = getCliClient({apiVersion: '2025-02-19'}).withConfig({useCdn: false});
const settings = {
  aboutLead: 'A photographer drawn to light, landscapes, and honest moments.',
  aboutParagraphs: [
    'Based in North Macedonia, I see photography as more than capturing an image. It is a way to preserve a feeling, a place, or a moment that deserves to last.',
    'Whether I’m exploring a new landscape or documenting someone’s special day, I look for the little details that make each story unique.',
  ],
  facebookUrl: 'https://www.facebook.com/profile.php?id=61595732512781',
};
const slides = [
  {eyebrow: 'PHOTOGRAPHY & FILM · NORTH MACEDONIA', heading: 'Moments worth', highlight: 'remembering.', sub: 'A collection of places, people, and stories — seen through my lens.', order: 1},
  {eyebrow: 'THE ART OF SEEING', heading: 'Chasing light.', highlight: 'Finding stories.', sub: 'A little wonder in every frame.', order: 2},
  {eyebrow: 'FRAMES BY ANDREJ', heading: 'Every place', highlight: 'has a story.', sub: 'From quiet landscapes to unforgettable celebrations.', order: 3},
];

async function main() {
  const existing = await client.fetch<{_id: string; _type: string; heading?: string; order?: number}[]>(
    '*[_type in ["siteSettings", "heroSlide"]]{_id,_type,heading,order}',
    {}, {perspective: 'raw'},
  );
  const settingsIds = [...new Set(existing.filter(d => d._type === 'siteSettings').map(d => d._id.replace(/^drafts\./, '')))];
  if (settingsIds.length > 1) throw new Error('Multiple Website settings entries exist. Select the entry to use before running setup.');
  const id = settingsIds[0] || 'website-settings';
  const draftId = `drafts.${id}`;
  let transaction = client.transaction();
  const draft = existing.find(d => d._id === draftId);
  if (!draft) {
    const published = settingsIds.length ? await client.getDocument(id) : null;
    const {_id, _rev, _createdAt, _updatedAt, ...fields} = published || {};
    transaction = transaction.createIfNotExists({_id: draftId, _type: 'siteSettings', ...fields});
  }
  transaction = transaction.patch(draftId, p => p.setIfMissing(settings));
  let added = 0;
  for (const slide of slides) {
    if (existing.some(d => d._type === 'heroSlide' && (d.heading === slide.heading || d.order === slide.order))) continue;
    transaction = transaction.createIfNotExists({_id: `drafts.homepage-hero-${slide.order}`, _type: 'heroSlide', ...slide});
    added++;
  }
  await transaction.commit();
  console.log(`Website settings draft prepared; ${added} slide drafts added. Add photos, email, and Instagram in Studio, then publish.`);
}

main().catch(error => {console.error(error.message); process.exitCode = 1;});
