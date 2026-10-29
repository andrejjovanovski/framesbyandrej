export type CategoryOption = {key: string; title: string};

export function categoryKey(value: string) {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
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
