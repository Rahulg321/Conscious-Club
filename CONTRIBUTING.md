# Contributing

## Local setup

1. Install dependencies at the repo root (requires Bun):

```
bun install
```

2. Use the workspace TypeScript version only (single TS at repo root). Do not add `typescript` to individual packages. If using VS Code, ensure it uses the workspace TS.

3. Generate Next.js types by running dev once (for clean type-checks):

```
bun run -w dev
```

This generates `.next/types` referenced by `apps/frontend/next-env.d.ts`.

4. Environment: copy any `.env.example` to `.env` and fill values as needed.

## Notes

- We standardize on one TypeScript version pinned in the root `package.json`.
- `@repo/db` uses TypeScript `moduleResolution` "Bundler" and does not depend on `next-auth`.
- If opening only a subfolder in your editor, make sure the workspace TypeScript from the monorepo root is used to avoid inconsistent errors.
