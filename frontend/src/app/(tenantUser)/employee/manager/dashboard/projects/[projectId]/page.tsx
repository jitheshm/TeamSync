import ProjectDetails from '@/components/TenantUserPanel/ProjectDetails/ProjectDetails'
import React from 'react'

function page({ params }: { params: { projectId: string } }) {
  return (
   <ProjectDetails projectId={params.projectId}/>
  )
}

export default page