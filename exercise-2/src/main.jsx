import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import './styles.css';

const queryClient = new QueryClient();

async function fetchUsers() {
  try {
    const response = await fetch('https://dummyjson.com/users');

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}.`);
    }

    const result = await response.json();
    return result.users;
  } catch (error) {
    throw new Error('Unable to load users.', { cause: error });
  }
}

function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
}

function App() {
  const usersQuery = useUsers();

  return (
    <main className="container">
      <h1>Exercise 2: User Management</h1>
      <p className="hint">
        Users are retrieved and cached with a custom TanStack Query hook.
      </p>

      {usersQuery.isPending && <p className="message">Loading users...</p>}

      {usersQuery.isError && (
        <p className="error" role="alert">
          {usersQuery.error.message}
        </p>
      )}

      {usersQuery.isSuccess && (
        <>
          <p className="message">{usersQuery.data.length} users loaded.</p>
          <section className="list" aria-label="Users">
            {usersQuery.data.map((user) => (
              <article className="user" key={user.id}>
                <div>
                  <strong>
                    {user.firstName} {user.lastName}
                  </strong>
                  <span>{user.email}</span>
                  <small>{user.role}</small>
                </div>
              </article>
            ))}
          </section>
        </>
      )}
    </main>
  );
}

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);
