import TicketForm from '@/components/common/Forms/TicketForm'
import React from 'react'

function page({ params }: { params: { projectId: string, taskId: string, ticketId: string } }) {
  return (
   <TicketForm projectId={params.projectId} taskId={params.taskId} ticketId={params.ticketId} edit={true}/>
  )
}

export default page