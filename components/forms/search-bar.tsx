'use client'

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';

const SearchBar = ({ route }: { route: string }) => {
  const [searchString, setSearchString] = useState('');
  const router = useRouter();
  const debouncedValue = useDebounce<string>(searchString, 500);

  useEffect(() => {
    router.push(`/${route}?query=${debouncedValue}`)
  }, [debouncedValue])

  return (
    <div className='flex gap-4 bg-dark-3 rounded-md'>
      <Image 
        src='/assets/search-gray.svg'
        alt='Search'
        width={20}
        height={20}
        className='ml-4'
      />
      <Input 
        placeholder={route === 'search' ? 'Search for a user' : 'Search for a community'}
        className='bg-transparent border-none text-light-1 no-focus'
        value={searchString}
        onChange={(e) => setSearchString(e.target.value)}
      />
    </div>
  )
};

export default SearchBar;