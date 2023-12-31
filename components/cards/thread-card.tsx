import Image from 'next/image';
import Link from 'next/link';

import { formatDateString } from '@/lib/utils';
import DeleteThread from '@/components/shared/delete-thread';

interface ThreadCardProps {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    username: string;
    image: string;
    id: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
      _id: string;
    }
  }[]
  isComment?: boolean;
  isHome?: boolean;
};

const ThreadCard = ({ id, currentUserId, parentId, content, author, community, createdAt, comments, isComment, isHome }: ThreadCardProps) => {
  
  // creates an array of 2 Image elements with the condition of both being written by different authors o it doesn't repeat the authors image
  // only is shown in home page, not individual one
  let uniqueAuthors: JSX.Element[] | null = null;
  if (isHome) {
    uniqueAuthors = comments
    .slice(0, comments.length >= 2 ? 2 : comments.length)
    .reduce((result: JSX.Element[], comment, index, arr) => {
      if (index === 0 || comment.author._id !== arr[index - 1].author._id) {
        result.push(
          <Image
            key={index}
            src={comment.author.image}
            alt='User'
            width={24}
            height={24}
            className={`${index !== 0 && '-ml-5'} rounded-full object-cover`}
          />
        )
      }
      return result;
    }, []);
  }

  return (
    <article className={`flex w-full flex-col rounded-sm ${isComment ? 'px-0 xs:px-7' : 'bg-dark-2 p-7'}`}>
      <div className='flex items-start justify-between'>
        <div className='flex w-full flex-1 flex-row gap-4'>
          <div className='flex flex-col items-center'>
            <Link href={`/profile/${author.id}`} className='relative h-11 w-11'>
              <Image 
                src={author.image}
                alt='Profile'
                fill
                className='cursor-pointer rounded-full'
              />
            </Link>

            <div className='thread-card_bar' />
          </div>

          <div className='flex w-full flex-col'>
            <Link href={`/profile/${author.id}`} className='w-fit'>
              <div className='flex gap-2 items-center'>
                <h4 className='cursor-pointer text-base-semibold text-light-1'>
                  {author.name}
                </h4>
                <p className='text-small-regular text-gray-1'>
                  @{author.username}
                </p>
                <span className='text-small-regular text-gray-1'>
                  -
                </span>
                <p className='text-small-regular text-gray-1'>
                  {formatDateString(createdAt)}
                </p>
              </div>
            </Link>

            <p className='mt-2 text-small-regular text-light-2'>
              {content}
            </p>

            <div className={`${isComment && 'mb-10'} mt-5 flex flex-col gap-3`}>
              <div className='flex gap-3.5'>
                <Image 
                  src='/assets/heart-gray.svg'
                  alt='heart'
                  width={24}
                  height={24}
                  className='cursor-pointer object-contain'
                />
                <Link href={`/thread/${id}`}>
                  <Image 
                    src='/assets/reply.svg'
                    alt='heart'
                    width={24}
                    height={24}
                    className='cursor-pointer object-contain'
                  />
                </Link>
                <Image 
                  src='/assets/repost.svg'
                  alt='heart'
                  width={24}
                  height={24}
                  className='cursor-pointer object-contain'
                />
                <Image 
                  src='/assets/share.svg'
                  alt='heart'
                  width={24}
                  height={24}
                  className='cursor-pointer object-contain'
                />
              </div>

              {isComment && comments.length > 0 && (
                <Link href={`/thread/${id}`}>
                  <p className='mt-1 text-subtle-medium text-gray-1'>
                    {comments.length} repl{comments.length > 1 ? 'ies' : 'y'}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>

        <DeleteThread
          threadId={JSON.stringify(id)}
          currentUserId={currentUserId}
          authorId={author.id}
          parentId={parentId}
          isComment={isComment}
        />

      </div>

      {/* Replies for main thread with the icon of authors of 2 first replies */}
      {!isComment && comments.length > 0 && isHome && (
        <Link href={`/thread/${id}`}>
          <div className='ml-1 mt-3 flex items-center gap-2'>
            {uniqueAuthors}    
            <p className='mt-1 text-subtle-medium text-gray-1'>
              {comments.length} repl{comments.length > 1 ? 'ies' : 'y'}
            </p>
          </div>
        </Link>
      )}

      {!isComment && community && isHome && (
        <Link
          href={`/communities/${community.id}`}
          className='mt-5 flex items-center'
        >
          <p className='text-subtle-medium text-gray-1'>
            Created at {community.name} Community
          </p>

          <Image 
            src={community.image}
            alt={community.name}
            width={15}
            height={14}
            className='ml-1 rounded-full object-contain'
          />
        </Link>
      )}
    </article>
  )
};

export default ThreadCard;