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

const clients = [
  {
    id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    name: 'Delba de Oliveira',
    email: 'delba@oliveira.com',
    image_url: '/clients/delba-de-oliveira.png',
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a6442a',
    name: 'Lee Robinson',
    email: 'lee@robinson.com',
    image_url: '/clients/lee-robinson.png',
  },
  {
    id: '3958dc9e-737f-4377-85e9-fec4b6a6442a',
    name: 'Hector Simpson',
    email: 'hector@simpson.com',
    image_url: '/clients/hector-simpson.png',
  },
  {
    id: '50ca3e18-62cd-11ee-8c99-0242ac120002',
    name: 'Steven Tey',
    email: 'steven@tey.com',
    image_url: '/clients/steven-tey.png',
  },
  {
    id: '3958dc9e-787f-4377-85e9-fec4b6a6442a',
    name: 'Steph Dietz',
    email: 'steph@dietz.com',
    image_url: '/clients/steph-dietz.png',
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2f2',
    name: 'Michael Novotny',
    email: 'michael@novotny.com',
    image_url: '/clients/michael-novotny.png',
  },
  {
    id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
    name: 'Evil Rabbit',
    email: 'evil@rabbit.com',
    image_url: '/clients/evil-rabbit.png',
  },
  {
    id: '126eed9c-c90c-4ef6-a4a8-fcf7408d3c66',
    name: 'Emil Kowalski',
    email: 'emil@kowalski.com',
    image_url: '/clients/emil-kowalski.png',
  },
  {
    id: 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9',
    name: 'Amy Burns',
    email: 'amy@burns.com',
    image_url: '/clients/amy-burns.png',
  },
  {
    id: '13D07535-C59E-4157-A011-F8D2EF4E0CBB',
    name: 'Balazs Orban',
    email: 'balazs@orban.com',
    image_url: '/clients/balazs-orban.png',
  },
];

// TODO dedupe seed data
const invoices = [
  {
    client_id: clients[0].id,
    amount: 15795,
    status: 'pending',
    date: '2022-12-06',
  },
  {
    client_id: clients[1].id,
    amount: 20348,
    status: 'pending',
    date: '2022-11-14',
  },
  {
    client_id: clients[4].id,
    amount: 3040,
    status: 'paid',
    date: '2022-10-29',
  },
  {
    client_id: clients[3].id,
    amount: 44800,
    status: 'paid',
    date: '2023-09-10',
  },
  {
    client_id: clients[5].id,
    amount: 34577,
    status: 'pending',
    date: '2023-08-05',
  },
  {
    client_id: clients[7].id,
    amount: 54246,
    status: 'pending',
    date: '2023-07-16',
  },
  {
    client_id: clients[6].id,
    amount: 666,
    status: 'pending',
    date: '2023-06-27',
  },
  {
    client_id: clients[3].id,
    amount: 32545,
    status: 'paid',
    date: '2023-06-09',
  },
  {
    client_id: clients[4].id,
    amount: 1250,
    status: 'paid',
    date: '2023-06-17',
  },
  {
    client_id: clients[5].id,
    amount: 8546,
    status: 'paid',
    date: '2023-06-07',
  },
  {
    client_id: clients[1].id,
    amount: 500,
    status: 'paid',
    date: '2023-08-19',
  },
  {
    client_id: clients[5].id,
    amount: 8945,
    status: 'paid',
    date: '2023-06-03',
  },
  {
    client_id: clients[2].id,
    amount: 8945,
    status: 'paid',
    date: '2023-06-18',
  },
  {
    client_id: clients[0].id,
    amount: 8945,
    status: 'paid',
    date: '2023-10-04',
  },
  {
    client_id: clients[2].id,
    amount: 1000,
    status: 'paid',
    date: '2022-06-05',
  },
];

const revenue = [
  { month: 'Jan', revenue: 2000 },
  { month: 'Feb', revenue: 1800 },
  { month: 'Mar', revenue: 2200 },
  { month: 'Apr', revenue: 2500 },
  { month: 'May', revenue: 2300 },
  { month: 'Jun', revenue: 3200 },
  { month: 'Jul', revenue: 3500 },
  { month: 'Aug', revenue: 3700 },
  { month: 'Sep', revenue: 2500 },
  { month: 'Oct', revenue: 2800 },
  { month: 'Nov', revenue: 3000 },
  { month: 'Dec', revenue: 4800 },
];

async function seedUsers() {
    const users = [
      {
        id: '410544b2-4001-4271-9855-fec4b6a6442a',
        name: 'User',
        email: 'user@nextmail.com',
        password: '123456',
      },
    ];
  
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

async function seedAll() {
  await seedUsers();
  await seedClients();
  await seedInvoices();
  await seedRevenue();
}

seedAll();