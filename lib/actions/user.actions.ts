'use server'

import { revalidatePath } from 'next/cache';
import { FilterQuery, SortOrder } from 'mongoose';

import { connectToDB } from '@/lib/mongoose';
import User from '@/lib/models/user.model';

interface UpdateUserParams {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
};

interface FetchUsersParams {
  userId: string;
  searchString: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
};

export async function updateUser({ userId, username, name, bio, image, path }: UpdateUserParams): Promise<void> {
  connectToDB();

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
};

export async function fetchUsers({ userId, searchString = '', pageNumber = 1, pageSize = 20, sortBy = 'desc' }: FetchUsersParams) {
  connectToDB();

  try {
    const skipAmount = (pageNumber - 1) * pageSize;

    const regex = new RegExp(searchString, 'i');

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }
    }

    if (searchString.trim() !== '') {
      query.$or = [
        {
          username: { $regex: regex },
          name: { $regex: regex },
        }
      ]
    }

    const sortOptions = { createdAt: sortBy };

    const usersQuery = User
      .find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error: any) {
    throw new Error(`Error fetching users: ${error.message}`)
  }
};