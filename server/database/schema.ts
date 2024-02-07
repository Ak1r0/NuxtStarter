import { text, timestamp, bigint, boolean, jsonb, pgTable, varchar, unique, pgEnum } from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  id: varchar('id').primaryKey(),
  email: varchar('email').notNull().unique(),
  name: varchar('name').notNull(),
  hashedPassword: varchar('hashed_password').notNull(),
})

export type User = typeof user.$inferSelect

export const session = pgTable('user_session', {
  id: varchar('id').primaryKey(),
  userId: varchar('user_id').notNull().references(() => user.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date"
  }).notNull(),
})

export const product = pgTable('product', {
  id: varchar('id').primaryKey(),
  name: varchar('name').notNull(),
  code: varchar('code'),
  monthlyPrice: bigint('pricing_monthly', { mode: 'number' }).notNull(),
  stripeMonthlyPriceId: varchar('stripe_monthly_pricing_id').notNull(),
  yearlyPrice: bigint('pricing_yearly', { mode: 'number' }).notNull(),
  stripeYearlyPriceId: varchar('stripe_yearly_pricing_id').notNull(),
  features: jsonb('features').notNull(),
})

export type Product = typeof product.$inferSelect

export const stripeCustomer = pgTable('stripe_customer', {
  id: varchar('id').notNull().primaryKey(),
  email: varchar('email').notNull(),
  userId: varchar('user_id').notNull().references(() => user.id),
})

export const subscription = pgTable('stripe_subscription', {
  stripeSubscriptionId: varchar('stripe_subscription_id').notNull().primaryKey(),
  name: varchar('name').notNull(),
  code: varchar('code').notNull(),
  interval: varchar('interval').default('month').notNull(),
  stripeCustomerId: varchar('stripe_customer_id').notNull(),
  expires: bigint('expires', { mode: 'number' }).notNull(),
  userId: varchar('user_id').notNull().references(() => user.id),
})
