import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import './styles.css';

const queryClient = new QueryClient();
const createdUsers = [];

async function fetchUsers() {
  try {
    const response = await fetch('https://dummyjson.com/users');

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}.`);
    }

    const result = await response.json();
    return [...createdUsers, ...result.users];
  } catch (error) {
    throw new Error('Unable to load users.', { cause: error });
  }
}

async function createUser(user) {
  try {
    const response = await fetch('https://dummyjson.com/users/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}.`);
    }

    const result = await response.json();
    return { ...result, id: crypto.randomUUID() };
  } catch (error) {
    throw new Error('Unable to create user.', { cause: error });
  }
}

function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
}

function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: async (user) => {
      createdUsers.unshift(user);
      await queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

function App() {
  const [form, setForm] = React.useState({
    name: '',
    email: '',
    role: 'user',
  });
  const usersQuery = useUsers();
  const createUserMutation = useCreateUser();

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const [firstName, ...lastNameParts] = form.name.trim().split(/\s+/);

    createUserMutation.mutate(
      {
        firstName,
        lastName: lastNameParts.join(' '),
        email: form.email.trim(),
        role: form.role,
      },
      {
        onSuccess: () => {
          setForm({ name: '', email: '', role: 'user' });
        },
      },
    );
  }

  return (
    <main className="container">
      <h1>Exercise 2: User Management</h1>
      <p className="hint">
        Users are retrieved and cached with a custom TanStack Query hook.
      </p>

      <form className="panel" onSubmit={handleSubmit}>
        <h2>Create User</h2>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={updateField}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={updateField}
          required
        />

        <label htmlFor="role">Role</label>
        <select
          id="role"
          name="role"
          value={form.role}
          onChange={updateField}
        >
          <option value="user">User</option>
          <option value="moderator">Moderator</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" disabled={createUserMutation.isPending}>
          {createUserMutation.isPending ? 'Creating...' : 'Create User'}
        </button>

        {createUserMutation.isSuccess && (
          <p className="message" role="status">
            User created successfully.
          </p>
        )}

        {createUserMutation.isError && (
          <p className="error" role="alert">
            {createUserMutation.error.message}
          </p>
        )}
      </form>

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
