import Link from 'next/link';
import { notFound } from 'next/navigation';
import ActiveCheckbox from '../../components/ActiveCheckbox';
import ProfileIcon from '../../components/ProfileIcon';
import styles from '../../components/users.module.css';
import { formatDate } from '../../lib/formatDate';
import { getStudent } from '../../lib/students';
import { updateStudentActive } from '../actions';

interface Props {
  params: Promise<{ id: string }>;
}

const UserPage = async({ params }: Props) => {
  const { id } = await params;
  const student = await getStudent(id);
  if (!student) notFound();

  return (
    <div className={`${styles.card} flex flex-col items-start gap-4`}>
      <ProfileIcon isActive={student.IsActive} />
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
        <dt className="font-bold">ID</dt>
        <dd>{student.StudentId}</dd>
        <dt className="font-bold">Name</dt>
        <dd>{student.FullName}</dd>
        <dt className="font-bold">Date of birth</dt>
        <dd>{formatDate(student.DOB)}</dd>
        <dt className="font-bold">Enrolled</dt>
        <dd>{formatDate(student.EnrolmentDate)}</dd>
        <dt className="font-bold">Status</dt>
        <dd>
          <ActiveCheckbox
            checked={student.IsActive}
            onChange={updateStudentActive.bind(null, student.StudentId, student.EnrolmentDate)}
          />
        </dd>
      </dl>
      <Link href="/users" className="btn btn-primary">
        &larr; Back to users
      </Link>
    </div>
  )
}

export default UserPage
