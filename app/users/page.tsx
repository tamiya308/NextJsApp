import Link from 'next/link';
import RefreshButton from './RefreshButton';

interface User {
  id:number;
  name:string;
}

const PAGE_SIZE = 5;

interface Props {
  searchParams: Promise<{ page?: string }>;
}

const UsersPage = async({ searchParams }: Props) => {
  const res = await fetch('https://jsonplaceholder.typicode.com/users',
    {cache:'no-store'}
  );
  const users: User[] = await res.json();

  const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));
  const requested = Number((await searchParams).page) || 1;
  const page = Math.min(Math.max(1, Math.floor(requested)), totalPages);
  const pageUsers = users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <h1 className="pb-4">Users ({new Date().toLocaleTimeString()})</h1>
      <ul>
        {pageUsers.map((user) => (
          <li key={user.id}>
            <Link href={`/users/${user.id}`} className="hover:underline">{user.name}</Link>
          </li>
        ))}
      </ul>
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
