import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { fetchUser } from '@/lib/actions/user.actions';
import { fetchCommunities } from '@/lib/actions/community.actions';
import CommunityCard from '@/components/cards/community-card';
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

  const result = await fetchCommunities({ searchString: searchParams.query, pageNumber: 1, pageSize: 25 })

  return (
    <section>
      <h1 className='head-text mb-10'>
        Search
      </h1>
      <SearchBar 
        route='communities'
      />
      <div className='mt-14 flex flex-col gap-9'>
        {result.communities.length === 0 ? (
          <p className='no-result'>No communities found</p>
        ): (
          <>
            {result.communities.map((community) => {
              return (
                <CommunityCard
                  key={community.id}
                  id={community.id}
                  name={community.name}
                  username={community.username}
                  imgUrl={community.image}
                  bio={community.bio}
                  members={community.members}
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