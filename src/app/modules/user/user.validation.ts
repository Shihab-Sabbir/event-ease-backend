import { z } from 'zod';

export const userZodSchema = z.object({
  body: z.object({
    user: z.object({
      email: z.string({
        required_error: 'Email is required !',
      }),
      password: z.string({
        required_error: 'Password is required !',
      }),
    }),
  }),
});
