export default defineEventHandler(async (event) => {
  console.log(event)
  const user = authService.getAuthenticatedUser(event)
  console.log('aaaaa');
  console.log(user);
  const { context: { params } } = event
  console.log(params?.slug);
  if (!user || !params?.slug)
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  console.log('bbbbb');
  const lib = await libService.getLib(user, params.slug)
  if (!lib)
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  console.log('ccc');
  const links = await libService.getLinks(lib)
console.log('llldldlalal');
console.log(links);
console.log('llldldlalal');
  return links
})
