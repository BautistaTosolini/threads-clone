'use server'

import { connectToDB } from '@/lib/mongoose';
import User from '@/lib/models/user.model';
import { revalidatePath } from 'next/cache';

interface UpdateUserParams {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
};

export async function updateUser({ userId, username, name, bio, image, path }: UpdateUserParams): Promise<void> {
  connectToDB();

  console.log({
    userId,
    username,
    name,
    bio,
    image,
    path
  })

  try {
    await User.findOneAndUpdate({
      id: userId
    }, {
      username: username.toLowerCase(),
      name,
      bio,
      image,
      onboarded: true,
    }, {
      upsert: true,
    });
  
    if (path === '/profile/edit') {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
};

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    return await User
      .findOne({ id: userId })
      // .populate({ path: 'communities', model: Community });
  } catch (error) {
    throw new Error('Failed to fetch user');
  }
}