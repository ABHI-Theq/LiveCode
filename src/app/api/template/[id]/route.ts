import path from 'path'
import { NextRequest } from 'next/server'
import { templatePaths } from '../../../../../template'
import prisma from '@/lib/prisma'
import { scanTemplateDirectory } from '@/features/playground/lib/path-to-json'
import fs from 'fs/promises'

export const runtime = 'nodejs'

const validateJsonStructure = (data: unknown) => {
    try {
        JSON.parse(JSON.stringify(data))
        return true
    } catch (error) {
        console.error("invalid json:", error)
        return false;
    }
}

// Try multiple possible paths for template files in Vercel
const getTemplatePath = (templatePath: string) => {
    const possiblePaths = [
        // Try relative to current working directory (most likely)
        path.join(process.cwd(), templatePath),
        // Try from the project root (one level up from /var/task)
        path.join(process.cwd(), '..', templatePath),
        // Try from the project root (two levels up from /var/task)
        path.join(process.cwd(), '..', '..', templatePath),
        // Try absolute path from project root
        path.join('/var/task', '..', templatePath),
        // Try from the root of the deployment
        path.join('/', templatePath),
        // Try from the current directory without any prefix
        templatePath,
    ]
    
    console.log('Trying possible paths:', possiblePaths)
    return possiblePaths
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id) {
        return Response.json({ error: "Missing Playground ID" }, { status: 400 })
    }

    // Debug: List contents of current working directory
    try {
        const cwdContents = await fs.readdir(process.cwd())
        console.log('=== CONTENTS OF CURRENT WORKING DIRECTORY ===')
        console.log('Current working directory:', process.cwd())
        console.log('Contents:', cwdContents)
        console.log('=== END CONTENTS ===')
    } catch (error) {
        console.error('Error reading current directory:', error)
    }

    const playground = await prisma.playground.findUnique({
        where: {
            id
        }
    });

    if (!playground) {
        return Response.json({ error: "Missing Playground" }, { status: 404 })
    }

    const templateKey = playground.template as keyof typeof templatePaths;
    const templatePath = templatePaths[templateKey]

    try {
        console.log('Template key:', templateKey)
        console.log('Template path from config:', templatePath)
        console.log('Current working directory:', process.cwd())
        
        const possiblePaths = getTemplatePath(templatePath)
        let result = null
        let lastError = null
        
        // Try each possible path
        for (const inputPath of possiblePaths) {
            try {
                console.log('Trying path:', inputPath)
                result = await scanTemplateDirectory(inputPath)
                console.log('Success with path:', inputPath)
                break
            } catch (error) {
                console.log('Failed with path:', inputPath, error)
                lastError = error
                continue
            }
        }
        
        if (!result) {
            throw new Error(`All template paths failed. Last error: ${lastError}`)
        }

        if (!validateJsonStructure(result.items)) {
            return Response.json({ error: "Invalid JSON Structure" }, { status: 500 })
        }

        return Response.json({ success: true, templateJson: result }, { status: 200 })
    } catch (error) {
        console.error('Template loading error:', error)
        console.error('Error details:', {
            templateKey,
            templatePath,
            cwd: process.cwd(),
            possiblePaths: getTemplatePath(templatePath)
        })
        return Response.json(
            { error: "Failed to generate template", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        )
    }
}