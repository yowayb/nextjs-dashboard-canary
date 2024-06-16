'use server';
 
import { signIn } from '@/auth';
import { InsertSiteSchema } from '@/db/schema';
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import * as schema from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { url } from 'inspector';
const db = drizzle(sql, { schema });

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

const FormSchema = z.object({
  id: z.string(),
  clientId: z.string({
    invalid_type_error: 'Please select a client.',
  }),
  amount: z.coerce.number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

// This is temporary until @types/react-dom is updated
export type State = {
  errors?: {
    clientId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  const rawFormData = Object.fromEntries(formData);
  const validatedFields = CreateInvoice.safeParse(rawFormData);
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
  const { clientId, amount, status } = validatedFields.data;

  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
  try {
    await sql`
      INSERT INTO invoices (client_id, amount, status, date)
      VALUES (${clientId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }
  revalidatePath('/clients/invoices');
  redirect('/clients/invoices');
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    clientId: formData.get('clientId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }
 
  const { clientId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
 
  try {
    await sql`
      UPDATE invoices
      SET client_id = ${clientId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }
 
  revalidatePath('/clients/invoices');
  redirect('/clients/invoices');
}

export async function deleteInvoice(id: string) {
    throw new Error('Failed to Delete Invoice');

    try {
      await sql`DELETE FROM invoices WHERE id = ${id}`;
      revalidatePath('/clients/invoices');
      return { message: 'Deleted Invoice.' };
    } catch (error) {
      return { message: 'Database Error: Failed to Delete Invoice.' };
    }
}

// This is temporary until @types/react-dom is updated
export type AddSiteState = {
  errors?: {
    url?: string[];
  };
  message?: string | null;
};

export async function addSite(client_id: string, prevState: AddSiteState, formData: FormData) {
  const rawFormData = {
    client_id: client_id,
    url: formData.get('url'),
  };
  const validatedFields = InsertSiteSchema.safeParse(rawFormData);
  if (!validatedFields.success) {
    return {
      url: rawFormData.url?.toString(),
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to add site because of field errors.',
    };
  }

  try {
    await db.insert(schema.sites).values(validatedFields.data);
  } catch (error: any) {
    // https://github.com/drizzle-team/drizzle-orm/issues/376
    if (error.code === '23505') {
      return {
        url: '',
        errors: {
          url: [`Site ${rawFormData.url} already exists.`],
        }
      };
    } else {
      console.log(error)
    }
  }

  revalidatePath(`/clients/${client_id}/sites`);
  return {
    message: `Site "${rawFormData.url}" added.`
  };
}

export async function deleteSite(client_id: string, url: string) {
  await db.delete(schema.sites)
    .where(and(
      eq(schema.sites.client_id, client_id),
      eq(schema.sites.url, url), 
    ));
  revalidatePath(`/clients/${client_id}/sites`);
}