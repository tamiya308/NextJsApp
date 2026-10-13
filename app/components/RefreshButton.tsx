'use client';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

const RefreshButton = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      className="mt-4 rounded border px-4 py-2 disabled:opacity-50"
      disabled={isPending}
      onClick={() => startTransition(() => router.refresh())}
    >
      {isPending ? 'Refreshing...' : 'Refresh'}
    </button>
  )
}

export default RefreshButton
