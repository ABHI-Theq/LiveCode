#!/usr/bin/env node

/**
 * Copy LiveCode-starters to .next/standalone for Vercel deployment
 * This ensures templates are available in production
 */

const fs = require('fs');
const path = require('path');

const source = path.join(process.cwd(), 'LiveCode-starters');
const target = path.join(process.cwd(), '.next', 'standalone', 'LiveCode-starters');

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
  console.log('📦 Copying LiveCode-starters templates...');
  console.log(`   Source: ${source}`);
  console.log(`   Target: ${target}`);

  if (!fs.existsSync(source)) {
    console.warn('⚠️  LiveCode-starters folder not found, skipping copy');
    process.exit(0);
  }

  // Check if .next/standalone exists (Vercel build)
  const standaloneDir = path.join(process.cwd(), '.next', 'standalone');
  if (fs.existsSync(standaloneDir)) {
    copyRecursiveSync(source, target);
    console.log('✅ Templates copied successfully to standalone build');
  } else {
    console.log('ℹ️  Not a standalone build, templates will be accessed directly');
  }
} catch (error) {
  console.error('❌ Error copying templates:', error.message);
  // Don't fail the build, just warn
  process.exit(0);
}
