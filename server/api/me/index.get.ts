export default defineEventHandler(async (event) => {
  const user = authService.getAuthenticatedUser(event);

  if(!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' });
  }

  return { user };
})
