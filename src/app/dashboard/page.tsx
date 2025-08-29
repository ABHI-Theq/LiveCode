import AddNewButton from '@/components/AddNewButton'
import AddRepoButton from '@/components/AddRepoButton'
import ProjectTable from '@/components/ProjectTable'
import EmptyState from '@/components/ui/empty-state'
import { deleteProjectById, duplicateProjectById, editProjectById, getAllPlaygroundForUser } from '@/features/dashboard/actions'
import React from 'react'

const page = async () => {
  const playgroundsRaw = (await getAllPlaygroundForUser()) ?? []
  const playgrounds = playgroundsRaw.map((p: any) => ({
    ...p,
    user: { ...p.user, name: p.user?.name ?? '' },
  }))
  return (
    <div className='flex flex-col items-center justify-start min-h-screen mx-auto max-w-7xl px-4 py-10'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full'>
        <AddNewButton/>
        <AddRepoButton/>
      </div>
      <div className="mt-10 flex flex-col items-center justify-center w-full">
        {
          playgrounds.length === 0 ? (
            <EmptyState title="No projects added" description="create a new project to get started" imageSrc='/empty-state.svg'/>
          ) : (
            <ProjectTable
          projects={playgrounds}
          />
          )
        }
      </div>
    </div>
  )
}

export default page