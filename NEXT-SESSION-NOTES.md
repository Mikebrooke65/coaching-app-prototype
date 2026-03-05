# Next Session Action Plan

## Issue: Reporting and Announcements Pages Not Loading

### Current Status
- URL changes correctly to `/desktop/reporting` and `/desktop/announcements`
- No JavaScript errors in console
- No console.log messages appearing (even from working pages)
- Pages are blank/white
- Code is correct and identical to working pages
- Routes are configured correctly
- Imports are correct

### Things to Try (in order)

1. **Test locally first**
   ```bash
   npm run dev
   ```
   - Navigate to http://localhost:5173/desktop/reporting
   - If it works locally, it's a deployment issue
   - If it doesn't work locally, it's a code issue

2. **Check if components are being tree-shaken**
   - Build locally: `npm run build`
   - Check dist folder for the components
   - Search in built JS files for "Reporting" and "Announcements"

3. **Try renaming the components**
   - Maybe "Reporting" and "Announcements" conflict with something
   - Rename to "ReportingPage" and "AnnouncementsPage"
   - Update imports and exports

4. **Compare file sizes**
   - Reporting.tsx is very large (lots of mock data)
   - Try simplifying to minimal version
   - If minimal works, add back complexity gradually

5. **Check React Router v7 specific issues**
   - Maybe these routes need lazy loading
   - Try: `const Reporting = lazy(() => import('../pages/desktop/Reporting'))`

6. **Force re-render with different key**
   - Try adding unique keys to these specific routes
   - Or wrap in Suspense boundary

### Working Pages for Reference
- SessionBuilder.tsx - Works ✓
- LessonBuilder.tsx - Works ✓
- TeamsManagement.tsx - Works ✓
- UserManagement.tsx - Works ✓

### Files to Check
- `src/pages/desktop/Reporting.tsx` (263 lines)
- `src/pages/desktop/Announcements.tsx` (263 lines)
- `src/routes/index.tsx` (route config)
- `src/layouts/DesktopLayout.tsx` (has key={location.pathname})

### Session Persistence Issue (Priority 2)
After fixing page loading, tackle this:
- User gets logged out on page refresh
- Session exists in localStorage
- Need to fix auth initialization in AuthContext.tsx
