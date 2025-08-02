"use server"
import { currentUser } from "@/features/auth/actions"
import prisma from "@/lib/prisma"
import { TemplateFolder } from "../lib/path-to-json"
import { revalidatePath } from "next/cache"

export const getPlaygroundById=async (id:string)=>{
    try {
        const playground=await prisma.playground.findUnique({
            where:{id},
            select:{
                title:true,
                description:true,
                templateFiles:{
                    select:{
                        content:true
                    }
                }
            }
        })
        return playground;  
    } catch (error) {
        
    }
}
export const SaveUpdatedCode=async(playgroundId:string,data:TemplateFolder)=>{
    const user=await currentUser()
    if(!user) return;

    try {
        const updatedPlayground=await prisma.templateFile.upsert({
            where:{playgroundId},
            update:{
                content:JSON.stringify(data)
            },
            create:{
                playgroundId,
                content:JSON.stringify(data),
            }
        })
    } catch (error) {
        console.error("Error: ",error)
    }
}