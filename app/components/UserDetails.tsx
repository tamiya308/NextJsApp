import Link from 'next/link';
import { formatDate } from '../lib/formatDate';
import ActiveCheckbox from './ActiveCheckbox';

interface Props {
  id: string;
  name: string;
  dob: string;
  enrolmentDate: string;
  isActive: boolean;
  // When provided, the status is shown as an editable checkbox that calls this to save the change
  onActiveChange?: (isActive: boolean) => Promise<void>;
  backHref: string;
  backLabel?: string;
}

const UserDetails = ({ id, name, dob, enrolmentDate, isActive, onActiveChange, backHref, backLabel = 'Back' }: Props) => {
  return (
    <div className="flex flex-col items-start gap-4">
      <svg
        className="h-24 w-24 rounded-full border p-4 opacity-60"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8z" />
      </svg>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
        <dt className="font-bold">ID</dt>
        <dd>{id}</dd>
        <dt className="font-bold">Name</dt>
        <dd>{name}</dd>
        <dt className="font-bold">Date of birth</dt>
        <dd>{formatDate(dob)}</dd>
        <dt className="font-bold">Enrolled</dt>
        <dd>{formatDate(enrolmentDate)}</dd>
        <dt className="font-bold">Status</dt>
        <dd>
          {onActiveChange
            ? <ActiveCheckbox checked={isActive} onChange={onActiveChange} />
            : isActive ? 'Active' : 'Inactive'}
        </dd>
      </dl>
      <Link href={backHref} className="rounded border px-4 py-2">
        &larr; {backLabel}
      </Link>
    </div>
  )
}

export default UserDetails
