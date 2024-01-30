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

export const library = pgTable('library', {
  id: varchar('id').primaryKey(),
  name: varchar('name').notNull(),
  slug: varchar('slug').notNull(),
  isPublic: boolean('is_public').default(true).notNull(),
  createdAt: timestamp('created_at', { mode: "date" }).notNull().defaultNow(),
  userId: varchar('user_id').notNull().references(() => user.id),
})
export type Library = typeof library.$inferSelect

export const statusEnum = pgEnum('status', ['broken', 'active', 'checking', 'deleted']);

export const link = pgTable('link', {
  id: varchar('id').primaryKey(),
  title: varchar('name'),
  url: varchar('url').notNull(),
  description: text('description'),
  status: statusEnum('status').default('checking').notNull(),
  createdAt: timestamp('created_at', { mode: "date" }).notNull().defaultNow(),
  lastCheckAt: timestamp('last_check_at', { mode: "date" }).notNull().defaultNow(),
  hash: varchar('hash').notNull().unique(),
  userId: varchar('user_id').notNull().references(() => user.id),
  libraryId: varchar('library_id').notNull().references(() => library.id),
}, (t) => ({
  unq: unique().on(t.userId, t.url),
}))
export type Link = typeof link.$inferSelect