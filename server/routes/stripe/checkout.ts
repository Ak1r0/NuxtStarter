import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { plan, period, slug } = getQuery(event)
  if (!plan || !period)
    return sendRedirect(event, '/', 302)

  const [product] = await db.select().from(tables.product).where(eq(tables.product.code, plan as string))
  if (!product)
    return sendRedirect(event, '/', 302)
  const pricingId = period === 'year' ? product.stripeYearlyPriceId : product.stripeMonthlyPriceId

  const user = authService.getAuthenticatedUser(event)

  if (!user) { // we still want to allow buying a subscription before signup.
    const stripeSession = await stripeService.createCheckoutSession(pricingId)
    return sendRedirect(event, stripeSession.url ?? '/', 302)
  }

  // if the org already has a subscription, send to billing portal
  const subscription = await userService.getSubscription(user)
  if (subscription) {
    const portalSession = await stripeService.createPortalSession(subscription.stripeCustomerId)
    return sendRedirect(event, portalSession.url ?? '/', 302)
  }

  const customer = await stripeService.getCustomer(user)

  const stripeSession = await stripeService.createCheckoutSession(pricingId, customer.id)
  return sendRedirect(event, stripeSession.url ?? '/', 302)
})
