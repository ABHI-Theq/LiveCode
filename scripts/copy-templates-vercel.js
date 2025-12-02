#!/usr/bin/env node

/**
 * Copy LiveCode-starters to .next/standalone for Vercel deployment
 * This runs during vercel-build to ensure templates are available
 */

const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

try {
  const source = path.join(process.cwd(), 'LiveCode-starters');
  
  console.log('📦 [Vercel Build] Copying LiveCode-starters templates...');
  console.log(`   Source: ${source}`);
  console.log(`   CWD: ${process.cwd()}`);

  if (!fs.existsSync(source)) {
    console.error('❌ LiveCode-starters folder not found!');
    process.exit(1);
  }

  // Copy to .next/standalone if it exists (Vercel uses this)
  const standaloneDir = path.join(process.cwd(), '.next', 'standalone');
  if (fs.existsSync(standaloneDir)) {
    const standaloneDest = path.join(standaloneDir, 'LiveCode-starters');
    console.log(`   Copying to standalone: ${standaloneDest}`);
    copyRecursiveSync(source, standaloneDest);
    console.log('✅ Templates copied to standalone build');
  }

  // Also copy to .next/server for serverless functions
  const serverDir = path.join(process.cwd(), '.next', 'server');
  if (fs.existsSync(serverDir)) {
    const serverDest = path.join(serverDir, 'LiveCode-starters');
    console.log(`   Copying to server: ${serverDest}`);
    copyRecursiveSync(source, serverDest);
    console.log('✅ Templates copied to server build');
  }

  console.log('✅ [Vercel Build] Template copy complete');
} catch (error) {
  console.error('❌ Error copying templates:', error.message);
  // Don't fail the build
  process.exit(0);
}
