# Admin Panel Setup Guide

## Admin Email
**shubhboda@gmail.com** — Login with this email to access Admin Panel. All other users go to User Panel (homepage).

---

## 1. Supabase Configuration

### .env
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_anon_key
```

### Database Schema
1. Supabase Dashboard → **SQL Editor**
2. Run `supabase/full-schema.sql` (creates: contacts, projects, plans, user_profiles + RLS)

### Storage (for project images)
1. Dashboard → **Storage** → **New bucket**
2. Name: `project-images`, Public: **Yes**
3. **Policies** → New policy:
   - **SELECT**: Public (allows read)
   - **INSERT**: `auth.jwt() ->> 'email' = 'shubhboda@gmail.com'`
   - **DELETE**: Same as INSERT

### Realtime (optional – live message updates)
1. Dashboard → **Database** → **Replication**
2. Add `contacts` table to publication

### Google OAuth (optional)
1. Dashboard → **Authentication** → **Providers** → **Google**
2. Enable, add Client ID & Secret from Google Cloud Console
3. Add redirect URL: `http://localhost:5173` (dev) and your production URL

---

## 2. Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | User Panel – homepage |
| `/login` | Public | Login |
| `/signup` | Public | Sign up |
| `/admin` | Admin only | Dashboard |
| `/admin/messages` | Admin only | User messages (real-time) |
| `/admin/projects` | Admin only | Our Work CRUD + image upload |
| `/admin/plans` | Admin only | Pricing plans CRUD |
| `/admin/users` | Admin only | Registered users |

---

## 3. Features

### Authentication
- Login / Signup (email + password)
- **Show Password** toggle on login form
- Google Login (if enabled)
- Admin → Admin Panel, Others → User Panel

### Admin Panel
- **Dashboard**: Users, projects, plans, messages; recent messages table
- **Messages**: All contact form submissions, real-time updates
- **Our Work**: Add/Edit/Delete projects, **upload images** or paste URL
- **Pricing Plans**: Add/Edit/Delete plans
- **Users**: View all registered users

### User Panel
- Login / Signup
- Google Login
- Contact form → saves to Supabase, appears in Admin Messages
- Dynamic Projects & Pricing from database

---

## 4. Troubleshooting

### "Database error saving new user" on Signup
1. Supabase Dashboard → **SQL Editor** → **New query**
2. Paste & run:
   ```sql
   DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
   DROP POLICY IF EXISTS "Allow insert own profile" ON user_profiles;
   CREATE POLICY "Allow insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
   ```
3. Try Sign Up again

---

## 5. Data Flow

- **Contacts**: User submits form → contacts table → Admin sees in Messages
- **Projects**: Admin CRUD → `projects` table → Homepage "Our Work"
- **Plans**: Admin CRUD → `plans` table → Homepage Pricing
- **Images**: Admin uploads to Storage → public URL stored in `projects.image_url`
- **Users**: Sign up → app creates profile in `user_profiles` (no DB trigger needed)
