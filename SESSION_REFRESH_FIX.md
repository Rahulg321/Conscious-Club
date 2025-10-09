# Session Refresh Fix - JWT Token Caching Issue

## The Problem

After completing onboarding, the middleware was still seeing `onboardingCompleted: false` even though the database was correctly updated to `true`. This was causing users to be stuck in a redirect loop.

### Why This Happened

**JWT Token Caching:**

1. User completes onboarding form
2. API route updates database: `onboardingCompleted: true` ✅
3. Frontend redirects using `router.push("/profile")`
4. **BUT** the JWT token in the session is still cached with old data: `onboardingCompleted: false` ❌
5. Middleware reads from session → sees `false` → redirects back to onboarding
6. **Infinite loop!** 🔁

### JWT Callback Only Runs On:

- Initial sign-in
- Token refresh (periodic, could be hours)
- **NOT** on client-side navigation or after database updates

## The Solution

Force a full page reload after onboarding completion to fetch a fresh session with the updated JWT token.

### Files Changed

#### 1. `/apps/frontend/components/forms/onboarding/hooks/useOnboardingFormWithURL.ts`

**Line 203-204:**

```typescript
// OLD - Client-side navigation (doesn't refresh session)
router.push("/profile");

// NEW - Full page reload (refreshes session)
window.location.href = "/dashboard";
```

#### 2. `/apps/frontend/components/forms/onboarding/hooks/useOnboardingForm.ts`

**Line 193-194:**

```typescript
// OLD - Client-side navigation (doesn't refresh session)
router.push("/profile");

// NEW - Full page reload (refreshes session)
window.location.href = "/dashboard";
```

## How It Works Now

### Complete Flow:

1. **User Signs In**
   - JWT callback runs → fetches user from DB
   - Token created with `onboardingCompleted: false`
   - Session created with this token
   - Middleware checks session → redirects to `/onboarding`

2. **User Completes Onboarding**
   - Form submits to `/api/onboarding`
   - Database updated: `onboardingCompleted: true`
   - Frontend redirects: `window.location.href = "/dashboard"`

3. **Full Page Reload Happens**
   - Browser makes new request to `/dashboard`
   - NextAuth fetches fresh session
   - JWT callback runs → fetches user from DB
   - Token has fresh data: `onboardingCompleted: true`
   - Session updated with new token

4. **Middleware Check**
   - Reads session: `onboardingCompleted: true` ✅
   - Allows access to `/dashboard` ✅
   - No more redirect loop! 🎉

## Alternative Solutions (Not Implemented)

### Option 1: Sign Out & Sign In

```typescript
import { signOut, signIn } from "next-auth/react";

// After successful onboarding
await signOut({ redirect: false });
await signIn("credentials", {
  email: user.email,
  redirect: true,
  callbackUrl: "/dashboard",
});
```

**Pros:** Cleanly refreshes session  
**Cons:** Requires re-authentication, more complex

### Option 2: Session Update API

```typescript
// Call NextAuth's session update endpoint
await fetch("/api/auth/session?update");
router.refresh();
```

**Pros:** No full page reload  
**Cons:** Still uses cached token, may not work reliably

### Option 3: Server-Side Revalidation

```typescript
import { revalidatePath } from "next/cache";
revalidatePath("/dashboard");
```

**Pros:** Server-side cache clear  
**Cons:** Doesn't update client-side JWT token

## Why `window.location.href` is Best

✅ **Simple** - One line change  
✅ **Reliable** - Guaranteed to fetch fresh session  
✅ **No Dependencies** - No need for NextAuth client hooks  
✅ **Works Everywhere** - Browser-native solution  
✅ **Clean UX** - User sees loading, then dashboard with fresh data

## Testing the Fix

1. **Sign in as a new user**
   - Check console: `onboardingCompleted: false`
   - Should be redirected to `/onboarding`

2. **Complete the onboarding form**
   - Fill in all required fields
   - Submit the form
   - See success toast

3. **Observe the redirect**
   - Page should do a full reload
   - User lands on `/dashboard`
   - Check console: `onboardingCompleted: true` ✅

4. **Try to access `/onboarding` again**
   - Should be immediately redirected to `/dashboard`
   - Middleware prevents access to onboarding when completed

## Database Verification

To verify the database is being updated correctly:

```sql
-- Check user's onboarding status
SELECT id, email, name, "onboardingCompleted", "updatedAt"
FROM "user"
WHERE email = 'your-email@example.com';

-- Should show:
-- onboardingCompleted: true
-- updatedAt: [recent timestamp]
```

## Console Logs to Watch

### Before Onboarding:

```
Middleware - Path: /dashboard | isLoggedIn: true | onboardingCompleted: false
Redirecting to onboarding - user has not completed onboarding
```

### During Onboarding:

```
Middleware - Path: /onboarding | isLoggedIn: true | onboardingCompleted: false
FormData entry: name [value]
FormData entry: gender [value]
...
Onboarding submitted successfully: { success: true, ... }
```

### After Onboarding (Fresh Session):

```
Session callback - User: user@example.com onboardingCompleted: true
Middleware - Path: /dashboard | isLoggedIn: true | onboardingCompleted: true
```

## Important Notes

1. **Full page reload is intentional** - This is NOT a bug, it's the fix!
2. **Toast notification will show** - User sees "Successfully completed onboarding" before redirect
3. **Session persists** - User stays logged in, only the token data refreshes
4. **One-time event** - This reload only happens once after onboarding completion

## Related Files

- **Auth Config:** `/apps/frontend/auth.config.ts` - JWT callback that fetches fresh user data
- **Middleware:** `/apps/frontend/middleware.ts` - Checks onboarding status and redirects
- **API Route:** `/apps/frontend/app/api/onboarding/route.ts` - Updates database
- **Onboarding Hooks:**
  - `/apps/frontend/components/forms/onboarding/hooks/useOnboardingFormWithURL.ts`
  - `/apps/frontend/components/forms/onboarding/hooks/useOnboardingForm.ts`

## Summary

The key insight is that **NextAuth JWT tokens are cached** and don't automatically update when the database changes. By using `window.location.href` instead of `router.push()`, we force a full page reload which triggers a fresh session fetch with an updated JWT token containing the correct `onboardingCompleted` value.

This is a common pattern when dealing with session-critical data that changes server-side and needs to be immediately reflected in the client session.
