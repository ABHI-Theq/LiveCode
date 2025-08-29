"use server"

import { currentUser } from "@/features/auth/actions"
import prisma from "@/lib/prisma"
import { Templates } from "@prisma/client"
import { revalidatePath } from "next/cache"

export const createPlayground=async (data:{
    title:string,
    description?:string,
    template:Templates
})=>{
    const {template,title,description}=data;
    const user=await currentUser();
    
    try {
       
        const playground=await prisma.playground.create({
            data:{
                title,
                description:description?description:"No description added",
                template,
                userId:user?.id!
            }
        });

        return playground;
        
    } catch (error) {
        console.error(error)
        return null;
    }
}

export const getAllPlaygroundForUser=async ()=>{
    const user=await currentUser();
    try {
        const playground=await prisma.playground.findMany({
            where:{
                userId:user?.id
            },
            include:{
                user:true,
                starmark:{
                    where:{
                        userId:user?.id
                    },
                    select:{
                        isMarked:true
                    }
                }
            }

        })
        return playground;
    } catch (error) {
        console.error(error)
        return null
    }
}

export const deleteProjectById=async (id:string)=>{
    try {
        await prisma.playground.delete({
            where:{
                id
            }
        })
        revalidatePath("/dashboard")
    } catch (error) {
     console.error(error)
        
    }
}

export const editProjectById=async (id:string,data:{title:string,description:string})=>{
    try {
        await prisma.playground.update({
            where:{
                id
            },
            data:data
        })
        revalidatePath("/dashboard")
    } catch (error) {
        console.error(error)
    }
}

export const duplicateProjectById=async (id:string)=>{
    try {
         const orginalPlayground=await prisma.playground.findUnique({
            where:{id}
         })
         if(!orginalPlayground) throw new Error("Playground not found");

         const duplicatePlayground=await prisma.playground.create({
            data:{
                title:`${orginalPlayground.title}(copy)`,
                description:orginalPlayground.description,
                template:orginalPlayground.template,
                userId:orginalPlayground.userId

            }
         })
         revalidatePath("/dashboard")

         return duplicatePlayground
    } catch (error) {
        console.error(error)
    }
}