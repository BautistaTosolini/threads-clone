'use server'

import { connectToDB } from '@/lib/mongoose';
import Thread from '@/lib/models/thread.model';
import User from '@/lib/models/user.model';
import { revalidatePath } from 'next/cache';

interface CreateThreadParams {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createThread({ text, author, communityId, path }: CreateThreadParams) {
  try {
    connectToDB();
  
    const createdThread = await Thread.create({ text, author, community: null });
  
    //update user model
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id }
    })
  
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error at creating thread: ${error.message}`)
  }
  
};