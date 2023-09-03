import { redirect } from "next/navigation";

import { fetchUserThreads } from "@/lib/actions/thread.actions";
import ThreadCard from "@/components/cards/thread-card";
import { fetchCommunityThreads } from "@/lib/actions/community.actions";

interface ThreadsTabProps {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const ThreadsTab = async ({ currentUserId, accountId, accountType }: ThreadsTabProps) => {
  let result: any;

  if (accountType === 'Community') {
    result = await fetchCommunityThreads(accountId);
  } else {
    result = await fetchUserThreads(accountId);
  }

  if (!result) {
    redirect('/')
  }

  result.threads.sort((a: any, b: any) => b.createdAt - a.createdAt);

  console.log(result)

  return (
    <section className='mt-9 flex flex-col gap-10'>
      {result.threads.map((thread: any) => {
        return (
          <ThreadCard
            key={thread._id}
            id={thread._id}
            currentUserId={currentUserId}
            parentId={thread.parentId}
            content={thread.text}
            author={
              accountType === 'User' 
              ? { name: result.name, image: result.image, id: result.id, username: result.username } 
              : { name: thread.author.name, image: thread.author.image, id: thread.author.id, username: thread.author.username }
            }
            community={thread.community}
            createdAt={thread.createdAt}
            comments={thread.children}
            isHome={false}
          />
        )
      })}
    </section>
  )
};

export default ThreadsTab;