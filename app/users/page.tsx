import Link from 'next/link';
import { connection } from 'next/server';
import RefreshButton from './RefreshButton';
import { getStudents } from '../lib/students';
import { formatDate } from '../lib/formatDate';

const UsersPage = async() => {
  // Render on every request; without this Next.js would build the list once at build time
  await connection();
  const students = await getStudents();

  return (
    <div>
      <h1 className="pb-4">Users ({new Date().toLocaleTimeString()})</h1>
      <div className="max-h-96 overflow-y-auto border">
        <table className="w-full text-left">
          <thead className="sticky top-0 z-10 bg-[rgb(var(--background-start-rgb))]">
            <tr className="border-b">
              <th className="px-2 py-1 pr-6">ID</th>
              <th className="py-1 pr-6">Name</th>
              <th className="py-1 pr-6">Date of birth</th>
              <th className="py-1 pr-6">Enrolled</th>
              <th className="py-1 pr-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={`${student.StudentId}#${student.EnrolmentDate}`} className="group relative hover:bg-gray-500/10">
                <td className="px-2 py-1 pr-6">{student.StudentId}</td>
                <td className="py-1 pr-6">
                  {/* after: overlay stretches the link over the whole row (tr is relative) */}
                  <Link href={`/users/${student.StudentId}`} className="group-hover:underline after:absolute after:inset-0">{student.FullName}</Link>
                </td>
                <td className="py-1 pr-6">{formatDate(student.DOB)}</td>
                <td className="py-1 pr-6">{formatDate(student.EnrolmentDate)}</td>
                <td className="py-1 pr-2">{student.IsActive ? 'Active' : 'Inactive'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <RefreshButton />
    </div>
  )
}

export default UsersPage
