import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './styles.css';

const queryClient = new QueryClient();
const createdUsers = [];
const deletedUserIds = new Set();

async function fetchUsers() {
  try {
    const response = await fetch('https://dummyjson.com/users');

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}.`);
    }

    const result = await response.json();
    return [...createdUsers, ...result.users].filter(
      (user) => !deletedUserIds.has(user.id),
    );
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

async function deleteUser({ userId, simulateFailure }) {
  if (simulateFailure) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    throw new Error('Delete failed as requested.');
  }

  const isCreatedUser = createdUsers.some((user) => user.id === userId);

  if (!isCreatedUser) {
    try {
      const response = await fetch(`https://dummyjson.com/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}.`);
      }
    } catch (error) {
      throw new Error('Unable to delete user.', { cause: error });
    }
  }

  return userId;
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

function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onMutate: async ({ userId }) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });

      const previousUsers = queryClient.getQueryData(['users']);

      queryClient.setQueryData(['users'], (users) =>
        users?.filter((user) => user.id !== userId),
      );

      return { previousUsers };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(['users'], context?.previousUsers);
    },
    onSuccess: (userId) => {
      const createdUserIndex = createdUsers.findIndex(
        (user) => user.id === userId,
      );

      if (createdUserIndex >= 0) {
        createdUsers.splice(createdUserIndex, 1);
      } else {
        deletedUserIds.add(userId);
      }
    },
    onSettled: async () => {
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
  const [simulateDeleteFailure, setSimulateDeleteFailure] =
    React.useState(false);
  const usersQuery = useUsers();
  const createUserMutation = useCreateUser();
  const deleteUserMutation = useDeleteUser();

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

  function handleDelete(userId) {
    deleteUserMutation.mutate({
      userId,
      simulateFailure: simulateDeleteFailure,
    });
    setSimulateDeleteFailure(false);
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
          <label className="failure-toggle">
            <input
              type="checkbox"
              checked={simulateDeleteFailure}
              onChange={(event) =>
                setSimulateDeleteFailure(event.target.checked)
              }
            />
            Simulate the next delete failure to verify rollback
          </label>

          {deleteUserMutation.isSuccess && (
            <p className="message" role="status">
              User deleted successfully.
            </p>
          )}

          {deleteUserMutation.isError && (
            <p className="error" role="alert">
              {deleteUserMutation.error.message} The user was restored.
            </p>
          )}

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
                <button
                  type="button"
                  onClick={() => handleDelete(user.id)}
                  disabled={deleteUserMutation.isPending}
                >
                  {deleteUserMutation.isPending &&
                  deleteUserMutation.variables?.userId === user.id
                    ? 'Deleting...'
                    : 'Delete'}
                </button>
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
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>,
);
