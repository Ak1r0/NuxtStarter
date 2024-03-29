export default defineEventHandler(async (event) => {
  const user = authService.getAuthenticatedUser(event)
  if (!user)
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const customer = await stripeService.getCustomer(user)
  const portalSession = await stripeService.createPortalSession(customer.id)
  return sendRedirect(event, portalSession.url ?? '/', 302)
})
