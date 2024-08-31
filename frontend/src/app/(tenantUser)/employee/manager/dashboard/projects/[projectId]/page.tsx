// import ProjectDetails from '@/components/TenantUserPanel/ProjectDetails/ProjectDetails'
import ProjectDetails from '@/components/common/ProjectDetails'
import React from 'react'

function page({ params }: { params: { projectId: string } }) {
  return (
    <div className='md:p-10 p-5'>

      <ProjectDetails projectId={params.projectId} role='Manager' />
    </div>
  )
}

export default page