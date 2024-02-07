export default defineEventHandler(async (event) => {
  const user = authService.getAuthenticatedUser(event);

  if(!user) {
    return null;
  }

  return { user };
})
