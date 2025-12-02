#!/usr/bin/env node

/**
 * Test script to verify template loading will work on Vercel
 */

const fs = require('fs').promises;
const path = require('path');

const templatePaths = {
    REACTJS: 'LiveCode-starters/react-ts',
    NEXTJS: 'LiveCode-starters/nextjs',
    EXPRESS: 'LiveCode-starters/express-simple',
    VUE: 'LiveCode-starters/vue',
    ANGULAR: 'LiveCode-starters/angular',
    HONO: 'LiveCode-starters/hono-nodejs-starter',
};

async function testTemplatePaths() {
    console.log('🧪 Testing Template Path Resolution\n');
    console.log('Current working directory:', process.cwd());
    console.log('');

    let allPassed = true;

    for (const [key, templatePath] of Object.entries(templatePaths)) {
        console.log(`Testing ${key}: ${templatePath}`);
        
        const possiblePaths = [
            path.join(process.cwd(), templatePath),
            path.join(process.cwd(), '..', templatePath),
            path.join('/var/task', templatePath),
            templatePath
        ];

        let found = false;
        for (const testPath of possiblePaths) {
            try {
                await fs.access(testPath);
                console.log(`  ✅ Found at: ${testPath}`);
                found = true;
                break;
            } catch {
                // Path doesn't exist, try next
            }
        }

        if (!found) {
            console.log(`  ❌ NOT FOUND in any of these paths:`);
            possiblePaths.forEach(p => console.log(`     - ${p}`));
            allPassed = false;
        }
        console.log('');
    }

    // Check if LiveCode-starters folder exists
    console.log('📁 Checking LiveCode-starters folder...');
    try {
        const startersPath = path.join(process.cwd(), 'LiveCode-starters');
        await fs.access(startersPath);
        const contents = await fs.readdir(startersPath);
        console.log(`  ✅ Found LiveCode-starters with ${contents.length} items`);
        console.log(`  Templates: ${contents.filter(f => !f.startsWith('.')).slice(0, 5).join(', ')}...`);
    } catch (error) {
        console.log(`  ❌ LiveCode-starters folder not found!`);
        allPassed = false;
    }

    console.log('\n' + '='.repeat(50));
    if (allPassed) {
        console.log('✅ ALL TESTS PASSED - Templates will load on Vercel');
    } else {
        console.log('❌ SOME TESTS FAILED - Check the errors above');
    }
    console.log('='.repeat(50));

    process.exit(allPassed ? 0 : 1);
}

testTemplatePaths().catch(error => {
    console.error('Test failed with error:', error);
    process.exit(1);
});
