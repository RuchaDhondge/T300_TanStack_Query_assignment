import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import './styles.css';

const queryClient = new QueryClient();

async function fetchProducts() {
  const response = await fetch('https://dummyjson.com/products');

  if (!response.ok) {
    throw new Error('Unable to load products.');
  }

  const result = await response.json();
  return result.products;
}

function App() {
  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  return (
    <main className="container">
      <h1>Exercise 1: Product Listing</h1>
      <p className="hint">
        Product query configured with TanStack Query.
      </p>
      <p className="meta">
        {productsQuery.data
          ? `${productsQuery.data.length} products loaded.`
          : 'Product data will be displayed in the next step.'}
      </p>
    </main>
  );
}

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);
