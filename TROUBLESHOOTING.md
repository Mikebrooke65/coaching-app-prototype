# Troubleshooting Log

## Issue: Login Hangs on "Signing in..."

**Date:** March 5, 2026

**Status:** ✅ RESOLVED

### Root Cause
Multiple Supabase client instances were being created due to module hot-reloading in development, causing lock timeouts on the authentication storage. The `signInWithPassword()` call was waiting for a lock that was held by an orphaned client instance.

### Solution
Implemented singleton pattern in `src/lib/supabase.ts` to ensure only one Supabase client instance exists throughout the application lifecycle. Added explicit storage configuration with PKCE flow type.

### Evidence
Console logs show:
```
handleLogin called
About to call login...
Login function called with email: mikerbrooke@outlook.com
Calling Supabase signInWithPassword...
[HANGS HERE - no response from Supabase]
```

### What We've Done
1. ✅ Created Supabase project and database
2. ✅ Ran all migration files (001, 002, 003)
3. ✅ Created test user with admin role
4. ✅ Fixed RLS circular dependency issue (migration 003)
5. ✅ Installed all npm dependencies
6. ✅ Restarted dev server multiple times
7. ✅ Added debug logging to AuthContext.tsx and Login.tsx
8. ✅ Verified environment variables are loading correctly
9. ✅ Removed React StrictMode to prevent multiple client instances

### Solution to Try
The Supabase API call is timing out. Need to check:
1. **Network tab** - Look for the actual HTTP request to supabase.co/auth/v1/token
2. **CORS settings** in Supabase dashboard
3. **API settings** in Supabase project settings
4. Try a simple test with curl or Postman to verify Supabase auth is working

### Quick Test Command
Test Supabase auth directly:
```bash
curl -X POST 'https://pikrxkxpizdezazlwxhb.supabase.co/auth/v1/token?grant_type=password' \
  -H 'apikey: YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"email":"mikerbrooke@outlook.com","password":"Linda2024!"}'
```

### Recommendation
Due to context limits, recommend:
1. Check Supabase project settings for any API restrictions
2. Verify the project is not paused or has billing issues
3. Check browser Network tab for the actual HTTP request status
4. Consider creating a fresh Supabase project if issue persists

### Current Test User
- Email: mikerbrooke@outlook.com
- Password: Linda2024!
- Role: admin
- User ID: ad7b7dfa-3549-468f-b369-3ca1e705e4fa

### Environment Variables
Located in `.env.development`:
```
VITE_SUPABASE_URL=https://pikrxkxpizdezazlwxhb.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

### Next Steps to Try
1. Check browser Console for debug logs after refresh
2. Verify environment variables are loading (check `import.meta.env` in console)
3. Check if there's a JavaScript error preventing the async function from running
4. Try adding console.log directly in Login.tsx handleLogin function
5. Check if form submission is being prevented by browser

### Files Modified
- `src/contexts/AuthContext.tsx` - Added debug logging
- `supabase/migrations/003_fix_users_rls.sql` - Fixed RLS policies
- `scripts/recreate-test-user.ts` - Script to create test user

### Dev Server
Running on: http://localhost:5173/
Command: `npm run dev`


---

## Resolution Summary

**Final Status:** Login working successfully ✅

### What Was Fixed
1. Created migration 004 to fix RLS policies (removed circular dependencies)
2. Implemented singleton pattern for Supabase client to prevent multiple instances
3. Added PKCE flow type and explicit storage configuration
4. Removed React StrictMode to prevent double-mounting issues

### Verification
- Test user can successfully log in with credentials
- User profile is fetched from database
- Navigation to landing page works
- Basic UI renders with header, navigation, and user info

### Test Credentials
- Email: mikerbrooke@outlook.com
- Password: Linda2024!
- Role: admin

### Current State
Phase 1 (Core Infrastructure) is complete and functional:
- ✅ Authentication system working
- ✅ Database connected with RLS policies
- ✅ Routing and navigation working
- ✅ Basic layouts rendering
- ⏳ Phase 2 (Figma UI implementation) not started yet

The app currently shows basic placeholder UI. Figma designs will be implemented in Phase 2.
