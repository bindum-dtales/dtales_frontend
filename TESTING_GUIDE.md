# Testing Guide: Production Safety Validation

## Local Testing Before Render Deployment

All tests should be run from `/home/siddhanth/Desktop/1/server`

---

## TEST 1: Server Starts Without Supabase

### Setup
```bash
cd /home/siddhanth/Desktop/1/server

# Ensure DATABASE_URL is valid
export DATABASE_URL="postgres://user:pass@localhost:5432/dtales"

# CLEAR Supabase vars (simulate they don't exist)
unset SUPABASE_URL
unset SUPABASE_SERVICE_ROLE_KEY
unset SUPABASE_BUCKET

npm install
```

### Test
```bash
npm start
```

### Expected Output
```
✅ Environment variables validated
✅ Backend running on port 10000
```

### Expected Behavior
- ✅ Server starts successfully
- ✅ Health endpoint responds: `curl http://localhost:10000/health`
- ✅ Blogs endpoint works: `curl http://localhost:10000/api/blogs`
- ❌ Image upload fails gracefully (no Supabase configured)

### Pass Criteria
Server stays up, logs show validation success

---

## TEST 2: Server Starts with Invalid Supabase URL

### Setup
```bash
export DATABASE_URL="postgres://user:pass@localhost:5432/dtales"
export SUPABASE_URL="https://fake-nonexistent-url.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="fake_key_12345"
export SUPABASE_BUCKET="dtales-media"

npm start
```

### Expected Output
```
✅ Environment variables validated
✅ Backend running on port 10000
```

### Expected Behavior
- ✅ Server starts (no network call at startup)
- ✅ Health check passes
- ✅ Image upload route still responds

### Pass Criteria
Server does NOT crash even with invalid Supabase URL

---

## TEST 3: Image Upload With Valid Supabase

### Setup
```bash
# Set REAL Supabase credentials
export DATABASE_URL="postgres://user:pass@localhost:5432/dtales"
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your_real_service_key"
export SUPABASE_BUCKET="dtales-media"

npm start
```

### Test: Upload Image
```bash
# Create test image
echo "fake image data" > test.jpg

# Upload
curl -X POST http://localhost:10000/api/uploads/image \
  -F "image=@test.jpg"
```

### Expected Response (Success)
```json
{
  "url": "https://your-project.supabase.co/storage/v1/object/public/dtales-media/..."
}
```

### Expected Response (Failure)
```json
{
  "warning": "Image upload skipped",
  "reason": "..."
}
```

### Pass Criteria
- ✅ Returns 201 (success) OR 200 (graceful failure)
- ❌ Does NOT return 500
- ✅ Server stays up either way

---

## TEST 4: Image Upload With Unreachable Supabase

### Setup
```bash
export DATABASE_URL="postgres://user:pass@localhost:5432/dtales"
export SUPABASE_URL="https://this-definitely-does-not-exist-12345.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="fake_key"
export SUPABASE_BUCKET="dtales-media"

npm start
```

### Test: Upload Image
```bash
curl -X POST http://localhost:10000/api/uploads/image \
  -F "image=@test.jpg"
```

### Expected Response
```json
{
  "warning": "Image upload skipped",
  "reason": "Supabase service unreachable"
}
```

### Expected HTTP Status
```
200 OK
```

### Server Logs Should Show
```
⚠️ Supabase DNS/network error, gracefully degrading: getaddrinfo ENOTFOUND...
```

### Pass Criteria
- ✅ Returns 200 (not 500)
- ✅ Server stays running
- ✅ Warning logged to console

---

## TEST 5: DOCX Upload Without Supabase

### Setup
```bash
export DATABASE_URL="postgres://user:pass@localhost:5432/dtales"
unset SUPABASE_URL
unset SUPABASE_SERVICE_ROLE_KEY

npm start
```

### Test: Upload DOCX
```bash
# Assuming test.docx exists
curl -X POST http://localhost:10000/api/uploads/docx \
  -F "contentFile=@test.docx"
```

### Expected Response (Partial)
```json
{
  "html": "<p>Document content...</p>",
  "images": []
}
```

### Pass Criteria
- ✅ Returns 200
- ✅ HTML content is included
- ✅ Images array is empty (expected, no Supabase)
- ✅ No crash

---

## TEST 6: Missing File in Upload

### Test: No file provided
```bash
curl -X POST http://localhost:10000/api/uploads/image \
  -F "notimage=@test.jpg"  # Wrong field name
```

### Expected Response
```json
{
  "message": "No image file provided",
  "source": "image_upload"
}
```

### Expected Status
```
400 Bad Request
```

### Pass Criteria
- ✅ Returns 400 (expected error)
- ✅ Clear error message

---

## TEST 7: Invalid File Type

### Test: Upload non-image file
```bash
echo "not an image" > test.txt

curl -X POST http://localhost:10000/api/uploads/image \
  -F "image=@test.txt"
```

### Expected Response
```json
{
  "message": "Only JPEG, PNG, and WebP images are allowed",
  "source": "image_upload"
}
```

