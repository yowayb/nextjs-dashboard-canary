'use client';

import { NewSite } from '@/db/schema';
import { CheckIcon } from '@heroicons/react/24/outline';
import { addSite } from '@/app/lib/actions';
import { useFormState, useFormStatus } from 'react-dom';
import { useActionState, useState } from 'react';
import { AddSiteState } from '@/app/lib/actions';

function Spinner() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
        opacity=".25"
      />
      <path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z">
        <animateTransform
          attributeName="transform"
          type="rotate"
          dur="0.75s"
          values="0 12 12;360 12 12"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}

function URLInput({ url, setUrl }: { url: string, setUrl: Function }) {
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
        type="text"
        placeholder="https://example.com"
        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
        aria-describedby="url-error"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
        }}
        required
        disabled={pending}
      />
    </div>
  );
}

export default function AddSite({ client_id }: { client_id: string }) {
  const initialState: AddSiteState = { message: '', errors: {} };
  const addSiteWithClientId = addSite.bind(null, client_id);
  const [state, dispatch] = useFormState(addSiteWithClientId, initialState);
  const [url, setUrl] = useState('');

  function handleSubmit(formData: FormData) {
    dispatch(formData);
    setUrl('');
  }

  return (
    <form action={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="url" className="mb-2 block text-sm font-medium">
            Add site URL
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <URLInput url={url} setUrl={setUrl}/>
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
