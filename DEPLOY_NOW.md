# 🚀 Deploy to Vercel - Final Instructions

## Changes Made

### 1. Simplified vercel.json ✅
- Removed `functions` configuration (not needed for App Router)
- Kept only headers configuration

### 2. Added vercel-build Script ✅
- Custom build command that copies templates after build
- Ensures `LiveCode-starters` is in the right location

### 3. Created .nftignore ✅
- Tells Next.js file tracing to include everything
- Prevents accidental exclusion of templates

### 4. Added Vercel-Specific Copy Script ✅
- `scripts/copy-templates-vercel.js`
- Copies templates to both standalone and server directories
- Runs automatically during Vercel build

## Deploy Commands

```bash
# Commit all changes
git add .
git commit -m "Final Vercel deployment fix with vercel-build script"
git push origin main
```

## What Happens During Deployment

1. **Install**: `npm install`
2. **Build**: `next build` (via vercel-build script)
3. **Copy**: Templates copied to `.next/standalone` and `.next/server`
4. **Deploy**: Vercel deploys with templates included

## Expected Build Output

```
📦 [Vercel Build] Copying LiveCode-starters templates...
   Source: /vercel/path0/LiveCode-starters
   CWD: /vercel/path0
   Copying to standalone: /vercel/path0/.next/standalone/LiveCode-starters
✅ Templates copied to standalone build
   Copying to server: /vercel/path0/.next/server/LiveCode-starters
✅ Templates copied to server build
✅ [Vercel Build] Template copy complete
```

## Verification After Deploy

### 1. Check Build Logs
Look for the template copy messages above

### 2. Test Template Loading
1. Go to your deployed site
2. Create a new playground
3. Select any template
4. Verify it loads without errors

### 3. Check Function Logs
In Vercel Dashboard → Functions:
```
✅ Found template at: /var/task/LiveCode-starters/express-simple
```

## If It Still Fails

### Fallback Option: Move to Public Folder

If templates still don't load, move them to the public folder:

```bash
# Move templates
mv LiveCode-starters public/LiveCode-starters

# Update src/template.ts
# Change paths to: 'public/LiveCode-starters/...'

# Commit and deploy
git add .
git commit -m "Move templates to public folder"
git push origin main
```

## Environment Variables

Ensure these are set in Vercel Dashboard:

```env
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=https://your-app.vercel.app
GITHUB_ID=your_github_id
GITHUB_SECRET=your_github_secret
```

## Success Indicators

✅ Build completes without errors
✅ No "unmatched function pattern" errors
✅ Template copy messages in build logs
✅ Playground loads successfully
✅ Templates appear in editor

## Troubleshooting

### Build Fails
- Check if `scripts/copy-templates-vercel.js` exists
- Verify `LiveCode-starters` folder is in repo
- Check `.vercelignore` includes `!LiveCode-starters`

### Templates Not Found
- Check Vercel function logs for path errors
- Verify build logs show template copy
- Try the public folder fallback

### 500 Errors
- Check function logs in Vercel Dashboard
- Look for "Current directory contents" log
- Verify environment variables are set

---

## 🎯 READY TO DEPLOY

```bash
git push origin main
```

**Expected Result**: Successful deployment with working templates

---

**Last Updated**: December 2024
**Method**: vercel-build script with template copying
**Confidence**: HIGH
