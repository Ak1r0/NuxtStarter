export default defineEventHandler(async (event) => {
  const user = authService.getAuthenticatedUser(event)
  if (!user)
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const { name, isPublic } = await readBody<{ name: string, isPublic: boolean }>(event)
  return await libService.create(name, user, isPublic)
})
