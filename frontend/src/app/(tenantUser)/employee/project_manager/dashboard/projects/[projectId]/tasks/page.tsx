import TaskForm from '@/components/TenantUserPanel/Forms/TaskForm'
import TaskTable from '@/components/TenantUserPanel/Tables/TaskTable'
import React from 'react'

function page({ params }: { params: { projectId: string } }) {
  return (
    <TaskTable projectId={params.projectId} role='Project_Manager'/>
  )
}

export default page