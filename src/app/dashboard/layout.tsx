import DashboardSidebar from "@/components/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getAllPlaygroundForUser } from "@/features/dashboard/actions";


const DashboardLayout=async ({children}:{children:React.ReactNode})=>{
    
    const playgroundData=await getAllPlaygroundForUser()

    const techIconMap:Record<string,string>={
        REACTJS:"Zap",
        NEXTJS:"Libhtbulb",
        EXPRESS:"Database",
        VUE:"Compass",
        HONO:"FlameIcon",
        ANGULAR:"Terminal"
    }

    const formattedPlaygroundData=playgroundData?.map((playground:any)=>({
        id:playground.id,
        name:playground.title,
        starred:playground.starmark?.[0]?.isMarked || false,
        icon:techIconMap[playground.template] || "Code2"
        
    })) || []


    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full overflow-x-hidden">
                <DashboardSidebar initialPlaygroundData={formattedPlaygroundData}/>
            <main className="flex-1">
            {children}
            </main>
            </div>
        </SidebarProvider>
    )
}
export default DashboardLayout