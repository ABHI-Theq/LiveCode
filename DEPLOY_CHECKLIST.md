# 🚀 Quick Deployment Checklist

## Before Deploying

- [ ] Ensure `LiveCode-starters` folder exists at project root
- [ ] Verify all template folders are present:
  - [ ] `LiveCode-starters/express-simple`
  - [ ] `LiveCode-starters/hono-nodejs-starter`
  - [ ] `LiveCode-starters/nextjs`
  - [ ] `LiveCode-starters/react-ts`
  - [ ] `LiveCode-starters/vue`
  - [ ] `LiveCode-starters/angular`

## Environment Variables (Vercel Dashboard)

Set these in Vercel → Project Settings → Environment Variables:

```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-random-secret-here
NEXTAUTH_URL=https://your-app.vercel.app
GITHUB_ID=your_github_oauth_id
GITHUB_SECRET=your_github_oauth_secret
```

## Deploy Commands

### Option 1: Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Option 2: Git Push
```bash
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

## After Deployment

1. **Check Build Logs**
   - Look for: `✅ Templates copied successfully`

2. **Test Template Loading**
   - Create a new playground
   - Select any template
   - Verify it loads without errors

3. **Check Function Logs**
   - Vercel Dashboard → Functions
   - Look for template API logs

## If Something Goes Wrong

1. Check Vercel function logs for errors
2. Verify `LiveCode-starters` is included in build
3. Test locally with `vercel dev`
4. See `VERCEL_DEPLOYMENT.md` for detailed troubleshooting

## Quick Test

```bash
# Test locally before deploying
npm run build
npm run start

# Test template API
curl http://localhost:3000/api/template/YOUR_PLAYGROUND_ID
```

---

✅ **Ready to deploy!**
