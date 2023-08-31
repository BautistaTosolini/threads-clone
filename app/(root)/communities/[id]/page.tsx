import { currentUser } from '@clerk/nextjs';
import Image from 'next/image';

import ProfileHeader from '@/components/shared/profile-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { communityTabs } from "@/constants";
import ThreadsTab from '@/components/shared/threads-tab';
import { fetchCommunityDetails } from '@/lib/actions/community.actions';
import UserCard from '@/components/cards/user-card';

const Page = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const communityDetails = await fetchCommunityDetails(params.id);

  return (
    <section>
      <ProfileHeader 
        accountId={communityDetails._id}
        authUserId={user.id}
        name={communityDetails.name}
        username={communityDetails.username}
        imgUrl={communityDetails.image}
        bio={communityDetails.bio}
        type='Community'
      />
      <div className='mt-9'>
        <Tabs defaultValue='threads' className='w-full'>
          <TabsList className='tab'>
            {communityTabs.map((tab) => {
              return (
                <TabsTrigger 
                  key={`${tab.label}-${tab.value}`} 
                  value={tab.value} 
                  className='tab'
                >
                  <Image 
                    key={tab.label}
                    src={tab.icon}
                    alt={tab.label}
                    width={24}
                    height={24}
                    className='object-contain'
                  />
                  <p className='max-sm:hidden'>
                    {tab.label}
                  </p>

                  {tab.label === 'Threads' && (
                    <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                      {communityDetails?.threads.length}
                    </p>
                  )}
                </TabsTrigger>
              )
            })}
          </TabsList>
            <TabsContent 
              className='w-full text-light-1'
              value='threads'
            >
              <ThreadsTab
                currentUserId={user.id}
                accountId={communityDetails.id}
                accountType='Community'
              />
            </TabsContent>
            <TabsContent 
              className='w-full text-light-1'
              value='members'
            >
              <section className='mt-9 flex flex-col gap-10'>
                {communityDetails?.members.map((member: any) => {
                  return (
                    <UserCard 
                      key={member.id}
                      id={member.id}
                      name={member.name}
                      username={member.name}
                      imgUrl={member.image}
                      userType='User'
                    />
                  )
                })}
              </section>
            </TabsContent>
            <TabsContent 
              className='w-full text-light-1'
              value='requests'
            >
              Request
            </TabsContent>
        </Tabs>
      </div>
    </section>
  )
};

export default Page;