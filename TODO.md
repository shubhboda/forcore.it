# Login Fix TODO
## Status: [IN PROGRESS]

### 1. [PENDING] Verify Supabase Auth Config
- [ ] Dashboard > Auth > Email > **DISABLE Confirm email** (dev)
- [ ] Run `supabase/SETUP_QUERIES.sql`
- [ ] Run `supabase/00_FIX_AUTH_AND_PROFILES.sql`

### 2. [PENDING] Create Test Admin User
- [ ] Email: `support.forcor.it@gmail.com`
- [ ] Signup or reset password in Supabase Dashboard

### 3. [PENDING] Test Frontend
- [ ] Restart dev server (`Ctrl+C`, `npm run dev`)
- [ ] http://localhost:5175/login → Email+pw → ✅

### 4. [PENDING] Debug 400 Error
- [ ] Browser F12 > Network > auth/v1/token → Response body
- [ ] Console errors post-fix

**Next: User to run Supabase fixes → Reply with Network tab response body.**

