import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { integer, numeric, pgEnum, pgTable, text, timestamp,
  uniqueIndex, uuid, varchar, } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
 
export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    password: text('password').notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
  },
  (users) => {
    return {
      uniqueUserIdx: uniqueIndex('unique_user_idx').on(users.email),
    };
  },
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const clients = pgTable('clients',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    image_url: text('image_url'),
  },
  (clients) => {
    return {
      uniqueClientIdx: uniqueIndex('unique_client_idx').on(clients.email),
    }
  }
)
export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;

export const clientsRelations = relations(clients, ({ many }) => ({
  invoices: many(invoices),
  sites: many(sites),
}));

export const sites = pgTable('sites',
  {
    url: varchar('url').primaryKey(),
    client_id: uuid('client_id').notNull(),
  }
)
export type Site = typeof clients.$inferSelect;
export type NewSite = typeof clients.$inferInsert;

export const InsertSiteSchema = createInsertSchema(sites, {
  url: z.string().url(),
});

export const sitesRelations = relations(sites, ({ one }) => ({
  client_id: one(clients),
}));

export const invoiceStatusEnum = pgEnum('invoice_status', ['pending', 'paid']);

export const invoices = pgTable(
  'invoices',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    client_id: uuid('client_id').notNull(),
    amount: numeric('amount', { precision: 15, scale: 2 }).notNull(),
    date: text('date').notNull(),
    status: invoiceStatusEnum('status').notNull(),
  },
)
export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;

export const invoicesRelations = relations(invoices, ({ one }) => ({
  client: one(clients, {
    fields: [invoices.client_id],
    references: [clients.id],
  }),
}));

export const revenue = pgTable('revenue',
  {
    month: varchar('month', { length: 4 }).notNull(),
    revenue: integer('revenue').notNull(),
  },
  (revenue) => {
    return {
      uniqueRevenueMonthIdx: uniqueIndex('unique_revenue_month_idx').on(revenue.month),
    }
  }
)
export type Revenue = typeof revenue.$inferSelect;
export type NewRevenue = typeof revenue.$inferInsert;
