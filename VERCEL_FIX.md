# Vercel Deployment Fix - Template Loading Issue

## Problem
The playground fails to load with error: "Failed to load playground data" because the `LiveCode-starters` folder is not accessible in Vercel's serverless environment.

## Root Cause
Vercel serverless functions have limited file system access. The `LiveCode-starters` folder needs to be explicitly included in the function bundle.

## Solution Applied

### 1. Updated API Route (`src/app/api/template/[id]/route.ts`)
- Added multiple path resolution attempts
- Tries different possible locations for templates
- Better error logging with directory contents
- Graceful fallback handling

### 2. Updated `vercel.json`
- Added explicit `includeFiles` for both source and compiled paths
- Ensures templates are bundled with the serverless function

### 3. Fixed Ollama Client-Side Checks
- Ollama checks now only run on localhost (development)
- Production skips client-side Ollama checks (prevents browser errors)
- Server-side checks remain for actual AI functionality

## Deploy Steps

1. **Commit changes**:
   ```bash
   git add .
   git commit -m "Fix template loading on Vercel"
   git push origin main
   ```

2. **Redeploy on Vercel**:
   - Vercel will auto-deploy from GitHub
   - OR use: `vercel --prod`

3. **Check deployment logs**:
   - Look for: `✅ Found template at: ...`
   - If you see `❌ Template not found`, check the logs for directory contents

## Verification

After deployment, check the function logs in Vercel Dashboard:

1. Go to your project → Deployments → Latest
2. Click on "Functions" tab
3. Find the template API function
4. Look for these log messages:
   ```
   ✅ Found template at: /var/task/LiveCode-starters/express-simple
   Template loading: { templateKey: 'EXPRESS', ... }
   ```

## If Still Not Working

### Option 1: Check Vercel Logs
```bash
vercel logs your-deployment-url
```

Look for the error message and the "Current directory contents" log.

### Option 2: Move Templates to Public Folder
If `includeFiles` doesn't work, move templates to `public/`:

1. Move `LiveCode-starters` to `public/LiveCode-starters`
2. Update `src/template.ts`:
   ```typescript
   export const templatePaths = {
       REACTJS: 'public/LiveCode-starters/react-ts',
       // ... etc
   }
   ```

### Option 3: Use Environment Variable
Set a custom path in Vercel environment variables:
```
TEMPLATES_PATH=/var/task/LiveCode-starters
```

Then use it in the API route:
```typescript
const basePath = process.env.TEMPLATES_PATH || 'LiveCode-starters';
```

## Testing Locally

Test the fix locally before deploying:

```bash
# Build the project
npm run build

# Start production server
npm run start

# Test template API
curl http://localhost:3000/api/template/YOUR_PLAYGROUND_ID
```

## Common Errors

### Error: "Template not found at: ..."
**Solution**: Check that `LiveCode-starters` is at the project root and not in `.gitignore`

### Error: "ENOENT: no such file or directory"
**Solution**: Verify `includeFiles` pattern in `vercel.json` is correct

### Error: "Invalid JSON Structure"
**Solution**: Check that template files are valid and readable

## Success Indicators

✅ No "ERR_BLOCKED_BY_CLIENT" errors in browser console
✅ Playground loads without "Something went wrong" error
✅ Template files are accessible
✅ No 500 errors from `/api/template/[id]`

---

**Last Updated**: December 2024
