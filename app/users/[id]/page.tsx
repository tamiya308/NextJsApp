import { notFound } from 'next/navigation';
import UserDetails from '../../components/UserDetails';
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
    <UserDetails
      id={student.StudentId}
      name={student.FullName}
      dob={student.DOB}
      enrolmentDate={student.EnrolmentDate}
      isActive={student.IsActive}
      onActiveChange={updateStudentActive.bind(null, student.StudentId, student.EnrolmentDate)}
      backHref="/users"
      backLabel="Back to users"
    />
  )
}

export default UserPage
