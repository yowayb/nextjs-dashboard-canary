import Form from './edit-form';
import Breadcrumbs from '../../breadcrumbs';
import { fetchClients, fetchInvoiceById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Invoice',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [invoice, clients] = await Promise.all([
    fetchInvoiceById(id),
    fetchClients(),
  ]);

  if (!invoice) {
    console.log('not found!')
    notFound();
  }
  
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/clients/invoices' },
          {
            label: 'Edit Invoice',
            href: `/clients/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} clients={clients} />
    </main>
  );
}