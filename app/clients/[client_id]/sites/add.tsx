'use client';

import { addSite } from '@/app/lib/actions';
import { useFormStatus } from 'react-dom';
import { useActionState, useState } from 'react';
import { AddSiteState } from '@/app/lib/actions';
import { Spinner } from '@/app/Spinner';

export default function AddSite({ client_id }: { client_id: string }) {
  const initialState: AddSiteState = { message: '', errors: {} };
  const addSiteWithClientId = addSite.bind(null, client_id);
  const [state, dispatch] = useActionState(addSiteWithClientId, initialState);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="url" className="mb-2 block text-sm font-medium">
            Add site URL
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <URLInput />
            </div>
          </div>

          <div id="url-error" aria-live="polite" aria-atomic="true">
            {state?.errors?.url &&
              state.errors.url.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {state?.message ? (
            <p className="mt-2 text-sm">{state.message}</p>
          ) : null}
        </div>
      </div>
    </form>
  );
}

function URLInput() {
  const { pending } = useFormStatus();
  return (
    <div>
      { pending ? (
        <div>
          <Spinner /> Adding new URL...
        </div>
      ) : null}
      <input
        id="url"
        name="url"
        type="url"
        placeholder="https://example.com"
        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
        aria-describedby="url-error"
        required
        disabled={pending}
      />
    </div>
  );
}