import ProjectForm from '@/components/TenantUserPanel/Forms/ProjectForm'
import React from 'react'

function page({ params }: { params: { projectId: string } }) {
  return (
    <ProjectForm edit={true} id={params.projectId}/>
  )
}

export default page