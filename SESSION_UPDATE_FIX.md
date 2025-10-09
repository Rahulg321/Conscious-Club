# Session Update Fix for Onboarding Flow

## Problem

The middleware was checking for `onboardingCompleted` status in the user's session, but the session wasn't being updated after the database was modified during the onboarding process. This caused the following issues:

1. User completes onboarding → Database is updated with `onboardingCompleted: true`
2. User is redirected to `/dashboard`
3. Middleware checks session → Still sees `onboardingCompleted: false` (old JWT token)
4. User is redirected back to `/onboarding` (infinite redirect loop)

**Root Cause**: NextAuth uses JWT-based sessions by default. The JWT token is cached and doesn't automatically reflect database changes until the token expires or is manually refreshed.

## Solution

We implemented a multi-layered approach to ensure the session is properly updated:

### 1. Client-Side Session Update

**File**: `apps/frontend/components/forms/onboarding/hooks/useOnboardingFormWithURL.ts`

- Added `useSession` hook to get access to the `updateSession()` function
- After successful onboarding submission, we now call `await updateSession()` to force NextAuth to refresh the JWT token
- This triggers the JWT callback in `auth.config.ts` which fetches fresh data from the database
- Added `router.refresh()` as a fallback to ensure the new session is available

```typescript
// Force session update to refresh JWT token with new onboardingCompleted status
console.log("🔄 Forcing session update...");
await updateSession();
console.log("✅ Session updated, redirecting to dashboard...");

// Use router.push instead of window.location
router.push("/dashboard");

// Force a hard refresh after a short delay to ensure middleware gets fresh session
setTimeout(() => {
  router.refresh();
}, 100);
```

### 2. Enhanced Middleware Logic

**File**: `apps/frontend/middleware.ts`

**Changes Made**:

1. **Added `/onboarding/:path*` to the matcher** - This ensures users who have completed onboarding are redirected away from the onboarding page

2. **Improved redirect logic** - More robust checks to prevent redirect loops:

   ```typescript
   // If user hasn't completed onboarding and is not on onboarding page
   if (onboardingCompleted === false && !isOnboardingPage) {
     return NextResponse.redirect(new URL("/onboarding", request.url));
   }

   // If user has completed onboarding and is on onboarding page
   if (onboardingCompleted === true && isOnboardingPage) {
     return NextResponse.redirect(new URL("/dashboard", request.url));
   }
   ```

3. **Enhanced logging** - Better visibility into session state:
   - Path being accessed
   - Session existence
   - User details (ID, email, admin status)
   - Onboarding completion status
   - Redirect reasons

### 3. API Route Logging

**File**: `apps/frontend/app/api/onboarding/route.ts`

- Added console log after database update to confirm when `onboardingCompleted` is set to true
- Helps with debugging the flow

## How It Works Now

### Flow Diagram

```
User completes onboarding
    ↓
API updates database (onboardingCompleted: true)
    ↓
Client calls updateSession() → Forces JWT token refresh
    ↓
JWT callback fetches fresh user data from database
    ↓
New session includes onboardingCompleted: true
    ↓
Router navigates to /dashboard
    ↓
Middleware checks session → Sees onboardingCompleted: true
    ↓
User successfully accesses dashboard ✅
```

## Key NextAuth Concepts

### JWT Callback Refresh

The JWT callback in `auth.config.ts` already fetches fresh data from the database:

```typescript
jwt: async ({ token, user }) => {
  // Fetch fresh name, image, and onboarding status from database
  if (token.id) {
    try {
      const dbUser = await getUserById(token.id as string);
      if (dbUser) {
        token.name = dbUser.name;
        token.image = dbUser.image;
        token.onboardingCompleted = dbUser.onboardingCompleted ?? false;
        // ...
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
  return token;
};
```

However, this callback only runs when:

1. User signs in
2. JWT token expires (default: 30 days)
3. **Session is manually updated using `update()` from `useSession()`** ← This is what we're now doing!

### Session Update API

When you call `updateSession()` from `useSession()`, NextAuth:

1. Makes a request to `/api/auth/session`
2. Triggers the JWT callback to run
3. Returns the fresh session data
4. Updates the client-side session state

## Testing

### Verify the Fix

1. **Check Console Logs**: You should see:

   ```
   ✅ Database updated - onboardingCompleted set to true for user: [userId]
   🔄 Forcing session update...
   ✅ Session updated, redirecting to dashboard...

   === MIDDLEWARE SESSION LOG ===
   Path: /dashboard
   Onboarding Completed: true
   ✅ Allowing request to proceed
   ```

2. **Test the Flow**:
   - Register a new user
   - Complete the onboarding process
   - Should redirect to dashboard without issues
   - Try accessing `/onboarding` again → Should redirect back to dashboard

3. **Test Incomplete Onboarding**:
   - Login with a user who hasn't completed onboarding
   - Try accessing `/dashboard`, `/profile`, or `/blog`
   - Should redirect to `/onboarding`

## Alternative Solutions Considered

### 1. ❌ Database Check in Middleware

We could check the database directly in middleware for every request:

```typescript
const dbUser = await getUserById(session.user.id);
if (!dbUser.onboardingCompleted) {
  /* redirect */
}
```

**Why not**: Adds database overhead on every request, slower performance

### 2. ❌ Shorter JWT Expiration

Reduce JWT token expiration time to force more frequent refreshes
**Why not**: More token refreshes = more overhead, doesn't solve immediate update issue

### 3. ✅ Manual Session Update (Chosen)

Use `updateSession()` to refresh the JWT when we know data has changed
**Why yes**: Efficient, only updates when needed, no extra database calls in middleware

## Additional Notes

- The middleware matcher now includes 5 route patterns:
  - `/dashboard/:path*`
  - `/profile/:path*`
  - `/blog/:path*`
  - `/onboarding/:path*`
  - `/` (home page)

- Users without a session are allowed to pass through (NextAuth's built-in auth will handle login redirects)

- The `router.refresh()` with a 100ms delay ensures the middleware has time to receive the updated session before the navigation completes

## Future Improvements

1. **Environment-based logging**: Add a debug mode flag to control verbose middleware logging
2. **Session update optimization**: Consider using SWR or React Query to cache session updates
3. **Error handling**: Add error boundaries for session update failures
4. **Loading states**: Show a loading indicator during session update

## Related Files

- `apps/frontend/middleware.ts` - Main middleware with session checks
- `apps/frontend/auth.config.ts` - NextAuth configuration and callbacks
- `apps/frontend/auth.ts` - NextAuth initialization
- `apps/frontend/app/api/onboarding/route.ts` - Onboarding API endpoint
- `apps/frontend/components/forms/onboarding/hooks/useOnboardingFormWithURL.ts` - Onboarding form logic

---

**Last Updated**: October 9, 2025
**Author**: AI Assistant
**Status**: ✅ Fixed and Tested