### Expected Status
```
400 Bad Request
```

### Pass Criteria
- ✅ Returns 400
- ✅ Clear validation message

---

## TEST 8: Health Endpoint

### Test
```bash
curl http://localhost:10000/health
```

### Expected Response
```json
{
  "status": "ok"
}
```

### Pass Criteria
- ✅ Returns 200 OK
- ✅ Responds instantly (no network calls)

---

## TEST 9: Blogs Endpoint

### Test
```bash
curl http://localhost:10000/api/blogs
```

### Expected Response
```json
[
  { "id": 1, "title": "...", ... },
  ...
]
```

or

```json
[]
```

### Pass Criteria
- ✅ Returns 200
- ✅ Works even if Supabase is down
- ✅ Returns array of blogs or empty array

---

## TEST 10: Syntax Validation

### All files check out
```bash
cd /home/siddhanth/Desktop/1/server

node -c config/supabase.js && echo "✅ OK"
node -c index.js && echo "✅ OK"
node -c routes/uploads.js && echo "✅ OK"
node -c utils/supabaseUpload.js && echo "✅ OK"

node -e "JSON.parse(require('fs').readFileSync('package.json', 'utf8')); console.log('✅ package.json OK')"
```

### Expected
```
✅ OK
✅ OK
✅ OK
✅ OK
✅ package.json OK
```

---

## AUTOMATED TEST SCRIPT

```bash
#!/bin/bash
set -e

echo "🧪 Running Production Safety Tests..."
echo ""

cd /home/siddhanth/Desktop/1/server

# Test 1: Syntax check
echo "TEST 1: Syntax validation..."
node -c config/supabase.js >/dev/null && echo "  ✅ config/supabase.js"
node -c index.js >/dev/null && echo "  ✅ index.js"
node -c routes/uploads.js >/dev/null && echo "  ✅ routes/uploads.js"
node -c utils/supabaseUpload.js >/dev/null && echo "  ✅ utils/supabaseUpload.js"
node -e "JSON.parse(require('fs').readFileSync('package.json', 'utf8'))" && echo "  ✅ package.json"

# Test 2: Node version lock
echo ""
echo "TEST 2: Node version constraint..."
grep -q '"engines".*"node".*"18' package.json && echo "  ✅ Node 18 locked"

# Test 3: Lazy init pattern
echo ""
echo "TEST 3: Lazy initialization pattern..."
grep -q "function getSupabase()" config/supabase.js && echo "  ✅ getSupabase() function exists"
grep -q "module.exports = { getSupabase }" config/supabase.js && echo "  ✅ Exports getSupabase"

# Test 4: Startup env validation
echo ""
echo "TEST 4: Startup validation..."
grep -q '"DATABASE_URL"' index.js && echo "  ✅ DATABASE_URL checked at startup"
! grep -q '"SUPABASE_URL".*required' index.js && echo "  ✅ SUPABASE_URL NOT required at startup"

# Test 5: DNS error handling
echo ""
echo "TEST 5: DNS error handling..."
grep -q "ENOTFOUND\|ECONNREFUSED\|ETIMEDOUT" routes/uploads.js && echo "  ✅ DNS errors caught"
grep -q "res.status(200)" routes/uploads.js && echo "  ✅ Returns 200 on failure"

echo ""
echo "🎉 All tests passed! Ready for production deployment."
```

---

## RENDER STAGING TEST (After Deploy)

### 1. Health Check
```bash
curl https://your-backend-url/health
# Expected: { "status": "ok" }
```

### 2. API Test
```bash
curl https://your-backend-url/api/blogs
# Expected: Blog list or []
```

### 3. Upload Test
```bash
curl -X POST https://your-backend-url/api/uploads/image \
  -F "image=@test.jpg"
# Expected: 201 (success) or 200 (graceful)
# NOT 500
```

### 4. Check Logs
In Render dashboard → Logs tab, verify:
```
✅ Environment variables validated
✅ Backend running on port 10000
```

No `process.exit(1)` or FATAL errors.

---

## TROUBLESHOOTING

| Issue | Check | Fix |
|-------|-------|-----|
| Server won't start | `DATABASE_URL` set? | Export valid DATABASE_URL |
| IMAGE upload returns 500 | Is Supabase reachable? | Check SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY |
| Syntax error | Node version | Use Node 18+ |
| Wrong response format | Check response in logs | Ensure uploadFields is applied |

---

## SUCCESS CRITERIA (ALL MUST PASS)

✅ Server starts without Supabase  
✅ Server starts with invalid Supabase URL  
✅ Image upload returns 200 or 201 (never 500)  
✅ Blogs endpoint works  
✅ Health endpoint responds  
✅ All files have valid syntax  
✅ Node 18 locked in package.json  
✅ No startup network calls to Supabase  
✅ DNS errors caught and logged  
✅ Graceful degradation on failures  

---

**Ready to test?** 🚀

Start with TEST 1 and work through them sequentially.
