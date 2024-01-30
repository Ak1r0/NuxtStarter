import {and, eq, gte} from 'drizzle-orm'
import type {Product, User} from '../database/schema'
import type Stripe from "stripe";

class UserService {
  async getById(id: string) {
    const [user] = await db.select().from(tables.user).where(eq(tables.user.id, id))
    return user
  }

  async getByEmail(email: string) {
    const [user] = await db.select().from(tables.user).where(eq(tables.user.email, email))
    return user
  }

  async getLinks(user: User) {
    return db.select().from(tables.link)
        .where(eq(tables.link.userId, user.id));
  }

  async getLibs(user: User) {
    return db.select().from(tables.library)
        .where(eq(tables.library.userId, user.id));
  }

  async saveSubscription(user: User, stripeSubscription: Stripe.Subscription, product: Product) {
    const code = product.code
    const name = product.name

    if(!code || !name) throw new Error('Missing product code or name');

    const interval = stripeSubscription.items.data[0].plan.interval as string
    const stripeCustomerId = stripeSubscription.customer as string
    const stripeSubscriptionId = stripeSubscription.id
    const expires = stripeSubscription.current_period_end * 1000
    const userId = user.id

    const [subscription] = await db.insert(tables.subscription)
        .values({ code, name, stripeCustomerId, stripeSubscriptionId, interval, expires, userId  })
        .onConflictDoUpdate({ target: tables.subscription.stripeSubscriptionId, set: { code, name, stripeSubscriptionId, interval, expires } }).returning()

    return subscription
  }

  async getSubscription(user: User) {
    const [subscription] = await db.select().from(tables.subscription).where(and(eq(tables.subscription.userId, user.id), gte(tables.subscription.expires, Date.now())))
    return subscription
  }
}

export const userService = new UserService()
