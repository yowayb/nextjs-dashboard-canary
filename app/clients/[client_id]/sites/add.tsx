'use client';

import { addSite } from '@/app/lib/actions';
import { useFormStatus } from 'react-dom';
import { useActionState, useState } from 'react';
import { AddSiteState } from '@/app/lib/actions';
import { Spinner } from '@/app/Spinner';
import clsx from 'clsx';

export default function AddSite({ client_id }: { client_id: string }) {
  const initialState: AddSiteState = { message: '', errors: {} };
  const addSiteWithClientId = addSite.bind(null, client_id);
  const [state, dispatch] = useActionState(addSiteWithClientId, initialState);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-2">
        <div className="mb-4">
          <label htmlFor="url" className="mb-2 block text-sm font-medium">
            Add site URL
          </label>
          <URLInput />

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
  const [url, setUrl] = useState('');
  const { pending } = useFormStatus();
  return (
    <div className="flex items-center">
      <input
        id="url"
        name="url"
        type="url"
        placeholder="https://example.com"
        className="peer flex-grow rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
        aria-describedby="url-error"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
        disabled={pending}
      />
      <button
        type="submit"
        disabled={url.length === 0}
        className={clsx(
          "ml-3 px-3 py-2 text-sm font-medium rounded-md",
          url.length === 0 ? "text-gray-400 bg-gray-300" : "text-white bg-blue-500"
        )}
      >
        { !pending ? ('⮐ Add') : (<Spinner message="Submitting..." />) }
      </button>
    </div>
  );
}