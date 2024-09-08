import TicketDetails from '@/components/common/TicketDetails'
import React from 'react'

function page({ params }: { params: { projectId: string, taskId: string, ticketId: string } }) {
    return (
        <TicketDetails projectId={params.projectId} taskId={params.taskId} ticketId={params.ticketId} />
    )
}

export default page