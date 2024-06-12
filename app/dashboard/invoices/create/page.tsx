import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
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
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Form clients={clients} />
    </main>
  );
}