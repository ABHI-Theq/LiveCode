import path from 'path'
import fs from 'fs/promises'
import { NextRequest  } from 'next/server'
import { templatePaths } from '../../../../template'
import prisma from '@/lib/prisma'
import { readTemplateStructureFromJson, saveTemplateStructureToJson } from '@/features/playground/lib/path-to-json'
import { success } from 'zod'

const validateJsonStructure=(data:unknown)=>{
    try {
        JSON.parse(JSON.stringify(data))
        return true
    } catch (error) {
        console.error("invalid json:",error)
        return false;        
    }
}

export async function GET(req:NextRequest,{params}:{params:Promise<{id:string}>}){
     const {id}=await params;
     if(!id){
        return Response.json({error:"Missing Playground ID"},{status:400})
     }

     const playground=await prisma.playground.findUnique({
        where:{
            id
        }
     });

     if(!playground){
             return Response.json({error:"Missing Playground"},{status:404})
     }

     const templateKey=playground.template as keyof typeof templatePaths;
     const templatePath=templatePaths[templateKey]

     try {
        // Try multiple possible paths for the templates
        const possiblePaths = [
            path.join(process.cwd(), templatePath), // Standard path
            path.join(process.cwd(), '..', templatePath), // One level up
            path.join('/var/task', templatePath), // Vercel serverless path
            templatePath // Absolute path fallback
        ];

        let inputPath: string | null = null;
        
        // Find the first path that exists
        for (const testPath of possiblePaths) {
            try {
                await fs.access(testPath);
                inputPath = testPath;
                console.log(`✅ Found template at: ${testPath}`);
                break;
            } catch {
                console.log(`❌ Template not found at: ${testPath}`);
            }
        }

        if (!inputPath) {
            // List what's actually in the current directory for debugging
            const cwdContents = await fs.readdir(process.cwd());
            console.error('Template not found. Current directory contents:', cwdContents);
            
            throw new Error(
                `Template folder not found. Tried paths: ${possiblePaths.join(', ')}. ` +
                `Current working directory: ${process.cwd()}`
            );
        }
        
        // Use /tmp for output (works on both local and Vercel)
        const outputPath = path.join('/tmp', `${templateKey}-${Date.now()}.json`);

        console.log('Template loading:', {
            templateKey,
            templatePath,
            inputPath,
            outputPath,
            cwd: process.cwd(),
            isVercel: !!process.env.VERCEL
        });

        await saveTemplateStructureToJson(inputPath, outputPath);

        const result = await readTemplateStructureFromJson(outputPath);

        if (!validateJsonStructure(result.items)) {
            return Response.json({ error: "Invalid JSON Structure" }, { status: 500 });
        }

        // Clean up temp file
        try {
            await fs.unlink(outputPath);
        } catch (unlinkError) {
            console.warn('Failed to delete temp file:', unlinkError);
        }

        return Response.json({ success: true, templateJson: result }, { status: 200 });
     } catch (error) {
        const errMsg = error instanceof Error ? error.message : "Error while fetching template file";
        console.error('Template API Error:', {
            error: errMsg,
            stack: error instanceof Error ? error.stack : undefined,
            templateKey,
            templatePath,
            playgroundId: id,
            cwd: process.cwd(),
            env: {
                VERCEL: process.env.VERCEL,
                NODE_ENV: process.env.NODE_ENV
            }
        });
        
        return Response.json(
            {
                error: "Failed to generate template",
                details: errMsg,
                templateKey,
                cwd: process.cwd(),
                hint: "The LiveCode-starters folder may not be included in the Vercel deployment. Check vercel.json configuration."
            },
            {
                status: 500
            }
        );
     }
}