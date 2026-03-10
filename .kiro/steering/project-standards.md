---
inclusion: auto
---

# Project Standards and Conventions

This document defines the core standards, conventions, and critical information for the West Coast Rangers Football Coaching App project. It should be referenced for all development work.

## Repository and Deployment

### Git Repository Configuration

**CRITICAL**: This project uses TWO GitHub repositories:

1. **Primary (Netlify)**: `github.com/Mikebrooke65/.kiro`
   - Connected to Netlify for production deployments
   - Branch: `prototype`
   - URL: https://wcrfootball.netlify.app

2. **Backup**: `github.com/Mikebrooke65/coaching-app-prototype`
   - Used for backup/alternative hosting
   - Not connected to Netlify

### Git Remotes

Required remotes configuration:
```
kiro    https://github.com/Mikebrooke65/.kiro.git (PRIMARY - for Netlify)
origin  https://github.com/Mikebrooke65/coaching-app-prototype.git (backup)
```

### Deployment Commands

**ALWAYS push to BOTH remotes**:
```bash
git push kiro prototype      # Required for Netlify deployment
git push origin prototype    # Backup
```

Or combined:
```bash
git push kiro prototype && git push origin prototype
```

## Database Architecture

### Table Usage Standards

**Team Assignments**:
- Use `team_members` table (NOT `user_teams`)
- `team_members` is the source of truth for team roster
- `user_teams` only used by AuthContext for profile loading

**Games and Events**:
- Games ARE events with `event_type = 'game'`
- Query `events` table, not `games` table
- `games` table exists but is not used for game data
- `game_feedback` references `events.id` via `game_id` field

### Display Formats

**Team Names**:
- Always display as: "Age Group + Team Name"
- Example: "U9 Lithium" (NOT "Lithium (U9)")
- Format: `{team.age_group} {team.name}`

**Game Events**:
- Home: "Your Team vs Opposition"
- Away: "Opposition vs Your Team"

## Code Conventions

### File Organization

**Migrations**:
- Location: `supabase/migrations/`
- Naming: `XXX_description.sql` (e.g., `024_add_scores_to_events.sql`)
- Must be run manually in Supabase SQL Editor
- Always commit migration files to git

**API Services**:
- Location: `src/lib/`
- Naming: `{feature}-api.ts` (e.g., `games-api.ts`, `events-api.ts`)
- Extend `ApiClient` base class

**Types**:
- Location: `src/types/database.ts`
- Keep in sync with database schema
- Export interfaces for all database tables

### Component Standards

**Mobile Pages**:
- Location: `src/pages/`
- Use brand colors: `#0091f3` (blue), `#ea7800` (orange), `#545859` (grey)
- Include bottom padding: `pb-20` for navigation clearance

**Desktop Pages**:
- Location: `src/pages/desktop/`
- Follow split-panel or table-based layouts
- Use consistent heading styles with colored borders

## Documentation Standards

### Required Updates

After ANY code changes, update:
1. `CHANGELOG.md` - User-facing changes
2. `CONVERSATION-HISTORY.md` - Technical decisions and journey
3. This file (if standards change)

### Changelog Format

```markdown
## [YYYY-MM-DD] - Feature Name

### Added
- New features

### Changed
- Modified features

### Fixed
- Bug fixes

### Technical Notes
- Implementation details
```

### Conversation History Format

```markdown
## Session: Date - Title

### Context
- Background information

### The Journey
- Problems encountered
- Solutions implemented

### Tasks Completed
- Numbered list of completed work

### Files Created/Modified
- List of changed files

### Technical Decisions
- Architecture choices
- Rationale
```

## Development Workflow

### Standard Development Process

1. **Make changes** in local dev environment
2. **Test locally**: `npm run dev`
3. **Run migrations** in Supabase (if any)
4. **Update documentation**: CHANGELOG.md, CONVERSATION-HISTORY.md
5. **Commit**: `git add -A && git commit -m "message"`
6. **Push to BOTH remotes**: `git push kiro prototype && git push origin prototype`
7. **Verify deployment** in Netlify dashboard

### Pre-Commit Checklist

- [ ] Code tested locally
- [ ] No console errors
- [ ] Database migrations run (if any)
- [ ] CHANGELOG.md updated
- [ ] CONVERSATION-HISTORY.md updated (for major changes)
- [ ] Committed with descriptive message
- [ ] Pushed to BOTH remotes (kiro + origin)

## Common Pitfalls

### ❌ Wrong: Pushing to Wrong Remote
```bash
git push origin prototype  # Only pushes to backup, NOT Netlify
```

### ✅ Correct: Push to Both
```bash
git push kiro prototype && git push origin prototype
```

### ❌ Wrong: Using user_teams for Team Queries
```typescript
.from('user_teams').select('*')
```

### ✅ Correct: Use team_members
```typescript
.from('team_members').select('team:teams(*)')
```

### ❌ Wrong: Querying games Table
```typescript
.from('games').select('*')
```

### ✅ Correct: Query events Table
```typescript
.from('events').select('*').eq('event_type', 'game')
```

### ❌ Wrong: Team Display Format
```typescript
`${team.name} (${team.age_group})`  // "Lithium (U9)"
```

### ✅ Correct: Team Display Format
```typescript
`${team.age_group} ${team.name}`  // "U9 Lithium"
```

## Key Technical Decisions

### Architecture Principles

1. **Events as Source of Truth**: All scheduled items (games, training, meetings) are events
2. **Games are Events**: Games are events with `event_type='game'` plus extra fields
3. **Single Team Table**: `team_members` is the authoritative source for team rosters
4. **Feedback Persistence**: One feedback record per team/player per game (update, don't duplicate)

### Database Design

- **RLS Policies**: All tables have Row Level Security enabled
- **Soft Deletes**: Use `deleted_at` timestamp, don't hard delete
- **Audit Fields**: Include `created_by`, `updated_by`, `created_at`, `updated_at`
- **Foreign Keys**: Use `ON DELETE CASCADE` for dependent data

## Environment Configuration

### Supabase
- Project: pikrxkxpizdezazlwxhb
- URL: Stored in `.env.development` and `.env.production`
- Keys: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

### Netlify
- Site: wcrfootball
- URL: https://wcrfootball.netlify.app
- Build: `npm run build`
- Publish: `dist/`

## Support Resources

- **Deployment Guide**: See `DEPLOYMENT-GUIDE.md`
- **Changelog**: See `CHANGELOG.md`
- **Conversation History**: See `CONVERSATION-HISTORY.md`
- **Kiro Handover**: See `KIRO_HANDOVER.md`

## Version History

- **2026-03-10**: Created project standards document
- **2026-03-10**: Documented dual repository setup and deployment workflow
- **2026-03-10**: Established database architecture standards
