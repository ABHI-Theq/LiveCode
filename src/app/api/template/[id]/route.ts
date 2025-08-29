import path from 'path'
import { NextRequest } from 'next/server'
import { templatePaths } from '../../../../../template'
import prisma from '@/lib/prisma'
import { scanTemplateDirectory } from '@/features/playground/lib/path-to-json'

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

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } =await params;
    if (!id) {
        return Response.json({ error: "Missing Playground ID" }, { status: 400 })
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
        const inputPath = path.join(process.cwd(), templatePath)
        const result = await scanTemplateDirectory(inputPath)

        if (!validateJsonStructure(result.items)) {
            return Response.json({ error: "Invalid JSON Structure" }, { status: 500 })
        }

        return Response.json({ success: true, templateJson: result }, { status: 200 })
    } catch (error) {
        console.error('Template loading error:', error)
        return Response.json(
            { error: "Failed to generate template" },
            { status: 500 }
        )
    }
}