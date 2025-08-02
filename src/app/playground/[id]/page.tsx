"use client"
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import TemplateFileTree from '@/features/playground/components/template-file-tree'
import { useFileExplorer } from '@/features/playground/hooks/useFileExplorer'
import { usePlayground } from '@/features/playground/hooks/usePlayground'
import { useParams } from 'next/navigation'
import React from 'react'

const page = () => {
    const { id } = useParams<{ id: string }>()
    const {templateData,playgroundData,isLoading,error,saveTemplateData,loadPlayground}=usePlayground(id)

  const {
    activeFileId,
    closeAllFiles,
    openFile,
    closeFile,
    editorContent,
    updateFileContent,
    handleAddFile,
    handleAddFolder,
    handleDeleteFile,
    handleDeleteFolder,
    handleRenameFile,
    handleRenameFolder,
    openFiles,
    setTemplateData,
    setActiveFileId,
    setPlaygroundId,
    setOpenFiles,
  } = useFileExplorer();

    console.log(templateData)
    return (
        <div>
            <>
            <TemplateFileTree
            data={templateData!}
            />
                <SidebarInset>
                    <header className="flex h-16 items-center gap-2 border-b px-4 shrink-0">
                        <SidebarTrigger className='-ml-1' />
                        <Separator className='mr-2 h-4' orientation='vertical' />
                        <div className='flex flex-1 items-center gap-2'>
                            <div className="flex flex-col flex-1">
                                {playgroundData?.title || "Code playground"}
                            </div>
                        </div>
                    </header>
                </SidebarInset>
            </>
        </div>
    )
}

export default page