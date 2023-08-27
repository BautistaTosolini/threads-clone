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

interface AddCommentToThreadParams {
  threadId: string;
  commentText: string;
  userId: string;
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

export async function fetchThreads({ pageNumber = 1, pageSize = 20 }) {
  connectToDB();

  // Calculate number of posts to skip
  const skipAmount = (pageNumber - 1) * pageSize;

  // Fetch posts without parents
  const threadsQuery = Thread.find({
    parentId: {
      $in: [null, undefined]
    },
  })
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: 'author', 
      model: User,
    })
    .populate({
      path: 'children',
      populate: {
        path: 'author',
        model: User,
        select: '_id name parentId image',
      },
    })

    const totalThreadsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] } })

    const threads = await threadsQuery.exec();

    const isNext = totalThreadsCount > skipAmount + threads.length;

    return { threads, isNext };
}

export async function fetchThreadById(id: string) {
  connectToDB();

  try {
    const thread = await Thread.findById(id)
      .populate({
        path: 'author',
        model: User,
        select: '_id id name image'
      })
      .populate({
        path: 'children',
        populate: [
          {
            path: 'author',
            model: User,
            select: '_id name parentId image'
          },
          {
            path: 'children', 
            model: Thread,
            populate: {
              path: 'author',
              model: User,
              select: '_id id name parentId image'
            }
          }
        ]
      })
      .exec();

      return thread;
  } catch (error: any) {
    throw new Error(`Error fetching thread: ${error.message}`)
  }
}

export async function addCommentToThread({ threadId, commentText, userId, path }: AddCommentToThreadParams) {
  connectToDB();

  try {
    const originalThread = await Thread.findById(threadId);

    if (!originalThread) {
      throw new Error('Thread not found');
    }

    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    })

    const savedCommentThread = await commentThread.save();

    originalThread.children.push(savedCommentThread._id);

    await originalThread.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error adding comment to thread: ${error.message}`)
  }
}