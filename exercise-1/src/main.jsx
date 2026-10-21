import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import './styles.css';

const queryClient = new QueryClient();

async function fetchProducts(searchTerm) {
  const endpoint = searchTerm
    ? `https://dummyjson.com/products/search?q=${encodeURIComponent(searchTerm)}`
    : 'https://dummyjson.com/products';
  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error('Unable to load products.');
  }

  const result = await response.json();
  return result.products;
}

function App() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const productsQuery = useQuery({
    queryKey: ['products', { search: searchTerm }],
    queryFn: () => fetchProducts(searchTerm),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    networkMode: 'always',
  });

  return (
    <main className="container">
      <h1>Exercise 1: Product Listing</h1>
      <p className="hint">
        Search products while TanStack Query manages the server state.
      </p>
      <div className="search">
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search products"
          aria-label="Search products"
        />
        <button
          type="button"
          onClick={() => productsQuery.refetch()}
          disabled={productsQuery.isFetching}
        >
          {productsQuery.isFetching ? 'Refreshing...' : 'Refresh Products'}
        </button>
      </div>

      {productsQuery.isPending && (
        <p className="status">Loading products...</p>
      )}

      {productsQuery.isError && !productsQuery.data && (
        <p className="error" role="alert">
          {productsQuery.error.message}
        </p>
      )}

      {productsQuery.isError && productsQuery.data && (
        <p className="error" role="alert">
          Refresh failed: {productsQuery.error.message}
        </p>
      )}

      {productsQuery.isFetching && !productsQuery.isPending && (
        <p className="fetching" role="status">
          Fetching updated products...
        </p>
      )}

      {productsQuery.isSuccess && (
        <>
          <p className="success">
            {productsQuery.data.length} product
            {productsQuery.data.length === 1 ? '' : 's'} found.
          </p>
          <div className="grid">
            {productsQuery.data.map((product) => (
              <article className="card" key={product.id}>
                <img src={product.thumbnail} alt="" />
                <h2>{product.title}</h2>
                <p>{product.category}</p>
                <strong>${product.price}</strong>
              </article>
            ))}
          </div>
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
