import { z, ZodIssue } from 'zod'
import type {H3Error, H3Event } from "h3";

const userSchema = z.object({
  email: z.string({ description: 'Email required' }).email('Invalid email'),
  password: z.string({ description: 'Password required' })
      .min(8, 'Password should be at least 8 characters')
})

export default defineEventHandler(async (event) => {
  const u = await readValidatedBody(event, userSchema.safeParse)
  if (!u.success) {
    throw createError({ statusCode: 400, data: u.error.errors })
  }

  const { email, password } = u.data

  if(! await authService.passwordLogin(event, email, password)) {
    throw createError({ statusCode: 401, message: 'Invalid email or password' })
  }
})


type ReplyType = {event: H3Event, code?: number, message?: string, errors?: ZodIssue[]};
function reply({event, code = 200, message = '', errors = []} : ReplyType) {
  setResponseStatus(event, code)
  return { message, form: errors };
}
