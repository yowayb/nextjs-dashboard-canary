import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import {
  users as usersTable,
  invoices as invoicesTable,
  clients as clientsTable,
  revenue as revenueTable,
  NewInvoice,
  NewClient,
  NewRevenue,
} from '@/db/schema.js';
const db = drizzle(sql);
import bcrypt from 'bcrypt';

import {
  invoices,
  clients,
  revenue,
  users,
} from '../app/lib/placeholder-data.js';

async function seedUsers() {
    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return db.insert(usersTable).values({
          id: user.id,
          name: user.name,
          email: user.email,
          password: hashedPassword
        }).onConflictDoNothing()
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);
}

async function seedInvoices() {
  const insertedInvoices = await Promise.all(
    invoices.map(async (invoice) => {
      const newInvoice: NewInvoice = {
        client_id: invoice.client_id,
        amount: String(invoice.amount),
        status: invoice.status as 'pending' | 'paid',
        date: invoice.date
      };
      return db.insert(invoicesTable)
        .values(newInvoice)
        .onConflictDoNothing()
    }),
  );
  console.log(`Seeded ${insertedInvoices.length} invoices`);
}

async function seedClients() {
  const insertedclients = await Promise.all(
    clients.map(async (client) => {
      const newClient: NewClient = {
        id: client.id,
        name: client.name,
        email: client.email,
        image_url: client.image_url,
      };
      return db.insert(clientsTable)
        .values(newClient)
        .onConflictDoNothing()
    }),
  );
  console.log(`Seeded ${insertedclients.length} clients`);
}

async function seedRevenue() {
  const insertedRevenue = await Promise.all(
    revenue.map(async (revenue) => {
      const newRevenue: NewRevenue = {
        month: revenue.month,
        revenue: revenue.revenue,
      };
      return db.insert(revenueTable)
        .values(newRevenue)
        .onConflictDoNothing()
    }),
  );
  console.log(`Seeded ${insertedRevenue.length} revenue`);

}

async function main() {
  await seedUsers();
  await seedClients();
  await seedInvoices();
  await seedRevenue();
}

main();
