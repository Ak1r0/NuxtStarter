export default defineEventHandler(async (event) => {
  return authService.getAuthenticatedUser(event)

})
