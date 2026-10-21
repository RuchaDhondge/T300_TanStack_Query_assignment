import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function App() {
  // TODO:
  // 1. Configure TanStack Query and QueryClientProvider.
  // 2. Create a useUsers() custom hook using useQuery() with ['users'].
  // 3. Create a useCreateUser() custom hook using useMutation().
  // 4. Create a delete mutation with optimistic cache updates.
  // 5. Implement cancellation, rollback, setQueryData and invalidation.
  // 6. Display pending, success and error states.
  // 7. Add React Query DevTools.

  return (
    <main className="container">
      <h1>Exercise 2: User Management</h1>
      <p className="hint">
        Implement user creation, deletion, mutations, invalidation, and optimistic updates.
      </p>
      {/* TODO: Build the user management UI */}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
