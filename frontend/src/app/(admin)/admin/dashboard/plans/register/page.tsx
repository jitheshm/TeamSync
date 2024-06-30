import AdminAuth from '@/components/AdminPanel/Auth/AdminAuth'
import PlanForm from '@/components/AdminPanel/Forms/PlanForm'
import React from 'react'

function Page() {
  return (
    <AdminAuth>
      <PlanForm />
    </AdminAuth>
  )
}

export default Page