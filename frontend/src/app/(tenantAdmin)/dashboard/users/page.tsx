import TenantUsersTable from '@/components/Tables/TenantUsersTable'
import React from 'react'

function page() {
    return (
        <TenantUsersTable admin={true}/>
    )
}

export default page