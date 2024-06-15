import Form from '../components/invoices/create-form';
import Breadcrumbs from '../components/invoices/breadcrumbs';
import { fetchClients } from '@/app/lib/data';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Create Invoice',
};
export default async function Page() {
  const clients = await fetchClients();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/clients/invoices' },
          {
            label: 'Create Invoice',
            href: '/clients/invoices/create',
            active: true,
          },
        ]}
      />
      <Form clients={clients} />
    </main>
  );
}