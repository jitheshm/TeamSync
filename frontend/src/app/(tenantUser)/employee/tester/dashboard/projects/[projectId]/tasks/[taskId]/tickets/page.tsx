import TicketTable from '@/components/common/TicketTable'
import React from 'react'

function page({ params }: { params: { projectId: string, taskId: string } }) {
    return (
        <TicketTable  projectId={params.projectId} taskId={params.taskId} role='Tester' />
    )
}

export default page