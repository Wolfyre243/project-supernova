# Project Supernova Repetitive Tasks

## Add New API Endpoint

**Last performed:** 2025-09-12  
**Files to modify:**

- `src/app/api/[resource]/route.ts` (or subfolders for resource variants)
- `src/db/schema.ts` (if new DB tables/fields are needed)
- `src/app/state/[resource]/[resource]Api.ts`
- `src/components/[resource]/` (if new UI needed)
- `src/documentation/` (update docs if needed)

**Steps:**

1. Create or update the API route in `src/app/api/[resource]/`.
2. Update Drizzle schema in `src/db/schema.ts` if the endpoint requires new data
   structures.
3. Add or update Redux slice/API logic in
   `src/app/state/[resource]/[resource]Api.ts`.
4. Implement or update UI components in `src/components/[resource]/` as needed.
5. Update documentation in `src/documentation/` to reflect the new endpoint and
   usage.
6. Test the endpoint and UI integration.

**Important notes:**

- Follow NextJS API route conventions.
- Ensure type safety throughout (TypeScript).
- Update tests and documentation after changes.

---

## Add New Redux Slice

**Last performed:** 2025-09-12  
**Files to modify:**

- `src/app/state/[sliceName]Slice.ts`
- `src/app/state/store.ts`
- `src/app/state/StoreProvider.tsx`
- `src/components/` (if new UI needed)
- `src/documentation/` (update docs if needed)

**Steps:**

1. Create a new slice file in `src/app/state/` (e.g., `myFeatureSlice.ts`) using
   Redux Toolkit's `createSlice`.
2. Add the new slice to the root reducer in `store.ts`.
3. Provide the slice via `StoreProvider.tsx` if needed.
4. Implement or update UI components to use the new slice.
5. Update documentation in `src/documentation/` to reflect the new state logic.
6. Test the slice and its integration with the UI.

**Important notes:**

- Use TypeScript for all slice logic and selectors.
- Keep state normalized and minimal.
- Update tests and documentation after changes.
