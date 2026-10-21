# Exercise 1: Product Listing with Caching, Loading States, and Query Keys

## Run
```bash
npm install
npm run dev
```

## Objective
Build a React application that displays products from a REST API using TanStack Query.

## Requirements
1. Install and configure `@tanstack/react-query`.
2. Create a `QueryClient` and wrap the application with `QueryClientProvider`.
3. Create a product listing component using `useQuery()`.
4. Use `['products']` as the base query key.
5. Implement `isPending`, `isFetching`, `isError`, and `isSuccess` UI states.
6. Configure `staleTime: 30 * 1000` and `gcTime: 5 * 60 * 1000`.
7. Add a Refresh Products button that manually triggers `refetch()`.
8. Add search/filter functionality and include the search term in the query key, for example:
   `['products', { search: searchTerm }]`
9. Do not manually manage the server response with `useEffect()` and `useState()`. `useState()` may be used for the search input value.

## Verification Steps
1. Verify products load from the API.
2. Open React Query DevTools and verify the products query appears.
3. Verify the initial pending/loading state.
4. Change the search term and verify a new query is created for the updated query key.
5. Navigate away and return within the configured staleTime.
6. Verify cached data is displayed without an unnecessary loading state.
7. Trigger a background refetch and verify existing data remains visible while `isFetching` is true.
8. Disconnect the network or simulate an API failure and verify the error state.
