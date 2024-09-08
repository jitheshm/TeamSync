
import TaskDetails from '@/components/common/TaskDetails'
import React from 'react'

function page({ params }: { params: { projectId: string, taskId: string } }) {
    return (
        <TaskDetails projectId={params.projectId} taskId={params.taskId} />

    )
}

export default page