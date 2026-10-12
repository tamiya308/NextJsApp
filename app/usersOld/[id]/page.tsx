import { notFound } from 'next/navigation';
import UserDetails from '../UserDetails';

interface User {
  id:number;
  name:string;
}

interface Props {
  params: Promise<{ id: string }>;
}

const UserPage = async({ params }: Props) => {
  const { id } = await params;
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${encodeURIComponent(id)}`,
    {cache:'no-store'}
  );
  if (!res.ok) notFound();
  const user: User = await res.json();

  return <UserDetails id={user.id} name={user.name} backHref="/usersOld" backLabel="Back to users old" />
}

export default UserPage
