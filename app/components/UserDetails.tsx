import Link from 'next/link';
import { formatDate } from '../lib/formatDate';
import ActiveCheckbox from './ActiveCheckbox';
import ProfileIcon from './ProfileIcon';
import styles from './users.module.css';

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
    <div className={`${styles.card} flex flex-col items-start gap-4`}>
      <ProfileIcon isActive={isActive} />
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
      <Link href={backHref} className="btn btn-primary">
        &larr; {backLabel}
      </Link>
    </div>
  )
}

export default UserDetails
