import { z } from 'zod'

const userSchema = z.object({
  name: z.string({ description: 'Enter your name' }).min(1, 'Enter your name'),
  email: z.string({ description: 'Email required' }).email('Invalid email'),
  password: z.string({ description: 'Password required' }).min(8, 'Password should be at least 8 characters')
      .regex(/[A-Z]/, 'Password should contain at least one uppercase letter' )
})

export default defineEventHandler(async (event) => {
  const u = await readValidatedBody(event, userSchema.safeParse)
  if (!u.success)
    return reply(event, false, 401)

  const { name, email, password } = u.data
  const user = await authService.createUser(name, email, password)

  if (!user) //todo
    return reply(event, false, 401, 'User already exists')

  await libService.create("My Library", user, true)

  const session = user ? await authService.createSession(user, event) : null
  return reply(event, !!session)
  // return reply(event, true)
})

function reply(event: any, success: boolean, code = 200, message = '') {
  setResponseStatus(event, code)
  return { success, message }
}
