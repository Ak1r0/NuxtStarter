import { z } from 'zod'

const userSchema = z.object({
  email: z.string({ description: 'Email required' }).email('Invalid email'),
  password: z.string({ description: 'Password required' })
      .min(8, 'Password should be at least 8 characters')
})

export default defineEventHandler(async (event) => {
  const u = await readValidatedBody(event, userSchema.safeParse);
  if (!u.success) {
    throw createError({ statusCode: 400, data: u.error.errors })
  }

  const { email, password } = u.data;

  const login = await authService.passwordLogin(event, email, password);
  if(! login) {
    throw createError({ statusCode: 401, message: 'Invalid email or password' })
  }
})
