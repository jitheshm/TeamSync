import TicketForm from '@/components/common/Forms/TicketForm'
import React from 'react'

function Page({ params }: { params: { projectId: string, taskId: string } }) {
  return (
    <TicketForm projectId={params.projectId} taskId={params.taskId} />
  )
}

export default Page