import { z } from 'zod';

export const userAuthSchema = z.object({
    email: z.email().nonempty(),
    password: z.string().min(6, 'Password must be at least 6 characters')
})

export type AuthInput = z.infer<typeof userAuthSchema>