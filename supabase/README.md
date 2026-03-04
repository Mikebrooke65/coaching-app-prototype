# Supabase Database Setup

This folder contains SQL migration files to set up your database schema.

## How to Run Migrations

### Option 1: Using Supabase Dashboard (Easiest)

1. Go to your Supabase project: https://pikrxkxpizdezazlwxhb.supabase.co
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `migrations/001_initial_schema.sql`
5. Click **Run** (or press Ctrl+Enter)
6. Wait for it to complete (should take a few seconds)
7. Repeat steps 3-6 for `migrations/002_rls_policies.sql`

### Option 2: Using Supabase CLI (Advanced)

If you have the Supabase CLI installed:

```bash
supabase db push
```

## What These Migrations Do

### 001_initial_schema.sql
- Creates all database tables (users, teams, sessions, lessons, etc.)
- Sets up relationships between tables
- Creates indexes for performance
- Inserts initial skill categories

### 002_rls_policies.sql
- Enables Row-Level Security on all tables
- Creates security policies to control who can access what data
- Ensures coaches can't see other coaches' private records
- Gives admins full access to manage the system

## Verify Setup

After running migrations, you should see these tables in your Supabase dashboard:

- users
- teams
- user_teams
- skills (with 6 initial categories)
- sessions
- lessons
- lesson_sessions
- delivery_records
- session_feedback
- lesson_feedback
- game_feedback
- announcements
- player_caregivers

## Next Steps

After migrations are complete:
1. Create your first admin user (see instructions below)
2. Test the connection from your React app
3. Start building features!

## Creating Your First Admin User

You'll need to create an admin user to access the system. This will be done through the app once authentication is set up, but for now you can create one manually:

1. Go to **Authentication** > **Users** in Supabase dashboard
2. Click **Add user** > **Create new user**
3. Enter email and password
4. After user is created, go to **SQL Editor**
5. Run this query (replace the email with your admin email):

```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-admin-email@example.com';
```

## Troubleshooting

**Error: "relation already exists"**
- Tables already exist. You can either drop them first or skip this migration.

**Error: "permission denied"**
- Make sure you're using the SQL Editor in Supabase dashboard
- The dashboard automatically uses the service role which has full permissions

**Error: "syntax error"**
- Make sure you copied the entire SQL file
- Check for any copy/paste issues
