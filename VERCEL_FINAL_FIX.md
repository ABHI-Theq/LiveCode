# Vercel Deployment - Final Fix

## Problem
Vercel was rejecting the `functions` configuration in `vercel.json` because Next.js App Router doesn't use the traditional function patterns.

## Solution

### 1. Removed `functions` from vercel.json
The `functions` configuration doesn't work with Next.js App Router. Removed it entirely.

### 2. Added `outputFileTracingIncludes` to next.config.ts
This is the correct way to include additional files in Next.js 13+ deployments:

```typescript
experimental: {
  outputFileTracingIncludes: {
    '/api/template/[id]': ['./LiveCode-starters/**/*'],
  },
}
```

This tells Next.js to include the `LiveCode-starters` folder when building the `/api/template/[id]` route.

## Files Changed

### vercel.json
- Removed `functions` configuration
- Kept headers configuration
- Simplified to minimal config

### next.config.ts
- Added `experimental.outputFileTracingIncludes`
- Ensures `LiveCode-starters` is traced and included

## How It Works

1. **Build Time**: Next.js traces dependencies for each route
2. **File Tracing**: `outputFileTracingIncludes` tells Next.js to include `LiveCode-starters`
3. **Deployment**: Vercel bundles the traced files with the serverless function
4. **Runtime**: Templates are accessible at the expected paths

## Deploy Now

```bash
git add vercel.json next.config.ts
git commit -m "Fix Vercel deployment with outputFileTracingIncludes"
git push origin main
```

## Expected Result

✅ Build succeeds without function pattern errors
✅ `LiveCode-starters` folder is included in deployment
✅ Templates load correctly in production
✅ No 500 errors from template API

## Verification

After deployment, check:

1. **Build Logs**: No errors about unmatched patterns
2. **Function Logs**: Look for `✅ Found template at: ...`
3. **Test**: Create a playground and select a template
4. **Result**: Template loads successfully

## Alternative Approach (If Still Fails)

If `outputFileTracingIncludes` doesn't work, we can:

1. **Move templates to public folder**:
   ```bash
   mv LiveCode-starters public/LiveCode-starters
   ```

2. **Update template paths**:
   ```typescript
   // src/template.ts
   export const templatePaths = {
       REACTJS: 'public/LiveCode-starters/react-ts',
       // ...
   }
   ```

3. **Access via public URL**:
   Templates will be served as static files

## References

- [Next.js Output File Tracing](https://nextjs.org/docs/app/api-reference/next-config-js/output#automatically-copying-traced-files)
- [Vercel Next.js Deployment](https://vercel.com/docs/frameworks/nextjs)

---

**Status**: Ready to deploy
**Confidence**: HIGH (Using official Next.js method)
