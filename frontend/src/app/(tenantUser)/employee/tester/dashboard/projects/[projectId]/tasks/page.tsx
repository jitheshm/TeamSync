
import Task from '@/components/common/Task'
import React from 'react'

function page({ params }: { params: { projectId: string } }) {
  return (
    <Task projectId={params.projectId} role='Tester'/>
  )
}

export default page