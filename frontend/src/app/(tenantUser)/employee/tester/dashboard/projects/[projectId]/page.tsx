import ProjectDetails from '@/components/common/ProjectDetails'
import React from 'react'

function page({ params }: { params: { projectId: string } }) {
  return (
    <ProjectDetails role='Tester' projectId={params.projectId}/>

  )
}

export default page