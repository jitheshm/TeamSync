import TaskForm from '@/components/common/Forms/TaskForm'
import React from 'react'

function page({ params }: { params: { projectId: string } }) {
    return (
        <TaskForm projectId={params.projectId} />
    )
}

export default page