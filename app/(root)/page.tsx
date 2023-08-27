import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs';

import { fetchThreads } from '@/lib/actions/thread.actions';
import ThreadCard from '@/components/cards/thread-card';
 
export default async function Home() {
  const result = await fetchThreads({ pageNumber: 1, pageSize: 30 });
  const user = await currentUser();

  return (
    <>
      <h1 className='head-text text-left'>Home</h1>

      <section className='mt-9 flex flex-col gap-10'>
        {result.threads.length === 0 ? (
          <p className='no-result'>No threads found</p>
        ): (
          <>
            {result.threads.map((thread) => {
              return (
                <ThreadCard 
                  key={thread._id}
                  id={thread._id}
                  currentUserId={user?.id || ''}
                  parentId={thread.parentId}
                  content={thread.text}
                  author={thread.author}
                  community={thread.community}
                  createdAt={thread.createdAt}
                  comments={thread.children}
                />
              )
            })}
          </>
        )}
      </section>
    </>
  )
}