'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CommentValidation } from '@/lib/validations/thread';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addCommentToThread } from '@/lib/actions/thread.actions';

interface CommentProps {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
};

const Comment = ({ threadId, currentUserImg, currentUserId }: CommentProps) => {
  const router = useRouter();
  const pathname = usePathname();
  
  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: '',
    }
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToThread({ threadId: threadId, commentText: values.thread, userId: JSON.parse(currentUserId), path: pathname });

    form.reset();

    router.push('/');
  }

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)}
        className='comment-form'
      >

         <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className='flex w-full gap-3 items-center'>
              <FormLabel className='relative h-11 w-12'>
                <Image 
                  src={currentUserImg}
                  alt='Profile'
                  fill
                  className='rounded-full'
                />
              </FormLabel>
              <FormControl className='border-none bg-transparent'>
                <Input
                  type='text'
                  placeholder='Comment...'
                  className='no-focus text-light-1 outline-none'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type='submit'
          className='comment-form_btn'
        >
          Reply
        </Button>
      </form>
    </Form>
  )
};

export default Comment;