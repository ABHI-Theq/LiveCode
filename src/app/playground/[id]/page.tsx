"use client"
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import PlaygroundEditor from '@/features/playground/components/playground-editor'
import TemplateFileTree from '@/features/playground/components/template-file-tree'
import { useFileExplorer } from '@/features/playground/hooks/useFileExplorer'
import { usePlayground } from '@/features/playground/hooks/usePlayground'
import { TemplateFile } from '@/features/playground/types'
import { TooltipContent } from '@radix-ui/react-tooltip'
import { Bot, FileText, Save, Settings, X } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {
    const { id } = useParams<{ id: string }>()
    const { templateData, playgroundData, isLoading, error, saveTemplateData, loadPlayground } = usePlayground(id)
    const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false)

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

    useEffect(()=>{
        setPlaygroundId(id)
    },[id,setPlaygroundId])

    useEffect(()=>{
        if(templateData && !openFiles.length){
            setTemplateData(templateData)
        }
    },[templateData,setTemplateData,openFiles.length])

    const activeFile = openFiles.find((f) => f.id === activeFileId)
    const hasUnsavedChanges = openFiles.some((f) => f.hasUnsavedChanges)

    const handleFileSelect = (file: TemplateFile) => {
        openFile(file)
    }

    return (
        <TooltipProvider>
            <>
                <TemplateFileTree
                    data={templateData!}
                    onFileSelect={handleFileSelect}
                    selectedFile={activeFile}
                />
                <SidebarInset>
                    <header className="flex h-16 items-center gap-2 border-b px-4 shrink-0">
                        <SidebarTrigger className='-ml-1' />
                        <Separator className='mr-2 h-4' orientation='vertical' />
                        <div className='flex flex-1 items-center gap-2'>
                            <div className="flex flex-col flex-1">
                                <h1 className="text-sm font-medium">
                                    {playgroundData?.title || "Code playground"}
                                </h1>
                                <p className='text-xs text-muted-foreground'>
                                    {openFiles.length} File(s) open
                                    {hasUnsavedChanges && ". Unsaved Changes"}
                                </p>
                            </div>
                            <div className="flex items-center gap-1">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button size={"sm"} variant={"outline"} onClick={() => { }}
                                            disabled={!activeFile || !activeFile.hasUnsavedChanges} >
                                            <Save className="size-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Save (ctrl + s)
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button size={"sm"} variant={"outline"} onClick={() => { }}
                                            disabled={!activeFile || !activeFile.hasUnsavedChanges} >
                                            <Save className="size-4" />All
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Save All (ctrl + s)
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button size={"sm"} variant={"outline"} onClick={() => { }}
                                            disabled={!activeFile || !activeFile.hasUnsavedChanges} >
                                            <Bot className="size-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        ToggleAI
                                    </TooltipContent>
                                </Tooltip>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button size={"sm"} variant={"outline"}>
                                            <Settings className="size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() => setIsPreviewVisible(!isPreviewVisible)}
                                        >
                                            {isPreviewVisible ? "Hide" : "Show"} Preview
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={closeAllFiles}>
                                            Close All Files
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </header>

                    <div className="h-[calc(100vh-4rem)]">
                        {
                            openFiles.length > 0 ? (
                                <div className='flex h-full flex-col'>
                                    <div className="bordeer-b bg-muted/30">
                                        <Tabs
                                            value={activeFileId || ""}
                                            onValueChange={setActiveFileId}
                                        >
                                            <div className="flex items-center justify-between px-4 py-2">
                                                <TabsList className='h-8 bg-transparent p-0'>
                                                    {
                                                        openFiles.map((file) => (
                                                            <TabsTrigger key={file.id} value={file.id}
                                                                className='relative h-8 px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm group'
                                                            >
                                                                <div className='flex items-center gap-2'>
                                                                    <FileText className='size-3' />
                                                                    <span>
                                                                        {file.filename}.{file.fileExtension}
                                                                    </span>
                                                                    {
                                                                        file.hasUnsavedChanges && (
                                                                            <span className='h-2 w-2 bg-orange-500 rounded-full' />
                                                                        )
                                                                    }
                                                                    <span
                                                                        className="ml-2 h-4 w-4 hover:bg-destructive hover:text-destructive-foreground rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            closeFile(file.id);
                                                                        }}
                                                                    >
                                                                        <X className="h-3 w-3" />
                                                                    </span>
                                                                </div>

                                                            </TabsTrigger>
                                                        ))
                                                    }
                                                </TabsList>

                                                    {
                                                        openFiles.length>1 && 
                                                        (
                                                            <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={closeAllFiles}
                                                            className="h-6 px-2 text-xs"
                                                            >
                                                                Close All
                                                            </Button>
                                                        )
                                                    }

                                            </div>

                                        </Tabs>
                                    </div>

                                    <div className='flex-1'>
                                         <ResizablePanelGroup
                    direction="horizontal"
                    className="h-full"
                  >
                    <ResizablePanel defaultSize={isPreviewVisible ? 50 : 100}>
                      <PlaygroundEditor
                      activeFile={activeFile}
                      content={activeFile?.content || ""}
                      onContentChange={(value)=>{
                        activeFileId && updateFileContent(activeFileId,value)
                      }}
                      />
                    </ResizablePanel>

                    {isPreviewVisible && (
                      <>
                        <ResizableHandle />
                        <ResizablePanel defaultSize={50}>
                          {/* <WebContainerPreview
                            templateData={templateData}
                            instance={instance}
                            writeFileSync={writeFileSync}
                            isLoading={containerLoading}
                            error={containerError}
                            serverUrl={serverUrl!}
                            forceResetup={false}
                          /> */}
                        </ResizablePanel>
                      </>
                    )}
                  </ResizablePanelGroup>
                                    </div>

                                </div>
                            ) : (
                                <div className="flex flex-col h-full items-center justify-center text-muted-foreground gap-4">
                                    <FileText className='size-20 text-gray-300' />
                                    <div className="text-center">
                                        <p className='text'>No files Open</p>
                                        <p className="text-sm text-gray-500">
                                            Select a file from the sidebar to start editing
                                        </p>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </SidebarInset>
            </>
        </TooltipProvider>
    )
}

export default page