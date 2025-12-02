# Vercel Deployment Guide

## Problem

The `LiveCode-starters` folder contains template files for different frameworks (Express, Hono, Next.js, etc.). When deploying to Vercel, this folder needs to be accessible at runtime for the template API to work.

## Solution

We've implemented multiple fixes to ensure the templates are available in production:

### 1. **Updated vercel.json**
```json
{
  "functions": {
    "src/app/api/template/[id]/route.ts": {
      "maxDuration": 30,
      "includeFiles": "LiveCode-starters/**"
    }
  }
}
```

This tells Vercel to include the `LiveCode-starters` folder when deploying the template API function.

### 2. **Created .vercelignore**
Ensures the `LiveCode-starters` folder is NOT ignored during deployment:
```
!LiveCode-starters
```

### 3. **Added Postbuild Script**
The `scripts/copy-templates.js` script runs after build to copy templates to the standalone build directory if needed.

### 4. **Enhanced API Route**
Added better path resolution and error logging in `src/app/api/template/[id]/route.ts`:
- Detects Vercel environment
- Uses appropriate temp directory
- Logs paths for debugging
- Checks if template exists before processing

## Deployment Steps

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub Integration

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Fix Vercel deployment with LiveCode-starters"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js and deploy

### Option 3: Deploy via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Configure project settings (if needed)
4. Click "Deploy"

## Environment Variables

Make sure to set these in Vercel Dashboard:

```env
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=https://your-domain.vercel.app
GITHUB_ID=your_github_oauth_id
GITHUB_SECRET=your_github_oauth_secret
```

## Verifying Deployment

### 1. Check Build Logs
Look for these messages in the build logs:
```
📦 Copying LiveCode-starters templates...
✅ Templates copied successfully
```

### 2. Test Template Loading
After deployment, try creating a new playground:
- Go to your deployed site
- Create a new project with any template
- Check if it loads correctly

### 3. Check API Logs
If templates don't load, check the function logs in Vercel Dashboard:
- Go to your project → Deployments → Latest → Functions
- Click on the template API function
- Look for the debug logs we added

## Troubleshooting

### Issue: "Template not found" Error

**Check 1: Verify folder is included**
```bash
# In Vercel Dashboard → Project Settings → Functions
# Ensure includeFiles is set correctly
```

**Check 2: Check build output**
Look at the deployment logs for:
```
Template loading: {
  templateKey: 'EXPRESS',
  inputPath: '/var/task/LiveCode-starters/express-simple',
  ...
}
```

**Check 3: Verify folder structure**
Ensure `LiveCode-starters` is at the root level:
```
your-project/
├── LiveCode-starters/
│   ├── express-simple/
│   ├── hono-nodejs-starter/
│   ├── nextjs/
│   └── ...
├── src/
├── package.json
└── vercel.json
```

### Issue: Build Fails

**Solution 1: Check package.json**
Ensure the postbuild script doesn't fail:
```json
"postbuild": "node scripts/copy-templates.js"
```

**Solution 2: Make script executable**
```bash
chmod +x scripts/copy-templates.js
```

### Issue: Templates Load Locally but Not on Vercel

**Solution: Check includeFiles pattern**
Update `vercel.json`:
```json
"includeFiles": "LiveCode-starters/**"
```

The `**` ensures all nested files are included.

## File Structure

```
your-project/
├── LiveCode-starters/          # ← Must be at root
│   ├── express-simple/
│   ├── hono-nodejs-starter/
│   ├── nextjs/
│   ├── react-ts/
│   ├── vue/
│   └── angular/
├── scripts/
│   └── copy-templates.js       # ← Postbuild script
├── src/
│   ├── app/
│   │   └── api/
│   │       └── template/
│   │           └── [id]/
│   │               └── route.ts  # ← Template API
│   └── template.ts             # ← Template paths config
├── .vercelignore               # ← Ensures folder is included
├── vercel.json                 # ← Vercel configuration
└── package.json                # ← Build scripts
```

## Performance Optimization

### Reduce Template Size
If templates are large, consider:

1. **Remove unnecessary files**:
   ```bash
   # Remove node_modules from templates
   find LiveCode-starters -name "node_modules" -type d -exec rm -rf {} +
   ```

2. **Compress templates**:
   - Use `.vercelignore` to exclude large files
   - Keep only essential template files

### Cache Templates
Consider caching template JSON in Redis or similar for faster loading.

## Monitoring

### Check Function Execution
In Vercel Dashboard:
1. Go to your project
2. Click "Functions" tab
3. Monitor the template API function
4. Check execution time and errors

### Set Up Alerts
Configure alerts for:
- Function errors
- Slow response times (> 5s)
- High memory usage

## Additional Resources

- [Vercel Functions Documentation](https://vercel.com/docs/functions)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel includeFiles](https://vercel.com/docs/functions/serverless-functions/runtimes#including-additional-files)

## Support

If you continue to have issues:

1. Check Vercel function logs
2. Enable debug logging in the API route
3. Test locally with `vercel dev`
4. Contact Vercel support with deployment logs

## Success Checklist

- [ ] `LiveCode-starters` folder is at project root
- [ ] `.vercelignore` includes `!LiveCode-starters`
- [ ] `vercel.json` has correct `includeFiles` pattern
- [ ] Postbuild script is in `package.json`
- [ ] Environment variables are set in Vercel
- [ ] Build completes successfully
- [ ] Templates load in production
- [ ] No "Template not found" errors

---

**Last Updated**: December 2024
**Tested On**: Vercel, Next.js 15
