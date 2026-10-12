import RefreshButton from './RefreshButton';

interface User {
  id:number;
  name:string;
}

const UsersPage = async() => {
  const res = await fetch('https://jsonplaceholder.typicode.com/users',
    {cache:'no-store'}
  );
  const users: User[] = await res.json();

  return (
    <div>
      <h1>Users</h1>
      <p>{new Date().toLocaleTimeString()}</p>
      <ul>
        {users.map((user: any) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      <RefreshButton />
    </div>
  )
}

export default UsersPage

