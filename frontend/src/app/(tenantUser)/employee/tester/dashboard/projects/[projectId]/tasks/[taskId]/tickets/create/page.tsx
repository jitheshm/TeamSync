import React from 'react'
import TicketForm from '@/components/TenantUserPanel/Forms/TicketForm'

function Page({ params }: { params: { projectId: string, taskId: string } }) {
  return (
    <TicketForm projectId={params.projectId} taskId={params.taskId} />
  )
}

export default Page