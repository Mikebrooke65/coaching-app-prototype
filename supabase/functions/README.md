# Supabase Edge Functions

This directory contains Supabase Edge Functions for secure server-side operations.

## Functions

### 1. create-user
Creates a single user in Supabase Auth and the users table.

**Endpoint**: `/functions/v1/create-user`

**Method**: POST

**Auth**: Requires admin role

**Body**:
```json
{
  "email": "user@example.com",
  "password": "optional-password",
  "first_name": "John",
  "last_name": "Doe",
  "role": "player",
  "active": true,
  "cellphone": "021-123-4567",
  "team_id": "uuid-of-team"
}
```

**Response**:
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

### 2. bulk-create-users
Creates multiple users in batch from CSV data.

**Endpoint**: `/functions/v1/bulk-create-users`

**Method**: POST

**Auth**: Requires admin role

**Body**:
```json
{
  "users": [
    {
      "email": "user1@example.com",
      "password": "optional",
      "first_name": "John",
      "last_name": "Doe",
      "role": "player",
      "active": true,
      "cellphone": "021-123-4567",
      "team_name": "Rangers U10"
    },
    ...
  ]
}
```

**Response**:
```json
{
  "success": 5,
  "failed": 2,
  "errors": [
    { "email": "bad@example.com", "error": "Invalid email" }
  ],
  "created_users": [
    { "id": "uuid", "email": "user1@example.com", ... }
  ]
}
```

## Deployment

### Prerequisites
1. Install Supabase CLI: `npm install -g supabase`
2. Login to Supabase: `supabase login`
3. Link your project: `supabase link --project-ref YOUR_PROJECT_REF`

### Deploy Functions

Deploy all functions:
```bash
supabase functions deploy
```

Deploy a specific function:
```bash
supabase functions deploy create-user
supabase functions deploy bulk-create-users
```

### Set Environment Variables

The functions need access to the Supabase URL and Service Role Key. These are automatically available in the Deno runtime as:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

No additional configuration needed!

### Test Functions

Test locally:
```bash
supabase functions serve create-user
```

Test with curl:
```bash
curl -i --location --request POST 'http://localhost:54321/functions/v1/create-user' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"email":"test@example.com","first_name":"Test","last_name":"User"}'
```

## Security

- Both functions verify the caller is authenticated
- Both functions check the caller has admin role
- Service role key is only used server-side (never exposed to client)
- Failed auth user creations are rolled back automatically

## Usage in App

The UserManagement component automatically calls these functions when:
1. Admin clicks "Add User" and fills the form
2. Admin clicks "Import CSV" and pastes CSV data

No additional configuration needed in the app - it uses the Supabase URL from environment variables.
