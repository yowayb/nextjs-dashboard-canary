'use client';

import { Site } from '@/db/schema';
import { deleteSite } from '@/app/lib/actions';
import { useFormStatus } from 'react-dom';
import { useActionState, useState } from 'react';
import { AddSiteState } from '@/app/lib/actions';
import { Spinner } from '@/app/Spinner';

export default function DeleteSite({ client_id, url }: { client_id: string, url: string }) {
  const boundAction = deleteSite.bind(null, client_id, url);

  return (
    <form action={boundAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <Button />
        </div>
      </div>
    </form>
  );
}

function Button() {
  const { pending } = useFormStatus();
  return (
    <button type="submit"
      className="flex h-10 items-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition-colors hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
    >
      {pending ? (
        <div>
          <Spinner /> Deleting...
        </div>
       ) : (
        <div>Delete</div>
       )
      }
    </button>
  );
}