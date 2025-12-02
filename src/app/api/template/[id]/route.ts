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
        // Handle both local development and Vercel deployment
        const inputPath = path.join(process.cwd(), templatePath)
        
        // Use /tmp for Vercel, local temp for development
        const outputPath = process.env.VERCEL 
            ? path.join('/tmp', `${templateKey}-${Date.now()}.json`)
            : path.join(process.cwd(), '.next', `${templateKey}.json`)

        // Log paths for debugging
        console.log('Template loading:', {
            templateKey,
            templatePath,
            inputPath,
            outputPath,
            cwd: process.cwd(),
            isVercel: !!process.env.VERCEL
        })

        // Check if input path exists
        try {
            await fs.access(inputPath)
        } catch (error) {
            console.error('Template path not accessible:', inputPath)
            throw new Error(`Template not found at: ${inputPath}`)
        }

        await saveTemplateStructureToJson(inputPath,outputPath)

        const result =await readTemplateStructureFromJson(outputPath)

        if(!validateJsonStructure(result.items)){
            return Response.json({error:"Invalid JSON Structure"},{status:500})
        }

        await fs.unlink(outputPath)
        return Response.json({success:true,templateJson:result},{status:200})
     } catch (error) {
        const errMsg=error instanceof Error?error.message:"Error while fetching template file"
        return Response.json(
            {error:"Failed to generate template",details:errMsg},
            {
                status:500
            }
        )
     }
}