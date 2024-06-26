'use client';

import { GlobeAltIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteSite } from '../lib/actions';
import { Spinner } from '../Spinner';

export function ManageSitesButton({ clientId }: { clientId: string }) {
  return (
    <Link
      href={`/clients/${clientId}/sites`}
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <GlobeAltIcon className="h-6 w-6" />
    </Link>
  );
}