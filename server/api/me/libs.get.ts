import { userService } from '~/server/utils/user'

export default defineEventHandler(async (event) => {
  const user = authService.getAuthenticatedUser(event)
  if (!user)
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  const libs = await userService.getLibs(user)

  return { libs }
})
