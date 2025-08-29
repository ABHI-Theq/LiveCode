"use client"

import Image from "next/image"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useState } from "react"
import { MoreHorizontal, Edit3, Trash2, ExternalLink, Copy, Download, Eye, TestTube } from "lucide-react"
import { toast } from "sonner"
// import { MarkedToggleButton } from "./toggle-star"
import { Project } from "@/features/dashboard/types"

interface ProjectTableProps{
    projects: Project[],
    onUpdateProject?: (id: string, data: { title: string; description: string }) => Promise<void> | void,
    onDeleteProject?: (id: string) => Promise<void> | void,
    onDuplicateProject?: (id: string) => Promise<void> | void,

}

interface EditProjectData{
    title:string,
    description:string
}

const ProjectTable = ({projects,onDeleteProject,onUpdateProject,onDuplicateProject}:ProjectTableProps) => {
  
    const [deleteDialogOpen,setDeleteDialogOpen]=useState(false)
    const [editDialogOpen,setEditDialogOpen]=useState(false)
    const [selectedProject,setSelectedProject]=useState<Project | null>(null)
    const [editData,setEditData]=useState<EditProjectData>({title:"",description:""})
    const [isLoading,setIsLoading]=useState(false)
    const [favourite,setFavourite]=useState(false)

    const handleDuplicateProject=async (project:Project)=>{
      if(!onDuplicateProject) return;

      setIsLoading(true)
      try {
        await onDuplicateProject(project.id);
        toast.success("Project Copied Successfully")
      } catch (error) {
        toast.error("Failed to copy project")
        console.error("Error: ",error)
      }finally{
        setIsLoading(false)
      }

    }
    const handleEditClick=async(project:Project)=>{
      setSelectedProject(project)
      setEditData({
        title:project.title,
        description:project.description
      })
      // await onUpdateProject(id:project.id,data:editData)
      setEditDialogOpen(true)        
    }  
    const handleUpdateProject=async()=>{
      if(!selectedProject || !onUpdateProject) return;
      setIsLoading(true)
      try {
        await onUpdateProject(selectedProject.id,editData);
        setEditDialogOpen(false)
        setSelectedProject(null)
        toast.success("Project updated successfully")
      } catch (error) {
        toast.error("Error while updating Project")
        console.error("Error: ",error)
      }finally{
        setIsLoading(false)
      }
    }
    const handleDeleteClick=(project:Project)=>{
        setSelectedProject(project)
        setDeleteDialogOpen(true)
    }

    const handleDeleteProject=async()=>{
      if(!selectedProject || !onDeleteProject) return;
      setIsLoading(true)
      try {
        await onDeleteProject(selectedProject.id);
        toast.success("Project Deleted successfully")
      } catch (error) {
        toast.error("Error while deleting Project") 
        console.error("Error: ",error)
      }finally{
        setIsLoading(false)
      }
    }
    const copyProjectUrl= (projectId:string)=>{
      navigator.clipboard.writeText(`${window.location.origin}/playground/${projectId}`)
      toast.success("Project URL copied successfully")
    }
    return (
    <>
    <div className="border rounded-lg overflow-hidden">
        <Table>
            <TableHeader>
              <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Template</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>User</TableHead>
            <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
                {
                projects.map((project)=>(
                    <TableRow key={project.id}>
                        <TableCell>
                        <div className="flex flex-col">
                        <Link href={`/playground/${project.id}`} className="hover:underline">
                            <span className="font-semibold">
                                {project.title}
                            </span>
                            <span className="text-sm text-gray-500 line-clamp-1">{project.description}</span>
                        </Link>
                        </div>
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline" className="bg-[#E93F3F15] text-[#E93F3F] border-[#E93F3F]">
                                {project.template}
                            </Badge>
                        </TableCell>
                        <TableCell>{format(new Date(project.createdAt),"MMM d, yyyy")}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full overflow-hidden">
                                    <Image 
                                    src={project.user.image}
                                    alt={project.user.name}
                                    width={32}
                                    height={32}
                                    className="object-cover"
                                    />
                                </div>
                                <span className="text-sm">{project.user.name}</span>
                            </div>
                        </TableCell>
                         <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        {/* <MarkedToggleButton markedForRevision={project.Starmark[0]?.isMarked} id={project.id} /> */}
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/playground/${project.id}`}
                          className="flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Open Project
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/playground/${project.id}`}
                          target="_blank"
                          className="flex items-center"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open in New Tab
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleEditClick(project)}
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Project
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDuplicateProject(project)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => copyProjectUrl(project.id)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Copy URL
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(project)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                        
                    </TableRow>
                ))
                }

            </TableBody>
        </Table>
    </div>

    <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Project</DialogTitle>
                  <DialogDescription>
                    Make changes to your project details here.Click SAVE 
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Project Title</Label>
                    <Input 
                    id="project-title"
                    value={editData.title}
                    onChange={(e)=>
                      setEditData((prev)=>({...prev,title:e.target.value}))
                    }
                    placeholder="Enter Project Title"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Project Description</Label>
                    <Textarea 
                    id="description"
                    value={editData.description}
                    onChange={(e)=>
                      setEditData((prev)=>({...prev,description:e.target.value}))
                    }
                    rows={3}
                    placeholder="Enter Project Description"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                  type="button" 
                  variant={"outline"}
                  onClick={()=>setEditDialogOpen(false)}
                  disabled={isLoading}
                  >
                    Cancel
                  </Button>


                  <Button 
                  type="button" 
                  variant={"brand"}
                  onClick={handleUpdateProject}                  >
                    {isLoading?"Saving...":"Save Changes"}
                    </Button>
                </DialogFooter>
                </DialogContent>
    </Dialog>
    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Delete Project
        </AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete &quot;{<span className="font-bold">{selectedProject?.title}</span>}&quot;? This action cannot be undone later. All data related to this project will be removed.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction
        onClick={handleDeleteProject}
        disabled={isLoading}
        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          {isLoading?"Deleting...":"Delete Project"}

        </AlertDialogAction>
      </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  )
}

export default ProjectTable