import TaskForm from '@/components/common/Forms/TaskForm'
import React from 'react'

function page({ params }: { params: { projectId: string, taskId: string } }) {
    return (
        <TaskForm projectId={params.projectId} taskId={params.taskId} edit={true} />
    )
}

export default page