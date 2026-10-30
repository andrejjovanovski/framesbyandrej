export type CategoryOption = {key: string; title: string; description?:string};

export function categoryKey(value: string) {
  const letters:Record<string,string>={'а':'a','б':'b','в':'v','г':'g','д':'d','ѓ':'gj','е':'e','ж':'zh','з':'z','ѕ':'dz','и':'i','ј':'j','к':'k','л':'l','љ':'lj','м':'m','н':'n','њ':'nj','о':'o','п':'p','р':'r','с':'s','т':'t','ќ':'kj','у':'u','ф':'f','х':'h','ц':'c','ч':'ch','џ':'dzh','ш':'sh'};
  return value.toLowerCase().replace(/[а-яѓѕјљњќџ]/g,letter=>letters[letter]||letter).normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Old entries store names such as "Nature"; new entries store stable IDs.
export function categoryOptions(managed: CategoryOption[], existing: string[]) {
  const options = new Map<string, CategoryOption>();
  for (const category of managed) {
    if (category.key && category.title) options.set(category.key, category);
  }
  for (const title of existing) {
    const key = categoryKey(title);
    if (key && !options.has(key)) options.set(key, {key, title});
  }
  return [...options.values()];
}
