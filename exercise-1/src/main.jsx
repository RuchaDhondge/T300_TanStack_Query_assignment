import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function App() {
  // TODO:
  // 1. Configure TanStack Query and QueryClientProvider.
  // 2. Create the product query using useQuery().
  // 3. Implement the required query key, query function and cache settings.
  // 4. Add loading, fetching, error and success states.
  // 5. Add search and Refresh Products functionality.
  // 6. Add React Query DevTools.

  return (
    <main className="container">
      <h1>Exercise 1: Product Listing</h1>
      <p className="hint">
        Implement product fetching, caching, query keys, loading states, search, and background fetching.
      </p>
      {/* TODO: Build the product listing UI */}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
