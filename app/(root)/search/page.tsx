

import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { useState } from 'react';

import { fetchUser, fetchUsers } from '@/lib/actions/user.actions';
import UserCard from '@/components/cards/user-card';
import SearchBar from '@/components/forms/search-bar';

const Page = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) {
    redirect('/onboarding');
  }

  const result = await fetchUsers({ userId: user.id, searchString: searchParams.query, pageNumber: 1, pageSize: 25 })

  return (
    <section>
      <h1 className='head-text mb-10'>
        Search
      </h1>
      <SearchBar 
        route='search'
      />
      <div className='mt-14 flex flex-col gap-9'>
        {result.users.length === 0 ? (
          <p className='no-result'>No users found</p>
        ): (
          <>
            {result.users.map((user) => {
              return (
                <UserCard
                  key={user.id}
                  id={user.id}
                  name={user.name}
                  username={user.username}
                  imgUrl={user.image}
                  userType='User'
                />
              )
            })}
          </>
        )}
      </div>
    </section>
  )
};

export default Page;