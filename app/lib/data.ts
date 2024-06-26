import { unstable_noStore } from 'next/cache';
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import {
  ClientField,
  ClientsTableType,
  InvoiceForm,
  InvoicesTable,
  User,
} from './definitions';
import { formatCurrency } from './utils';
import * as schema from '@/db/schema';
import { count, desc, eq } from 'drizzle-orm';
const db = drizzle(sql, { schema });

export async function fetchRevenue() {
  unstable_noStore();
  return await db.query.revenue.findMany();
}

export async function fetchLatestInvoices() {
  unstable_noStore();
  const data = await db.query.invoices.findMany({
    with: { client: true },
    orderBy: [desc(schema.invoices.date)],
    limit: 5
  });
  const latestInvoices = data.map((invoice) => ({
    ...invoice,
    amount: formatCurrency(Number(invoice.amount)),
  }));
  return latestInvoices;
}

export async function fetchCardData() {
  unstable_noStore();
  const invoiceCount = await db.select({ count: count() }).from(schema.invoices);
  const clientCount = await db.select({ count: count() }).from(schema.clients);
  const invoiceStatus = await sql`SELECT
    SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
    SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
    FROM invoices`;

  const numberOfInvoices = Number(invoiceCount[0].count ?? '0');
  const numberOfClients = Number(clientCount[0].count ?? '0');
  const totalPaidInvoices = formatCurrency(invoiceStatus.rows[0].paid ?? '0');
  const totalPendingInvoices = formatCurrency(invoiceStatus.rows[0].pending ?? '0');

  return {
    numberOfClients,
    numberOfInvoices,
    totalPaidInvoices,
    totalPendingInvoices,
  };
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  unstable_noStore();

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        clients.name,
        clients.email,
        clients.image_url
      FROM invoices
      JOIN clients ON invoices.client_id = clients.id
      WHERE
        clients.name ILIKE ${`%${query}%`} OR
        clients.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `; // TODO OR invoices.status ILIKE ${`%${query}%`}

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  unstable_noStore();

  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN clients ON invoices.client_id = clients.id
    WHERE
      clients.name ILIKE ${`%${query}%`} OR
      clients.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`}
  `; // TODO OR invoices.status::invoice_status ILIKE ${`%${query}%`}

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  unstable_noStore();

  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.client_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchClients() {
  unstable_noStore();

  try {
    const data = await sql<ClientField>`
      SELECT
        id,
        name
      FROM clients
      ORDER BY name ASC
    `;

    const clients = data.rows;
    return clients;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all clients.');
  }
}

export async function fetchFilteredClients(query: string) {
  unstable_noStore();

  try {
    const data = await sql<ClientsTableType>`
		SELECT
		  clients.id,
		  clients.name,
		  clients.email,
		  clients.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM clients
		LEFT JOIN invoices ON clients.id = invoices.client_id
		WHERE
		  clients.name ILIKE ${`%${query}%`} OR
        clients.email ILIKE ${`%${query}%`}
		GROUP BY clients.id, clients.name, clients.email, clients.image_url
		ORDER BY clients.name ASC
	  `;

    const clients = data.rows.map((client) => ({
      ...client,
      total_pending: formatCurrency(client.total_pending),
      total_paid: formatCurrency(client.total_paid),
    }));

    return clients;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch client table.');
  }
}

export async function fetchSites(client_id: string) {
  unstable_noStore();
  return await db.query.sites.findMany({
    where: eq(schema.sites.client_id, client_id)
  });
}

export async function getUser(email: string) {
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
