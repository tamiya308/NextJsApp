'use client';
import { useOptimistic, useState, useTransition } from 'react';

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => Promise<void>;
  label?: string;
}

const ActiveCheckbox = ({ checked, onChange, label = 'Active' }: Props) => {
  // Show the new value straight away; it falls back to `checked` if the save fails
  const [optimisticChecked, setOptimisticChecked] = useOptimistic(checked);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleChange = (next: boolean) => {
    setError(null);
    startTransition(async () => {
      setOptimisticChecked(next);
      try {
        await onChange(next);
      } catch {
        setError("Couldn't save the change. Please try again.");
      }
    });
  };

  return (
    <span className="inline-flex items-center gap-2">
      <label className="inline-flex items-center gap-2">
        <input
          type="checkbox"
          checked={optimisticChecked}
          disabled={isPending}
          onChange={(e) => handleChange(e.target.checked)}
        />
        {label}
      </label>
      {isPending && <span className="text-sm opacity-60">Saving...</span>}
      {error && <span className="text-sm text-red-600">{error}</span>}
    </span>
  )
}

export default ActiveCheckbox
