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
} from '@/drizzle/schema.js';
const db = drizzle(sql);
import bcrypt from 'bcrypt';

import {
  invoices,
  clients,
  revenue,
  users,
} from '../app/lib/placeholder-data.js';

async function seedUsers() {
  try {
    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return db.insert(usersTable).values({
          id: user.id,
          name: user.name,
          email: user.email,
          password: hashedPassword
        })
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      users: insertedUsers,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(Object.entries(error));
    }
    throw error;
  }
}

async function seedInvoices() {
  try {
    // Insert data into the "invoices" table
    const insertedInvoices = await Promise.all(
      invoices.map(async (invoice) => {
        const newInvoice: NewInvoice = {
          client_id: invoice.client_id,
          amount: String(invoice.amount),
          status: invoice.status as 'pending' | 'paid',
          date: invoice.date
        };
        return db.insert(invoicesTable).values(newInvoice)
      }),
    );

    console.log(`Seeded ${insertedInvoices.length} invoices`);

    return {
      invoices: insertedInvoices,
    };
  } catch (error) {
    console.error('Error seeding invoices:', error);
    throw error;
  }
}

async function seedClients() {
  try {
    // Insert data into the "clients" table
    const insertedclients = await Promise.all(
      clients.map(async (client) => {
        const newClient: NewClient = {
          id: client.id,
          name: client.name,
          email: client.email,
          image_url: client.image_url,
        };
        return db.insert(clientsTable).values(newClient)
      }),
    );

    console.log(`Seeded ${insertedclients.length} clients`);

    return {
      clients: insertedclients,
    };
  } catch (error) {
    console.error('Error seeding clients:', error);
    throw error;
  }
}

async function seedRevenue() {
  try {
    // Insert data into the "revenue" table
    const insertedRevenue = await Promise.all(
      revenue.map(async (revenue) => {
        const newRevenue: NewRevenue = {
          month: revenue.month,
          revenue: revenue.revenue,
        };
        return db.insert(revenueTable).values(newRevenue)
      }),
    );

    console.log(`Seeded ${insertedRevenue.length} revenue`);

    return {
      revenue: insertedRevenue,
    };
  } catch (error) {
    console.error('Error seeding revenue:', error);
    throw error;
  }
}

async function main() {
  await seedUsers();
  await seedClients();
  await seedInvoices();
  await seedRevenue();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
