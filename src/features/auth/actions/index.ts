"use server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export const getUserbyId=async (id:string)=>{
   try {
    const user=await prisma.user.findUnique({
        where:{id},
        include:{accounts:true}
    })
    return user
   } catch (error) {
    console.error("Error fetching user by ID:", error)
    return null
   }
}

export const getAccountsByUserId=async (userId:string)=>{
    try {
        const accounts=await prisma.account.findMany({
            where:{userId},
            orderBy:{createdAt:"desc"}
        })
        return accounts
    } catch (error) {
        console.error("Error fetching accounts by user ID:", error)
        return null
    }
}

export const currentUser=async ()=>{
    const user=await auth()
    return user?.user
}