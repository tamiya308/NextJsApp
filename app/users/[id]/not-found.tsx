import Link from 'next/link';

const StudentNotFound = () => {
  return (
    <div className="flex flex-col items-start gap-4">
      <h1 className="text-lg font-bold">Student not found</h1>
      <p>There's no student with that ID.</p>
      <Link href="/users" className="rounded border px-4 py-2">
        &larr; Back to users
      </Link>
    </div>
  )
}

export default StudentNotFound
