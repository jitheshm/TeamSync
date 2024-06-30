import AdminAuth from '@/components/AdminPanel/Auth/AdminAuth'
import SubscriptionTable from '@/components/AdminPanel/Tables/SubscriptionTable'
import React from 'react'

function Page() {
    return (
        <AdminAuth>
            <SubscriptionTable />
        </AdminAuth>
    )
}

export default Page