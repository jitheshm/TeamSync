import ProjectDetails from '@/components/TenantUserPanel/ProjectDetails/ProjectDetails'
import TaskDetails from '@/components/TenantUserPanel/TaskDetails/TaskDetails'
import React from 'react'

function page({ params }: { params: { projectId: string, taskId: string } }) {
    return (
        <TaskDetails projectId={params.projectId} taskId={params.taskId} />

    )
}

export default page