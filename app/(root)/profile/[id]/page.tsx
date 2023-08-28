import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import Image from 'next/image';

import { fetchUser } from '@/lib/actions/user.actions';
import ProfileHeader from '@/components/shared/profile-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { profileTabs } from "@/constants";
import ThreadsTab from '@/components/shared/threads-tab';

const Page = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const userInfo = await fetchUser(params.id);

  if (!userInfo?.onboarded) {
    redirect('/onboarding');
  }

  return (
    <section>
      <ProfileHeader 
        accountId={userInfo._id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
      />
      <div className='mt-9'>
        <Tabs defaultValue='threads' className='w-full'>
          <TabsList className='tab'>
            {profileTabs.map((tab) => {
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
                      {userInfo?.threads.length}
                    </p>
                  )}
                </TabsTrigger>
              )
            })}
          </TabsList>
          {profileTabs.map((tab) => {
            return (
              <TabsContent 
                className={`content-${tab.label}`}
                value={tab.value}
              >
                <ThreadsTab
                  currentUserId={user.id}
                  accountId={userInfo.id}
                  accountType='User'
                />
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </section>
  )
};

export default Page;