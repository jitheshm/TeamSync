import AdminAuth from '@/components/AdminPanel/Auth/AdminAuth'
import PlansTable from '@/components/AdminPanel/Tables/PlansTable'
import React from 'react'

function page() {
  return (
    <AdminAuth>
      <PlansTable />
    </AdminAuth>
  )
}

export default page