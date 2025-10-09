# Onboarding Flow Fix Summary

## Issues Found

### 1. Missing Null Coalescing in JWT Callback

**Location:** `apps/frontend/auth.config.ts` (Line 136)

**Problem:**

- The `onboardingCompleted` value from the database could potentially be `null` or `undefined`
- This wasn't being handled with a fallback value, which could cause issues in the middleware

**Before:**

```typescript
token.onboardingCompleted = dbUser.onboardingCompleted;
```

**After:**

```typescript
token.onboardingCompleted = dbUser.onboardingCompleted ?? false;
```

### 2. Missing Error Handling Fallback

**Location:** `apps/frontend/auth.config.ts` (Lines 144-147)

**Problem:**

- If fetching user data from the database failed, `onboardingCompleted` could remain `undefined`
- This would break the middleware logic

**Fix Added:**

```typescript
catch (error) {
  console.error("Error fetching user data:", error);
  // Ensure onboardingCompleted has a default value on error
  if (token.onboardingCompleted === undefined) {
    token.onboardingCompleted = false;
  }
}
```

### 3. Missing Null Coalescing in Session Callback

**Location:** `apps/frontend/auth.config.ts` (Line 184)

**Problem:**

- The session callback wasn't handling potential `undefined` values from the token

**Before:**

```typescript
(session.user as any).onboardingCompleted = token.onboardingCompleted;
```

**After:**

```typescript
(session.user as any).onboardingCompleted = token.onboardingCompleted ?? false;
```

## How the Flow Works

### Authentication Flow:

1. **User Signs In** → NextAuth triggers the `authorize` function (for credentials) or OAuth flow
2. **JWT Callback** → Called immediately after sign-in and on every request
   - Fetches fresh user data from database including `onboardingCompleted`
   - Sets token properties: `id`, `type`, `isAdmin`, `onboardingCompleted`
3. **Session Callback** → Converts the JWT token data into the session object
   - Copies all token properties to the session.user object
4. **Middleware** → Checks the session on every request
   - Reads `onboardingCompleted` from `session.user`
   - Redirects to `/onboarding` if not completed
   - Redirects to `/dashboard` if already completed and trying to access onboarding

### Database Schema:

```typescript
// packages/db/schema.ts (Line 50)
onboardingCompleted: boolean("onboardingCompleted").notNull().default(false);
```

## Debugging Tips

The fixes include console.log statements to help you debug:

1. **JWT Callback Log** (Line 163-170):

```typescript
console.log(
  "Created access token for user:",
  user.email,
  "isAdmin:",
  token.isAdmin,
  "onboardingCompleted:",
  token.onboardingCompleted
);
```

2. **Session Callback Log** (Line 187-192):

```typescript
console.log(
  "Session callback - User:",
  session.user.email,
  "onboardingCompleted:",
  token.onboardingCompleted
);
```

3. **Middleware Log** (Line 21-28):

```typescript
console.log(
  "Middleware - Path:",
  nextUrl.pathname,
  "| isLoggedIn:",
  isLoggedIn,
  "| onboardingCompleted:",
  onboardingCompleted
);
```

## Testing the Fix

To verify the fix is working:

1. **New User Flow:**
   - Sign up/login as a new user
   - Check console logs - should show `onboardingCompleted: false`
   - Should be redirected to `/onboarding`

2. **Completed Onboarding User:**
   - Complete the onboarding flow
   - Database should update `onboardingCompleted` to `true`
   - On next request, middleware should allow access to `/dashboard`
   - Trying to access `/onboarding` should redirect to `/dashboard`

3. **Check Database:**

```sql
SELECT id, email, "onboardingCompleted" FROM "user";
```

## Potential Remaining Issues

If the flow still doesn't work after this fix, check:

1. **Session Refresh:** JWT tokens are cached. You might need to:
   - Sign out and sign back in
   - Clear cookies
   - Restart the dev server

2. **Database Connection:** Ensure the database query is working:
   - Check if `getUserById()` is returning the correct data
   - Verify the database connection is stable

3. **Middleware Matcher:** Check if the middleware is running on the correct routes:
   - Current matcher: `["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"]`
   - This should cover most routes except static assets

## Redirect Loop Fix

### Issue:

The middleware was causing infinite redirect loops because:

1. Public routes (like `/`) weren't being properly handled for logged-in users without onboarding
2. The redirect logic would redirect to `/onboarding` but then redirect back
3. Missing `PUBLIC_ROUTES` import and check

### Fix Applied:

**Location:** `apps/frontend/middleware.ts`

**Changes:**

1. Added `PUBLIC_ROUTES` import (line 8)
2. Added null coalescing to `onboardingCompleted` (line 19)
3. Restructured middleware logic order:
   - First: Allow public assets and API routes (lines 42-43)
   - Second: Allow auth routes (lines 47-48)
   - Third: Block protected routes for non-logged-in users (lines 56-58)
   - Fourth: Handle onboarding logic with PUBLIC_ROUTES check (lines 61-76)

**Key Change:**

```typescript
// Allow access to public routes (homepage, etc.) without forcing onboarding
if (isOnPublicRoute) {
  return NextResponse.next();
}
```

This prevents logged-in users without completed onboarding from being trapped in a redirect loop when accessing public routes like the homepage `/`.

## Summary

The main issues were:

1. **Null/Undefined Handling:** `onboardingCompleted` could be `null` or `undefined` at various points in the authentication flow
2. **Redirect Loop:** Public routes weren't properly handled, causing infinite redirects for logged-in users without onboarding

The fixes ensure that:

- Database values are always coalesced to `false` if null/undefined
- Error cases have proper fallbacks
- Session always has a valid boolean value
- Public routes are accessible even without completed onboarding
- Only protected routes require onboarding completion
- Debug logs help track the flow
