import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'

const Playgroundlayout = ({children}:{children:React.ReactNode}) => {
  return (
    <>
    <div>
        <SidebarProvider>
            {children}
        </SidebarProvider>
    </div>
    </>
    )
}

export default Playgroundlayout