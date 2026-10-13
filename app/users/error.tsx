'use client';
import { useRouter } from 'next/navigation';
import { startTransition } from 'react';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

const UsersError = ({ error, reset }: Props) => {
  const router = useRouter();

  // refresh() re-runs the Server Components; reset() then re-renders this segment with the new result
  const retry = () => startTransition(() => {
    router.refresh();
    reset();
  });

  return (
    <div className="flex flex-col items-start gap-4">
      <h1 className="text-lg font-bold">Couldn&apos;t load students</h1>
      <p>The database may be unavailable. Check that the DynamoDB container is running on port 8000.</p>
      {process.env.NODE_ENV === 'development' && <pre className="text-sm opacity-70">{error.message}</pre>}
      <button className="rounded border px-4 py-2" onClick={retry}>Retry</button>
    </div>
  )
}

export default UsersError
