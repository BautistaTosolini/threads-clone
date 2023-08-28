import { redirect } from "next/navigation";

import { fetchUserThreads } from "@/lib/actions/thread.actions";
import ThreadCard from "../cards/thread-card";

interface ThreadsTabProps {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const ThreadsTab = async ({ currentUserId, accountId, accountType }: ThreadsTabProps) => {
  const result = await fetchUserThreads(accountId);

  if (!result) {
    redirect('/')
  }

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
              ? { name: result.name, image: result.image, _id: result.id } 
              : { name: thread.author.name, image: thread.author.image, _id: thread.author.id }
            }
            community={thread.community}
            createdAt={thread.createdAt}
            comments={thread.children}
          />
        )
      })}
    </section>
  )
};

export default ThreadsTab;