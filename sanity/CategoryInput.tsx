import {useCallback, useEffect, useState} from 'react';
import {Button, Select, Stack, Text} from '@sanity/ui';
import {set, unset, useClient, type StringInputProps} from 'sanity';
import {categoryKey, categoryOptions, type CategoryOption} from '../lib/categories';

export default function CategoryInput(props: StringInputProps) {
  const client = useClient({apiVersion: '2025-02-19'});
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [existing, setExisting] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState(false);
  const refresh = useCallback(async () => {
    try {
      const result = await client.fetch<{categories:CategoryOption[];existing:string[]}>(
        '{"categories":*[_type=="category" && coalesce(portfolioType,"photography")=="photography" && defined(slug.current)]|order(order asc,title asc){title,"key":slug.current},"existing":array::unique(*[_type in ["photo","collection"] && defined(category)].category)}',
        {}, {perspective: 'published', cache: 'no-store'},
      );
      setCategories(result.categories);
      setExisting(result.existing);
      setError(false);
    } catch { setError(true); }
  }, [client]);
  useEffect(() => {
    void refresh();
    const subscription = client.listen('*[_type=="category"]', {}, {includeResult: false})
      .subscribe({next: () => {void refresh();}, error: () => {setError(true);}});
    return () => subscription.unsubscribe();
  }, [client, refresh]);
  const options = categoryOptions(categories, [...existing, ...(props.value ? [props.value] : [])]);
  const missing = options.filter(option => !categories.some(category => category.key === option.key));
  const importExisting = async () => {
    setImporting(true);
    try {
      const transaction = client.transaction();
      missing.forEach((option,index) => transaction.createIfNotExists({
        _id:`category-${option.key}`, _type:'category', title:option.title,
        slug:{_type:'slug',current:option.key}, order:categories.length+index+1,
      }));
      await transaction.commit();
      await refresh();
    } catch { setError(true); }
    finally { setImporting(false); }
  };
  return <Stack space={3}>
    <Select {...props.elementProps} value={categoryKey(props.value || '')} disabled={props.readOnly}
      onFocus={event => {props.elementProps.onFocus?.(event); void refresh();}}
      onChange={event => props.onChange(event.currentTarget.value ? set(event.currentTarget.value) : unset())}>
      <option value="">Select a category</option>
      {options.map(option => <option key={option.key} value={option.key}>{option.title}</option>)}
    </Select>
    <Text size={1} muted>{error ? 'Could not refresh categories. Try focusing this field again.' : 'Create and publish categories under Category in the Studio menu.'}</Text>
    {missing.length>0&&!props.readOnly&&<Button text="Create and publish existing categories" mode="ghost" disabled={importing} loading={importing} onClick={()=>void importExisting()}/>}
  </Stack>;
}
