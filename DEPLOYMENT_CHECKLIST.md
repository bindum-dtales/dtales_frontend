# Render Deployment Checklist

## Pre-Deployment Verification ✅

All syntax checks passed:
- ✅ server/config/supabase.js
- ✅ server/index.js
- ✅ server/routes/uploads.js
- ✅ server/utils/supabaseUpload.js
- ✅ server/package.json

---

## Render Config Vars (Set These)

Add the following **Environment Variables** in your Render deployment settings:

```
DATABASE_URL=postgres://user:pass@host:port/db
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sb_secret_****
SUPABASE_BUCKET=dtales-media
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

⚠️ **CRITICAL**: 
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are **optional at startup**
- If missing, server still starts; upload routes gracefully degrade
- `DATABASE_URL` is **required** at startup

---

## Post-Deployment Verification

### 1. Health Check
```bash
curl https://your-backend-url/health
# Expected: { "status": "ok" }
```

### 2. API Availability
```bash
curl https://your-backend-url/api/blogs
# Expected: Blogs list (or empty array)
# Should NOT crash even if Supabase is down
```

### 3. Image Upload Test
```bash
curl -X POST https://your-backend-url/api/uploads/image \
  -F "image=@test.jpg"
# Expected: Either { "url": "..." } or { "warning": "..." }
# Should NEVER return 500 error
```

### 4. Monitor Logs
Check Render logs for:
- ✅ `✅ Environment variables validated`
- ✅ `Backend running on port 10000` (or $PORT)
- ⚠️ Any `⚠️ Supabase DNS/network error` warnings (graceful, not fatal)
- ❌ NO `❌ STARTUP FAILED` messages

---

## Rollback Instructions

If deployment fails:

1. **Revert to previous version**:
   ```bash
   git revert HEAD
   git push
   ```

2. **Or manually restore files**:
   - server/package.json
   - server/config/supabase.js
   - server/index.js
   - server/routes/uploads.js
   - server/utils/supabaseUpload.js

3. **Trigger re-deploy** in Render dashboard

---

## What Changed

| File | Change | Impact |
|------|--------|--------|
| `server/package.json` | Added `"engines": { "node": "18.x" }` | Locks Node version for Render |
| `server/config/supabase.js` | Converted to `getSupabase()` function | Lazy initialization (no startup network calls) |
| `server/index.js` | Removed Supabase from required env vars | Server starts even if Supabase is down |
| `server/routes/uploads.js` | Added lazy Supabase init + DNS error handling | Graceful degradation on failures |
| `server/utils/supabaseUpload.js` | Added `supabase` parameter | Stateless function, no global dependency |

---

## Success Criteria

✅ Server starts without Supabase  
✅ Server starts with unreachable Supabase  
✅ Image uploads fail gracefully (200 with warning)  
✅ Blog/case study creation succeeds despite upload failure  
✅ DOCX parsing works without Supabase  
✅ No DNS errors cause process exit  
✅ All logs are clear and actionable  

---

## Support

If deployment issues occur:

1. Check Render logs for error messages
2. Verify all Config Vars are set
3. Ensure DATABASE_URL is correct and reachable
4. Try POST to `/api/uploads/image` with test file - should return 200 or 201, never 500
5. If Supabase errors appear in logs, verify SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY

---

**Status**: 🚀 Ready for Production Deployment
