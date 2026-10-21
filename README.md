# TanStack Query Assignment

This repository contains the MCQ answers and two React exercises demonstrating
TanStack Query queries, caching, mutations, invalidation, and optimistic
updates.

## Prerequisites

- Node.js
- npm

Install dependencies for both applications:

```bash
npm --prefix exercise-1 install
npm --prefix exercise-2 install
```

## Exercise 1: Product Listing

Exercise 1 demonstrates:

- Product fetching with `useQuery()`
- Search terms in query keys
- `staleTime` and `gcTime`
- Initial loading, background fetching, success, and error states
- Manual refresh with `refetch()`
- React Query DevTools

Run the application:

```bash
npm --prefix exercise-1 run dev
```

Build the application:

```bash
npm --prefix exercise-1 run build
```

### Exercise 1 verification

1. Confirm the initial loading state is displayed before products load.
2. Search for a product and confirm the results change.
3. Open React Query DevTools and verify a search-specific query key, such as:

   ```text
   ["products", {"search": "phone"}]
   ```

4. Open the browser Network tab and click **Refresh Products**.
5. Confirm a new request is sent while the existing products remain visible.
6. Block the DummyJSON request and use a new search term to verify the error
   state.

## Exercise 2: User Management

Exercise 2 demonstrates:

- A `useUsers()` query hook
- A `useCreateUser()` mutation hook
- Query invalidation after user creation
- Optimistic deletion with immediate cache updates
- Query cancellation and cache snapshots
- Rollback after a failed delete
- Cache synchronization after mutation settlement
- React Query DevTools

Run the application:

```bash
npm --prefix exercise-2 run dev
```

Build the application:

```bash
npm --prefix exercise-2 run build
```

### Exercise 2 verification

1. Confirm the user list loads through the `["users"]` query.
2. Create a user and verify the pending and success states.
3. Confirm the user appears at the top of the refreshed list.
4. Delete a user and confirm the user disappears immediately.
5. Select **Simulate the next delete failure to verify rollback**.
6. Delete another user and confirm the user is restored after the simulated
   failure.
7. Use React Query DevTools to observe query invalidation, mutation states, and
   refetching.

DummyJSON simulates create and delete requests but does not permanently save
changes. Exercise 2 keeps successful changes in memory so invalidation and
optimistic-update behavior can be demonstrated during the current browser
session. Reloading the page resets those simulated changes.

## MCQ Answers

The assignment answers are provided in `answers.txt`.