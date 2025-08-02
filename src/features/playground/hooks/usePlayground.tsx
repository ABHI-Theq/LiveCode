import {useState,useCallback,useEffect} from "react"

import {toast} from "sonner"
import { TemplateFolder } from "../lib/path-to-json"
import { getPlaygroundById, SaveUpdatedCode } from "../actions"
import { ToastAction } from "../../../../LiveCode-starters/nextjs-shadcn/components/ui/toast"

interface PlaygroundData{
    id:string,
    title?:string,
    [key:string]:any
}

interface UsePlaygroundReturn{
    playgroundData:PlaygroundData | null,
    templateData: TemplateFolder  | null,
    isLoading:boolean,
    error:string | null,
    loadPlayground:()=>Promise<void>,
    saveTemplateData:(data:TemplateFolder)=>Promise<void>

}

export const usePlayground=(id:string):UsePlaygroundReturn=>{
    const [playgroundData,setPlaygroundData]=useState<PlaygroundData | null>(null)
    const [templateData,setTemplateData]=useState<TemplateFolder | null>(null)
    const [isLoading,setIsLoading]=useState<boolean>(false)
    const [error,setError]=useState<string | null>(null)

    const loadPlayground=useCallback(async ()=>{
        if(!id) return;
        try {
            setIsLoading(true)
            setError(null)

            const data=await getPlaygroundById(id)
            // @ts-ignore
            setPlaygroundData(data)     
            const rawContent=data?.templateFiles?.[0]?.content
            if(typeof rawContent==="string"){
                const templateData=JSON.parse(rawContent)
                setTemplateData(templateData)
                toast.success("playground loaded successfully")
                return                
            }

            const res=await fetch(`/api/template/${id}`)
            if(!res.ok){
                throw new Error(`Failed to load Content: ${res.status}`)
            }
            const templateRes=await res.json();
            if(templateRes.templateJson && Array.isArray(templateRes.templateJson)){
                setTemplateData({
                    folderName:"root",
                    items:templateRes.templateJson
                })
            }else{
                setTemplateData(templateRes.templateJson || {
                    folderName:"root",
                    items:[]
                })
            }

            toast.success("template loaded successfully")
        } catch (error) {
            console.error("Failed to load: ",error)
            setError("Failed to load playground data")
            toast.error("Failed to load playground data")
        }finally{
            setIsLoading(false) 
        }
    },['id'])


    const saveTemplateData=useCallback(async(data:TemplateFolder)=>{
        try {
            await SaveUpdatedCode(id,data)
            setTemplateData(data)
            toast.success("Changes Saved Successufully")
        } catch (error) {
         toast.error("Failed to load")
         throw error;   
        }
    },[])

    useEffect(()=>{
        loadPlayground()
    },[loadPlayground]);

    return {
        templateData,
        isLoading,
        saveTemplateData,
        playgroundData,
        error,
        loadPlayground,

    }
}