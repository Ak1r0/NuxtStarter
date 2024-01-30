import type { User } from '~/server/database/schema'
import { eq } from 'drizzle-orm'
import Stripe from 'stripe'
import {userService} from "~/server/utils/user";

const config = useRuntimeConfig()

const stripe = new Stripe(config.stripe.secretKey)

class StripeService {
  async getPrices() {
    const { data } = await stripe.prices.list({ expand: ['data.product'] })
    return data
  }

  async getProduct(productId: string) {
    const [product] = await db.select().from(tables.product).where(eq(tables.product.id, productId))
    return product
  }

  async updateProducts() {
    const prices = await this.getPrices()
    const products = this.pricesToProducts(prices)
    await db.delete(tables.product)
    await db.insert(tables.product).values(products)
  }

  pricesToProducts(prices: Stripe.Price[]) {
    const stripeProducts = prices.filter((price, index) => {
      const productId = (price.product as Stripe.Product).id
      const firstOcurrence = prices.findIndex(p => productId === (p.product as Stripe.Product).id)
      return firstOcurrence === index
    }).map(p => p.product as Stripe.Product)

    const products = stripeProducts.map((product) => {
      const monthlyPrice = prices.find(p => p.active && p.recurring?.interval === 'month' && product.id === (p.product as Stripe.Product).id)
      const yearlyPrice = prices.find(p => p.active && p.recurring?.interval === 'year' && product.id === (p.product as Stripe.Product).id)

      return {
        id: product.id,
        name: product.name,
        code: product.metadata.code,
        monthlyPrice: monthlyPrice?.unit_amount ?? 0,
        stripeMonthlyPriceId: monthlyPrice?.id ?? '',
        yearlyPrice: yearlyPrice?.unit_amount ?? 0,
        stripeYearlyPriceId: yearlyPrice?.id ?? '',
        features: product.features.map(f => f.name),
      }
    }).sort((a, b) => a.monthlyPrice - b.monthlyPrice)

    return products
  }

  async createCustomer(user: User) {
    const customer = await stripe.customers.create({ name: user.name, email: user.email })
    await db.insert(tables.stripeCustomer).values({ id: customer.id, userId: user.id, email: user.email })
    return customer
  }

  async getCustomer(user: User) {
    const [customer] = await db.select().from(tables.stripeCustomer).where(eq(tables.stripeCustomer.userId, user.id))
    return customer ?? this.createCustomer(user)
  }

  async getUserForCustomerId(customerId: string) {
    const [userCustomer] = await db.select().from(tables.user).leftJoin(tables.stripeCustomer, eq(tables.user.id, tables.stripeCustomer.userId)).where(eq(tables.stripeCustomer.id, customerId))
    return userCustomer?.auth_user
  }

  async createCheckoutSession(priceId: string, customerId?: string) {
    return stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer: customerId,
      mode: 'subscription',
      success_url: `${config.public.url}/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.public.url}/`,
    })
  }

  async createPortalSession(stripeCustomerId: string) {
    return stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${config.public.url}/app/billing`,
    })
  }

  async validatePayment(session_id: string) {
    const session = await stripe.checkout.sessions.retrieve(session_id, { expand: ['subscription', 'subscription.plan.product'] })
    if (!session.status || session.status !== 'complete' || !session.customer)
      return
    const stripeCustomerId = session.customer as string
    let user = await this.getUserForCustomerId(stripeCustomerId)
    const stripeSubscription = session.subscription as Stripe.Subscription
    const productId = stripeSubscription.items.data[0].price.product as string
    const [product] = await db.select().from(tables.product).where(eq(tables.product.id, productId))
    await userService.saveSubscription(user, stripeSubscription, product)
    return session
  }

  getStripeEvent(rawBody: string, stripeSignature: string) {
    return stripe.webhooks.constructEvent(rawBody, stripeSignature, config.stripe.webhookSecret)
  }
}

export const stripeService = new StripeService()
