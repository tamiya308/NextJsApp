import Link from 'next/link';
import RefreshButton from './RefreshButton';
import { getStudents } from '../lib/students';
import { formatDate } from '../lib/formatDate';

const PAGE_SIZE = 5;

interface Props {
  searchParams: Promise<{ page?: string }>;
}

const UsersPage = async({ searchParams }: Props) => {
  const students = await getStudents();

  const totalPages = Math.max(1, Math.ceil(students.length / PAGE_SIZE));
  const requested = Number((await searchParams).page) || 1;
  const page = Math.min(Math.max(1, Math.floor(requested)), totalPages);
  const pageStudents = students.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <h1 className="pb-4">Users ({new Date().toLocaleTimeString()})</h1>
      <table className="text-left">
        <thead>
          <tr className="border-b">
            <th className="py-1 pr-6">ID</th>
            <th className="py-1 pr-6">Name</th>
            <th className="py-1 pr-6">Date of birth</th>
            <th className="py-1 pr-6">Enrolled</th>
            <th className="py-1">Status</th>
          </tr>
        </thead>
        <tbody>
          {pageStudents.map((student) => (
            <tr key={`${student.StudentId}#${student.EnrolmentDate}`}>
              <td className="py-1 pr-6">{student.StudentId}</td>
              <td className="py-1 pr-6">
                <Link href={`/users/${student.StudentId}`} className="hover:underline">{student.FullName}</Link>
              </td>
              <td className="py-1 pr-6">{formatDate(student.DOB)}</td>
              <td className="py-1 pr-6">{formatDate(student.EnrolmentDate)}</td>
              <td className="py-1">{student.IsActive ? 'Active' : 'Inactive'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <RefreshButton />
      <nav className="mt-4 flex items-center gap-4">
        {page > 1 ? (
          <Link href={`/users?page=${page - 1}`}>&larr; Prev</Link>
        ) : (
          <span className="opacity-50">&larr; Prev</span>
        )}
        <span>Page {page} of {totalPages}</span>
        {page < totalPages ? (
          <Link href={`/users?page=${page + 1}`}>Next &rarr;</Link>
        ) : (
          <span className="opacity-50">Next &rarr;</span>
        )}
      </nav>
    </div>
  )
}

export default UsersPage
