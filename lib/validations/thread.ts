import * as z from 'zod';

export const ThreadValidation = z.object({
  thread: z.string().nonempty().max(280),
  accountId: z.string(),
})

export const CommentValidation = z.object({
  thread: z.string().nonempty().max(280),
})