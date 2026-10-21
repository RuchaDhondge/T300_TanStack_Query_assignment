# Exercise 2: User Management with Mutations, Invalidation, and Optimistic Updates

## Run
```bash
npm install
npm run dev
```

## Objective
Build a React application that displays users and supports creation and deletion using TanStack Query mutations.

## Requirements
1. Create a `useUsers()` custom hook using `useQuery()` with `['users']` as the query key.
2. Create a `useCreateUser()` custom hook using `useMutation()`.
3. Create a form containing Name, Email, and Role.
4. On submit, execute the create-user mutation and show pending/error states.
5. After successful creation, invalidate `['users']` and allow the list to refresh with latest server data.
6. Add Delete User functionality using another `useMutation()`.
7. Implement optimistic deletion:
   - Immediately remove the user from the UI.
   - Cancel relevant in-flight queries.
   - Update cached `['users']` data using `setQueryData()`.
   - Restore previous cached data if the server request fails.
   - Invalidate the users query after the mutation settles.
8. Display pending, success, and error mutation states.

## Verification Steps
1. Verify the user list is retrieved through `useQuery()`.
2. Create a new user and verify the mutation executes.
3. Open React Query DevTools and verify `['users']` becomes stale after successful creation.
4. Verify the newly created user appears after the query is refreshed.
5. Delete an existing user and verify it disappears immediately.
6. Simulate a failed delete request and verify the user is restored automatically.
7. Verify the final cache is synchronized with the server after the mutation settles.
8. Confirm no manual `useEffect()` is used to refetch users after mutations.
