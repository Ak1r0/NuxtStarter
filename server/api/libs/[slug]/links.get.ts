export default defineEventHandler(async (event) => {
  const user = authService.getAuthenticatedUser(event)
  const { context: { params } } = event

  if (!user || !params?.slug)
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const lib = await libService.getLib(user, params.slug)
  if (!lib)
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const links = await libService.getLinks(lib)

  return links
})
