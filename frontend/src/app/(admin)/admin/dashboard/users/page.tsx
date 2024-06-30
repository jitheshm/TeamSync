import AdminAuth from '@/components/AdminPanel/Auth/AdminAuth'
import UserTable from '@/components/AdminPanel/Tables/UserTable'
import React from 'react'

function page() {



    return (

        <AdminAuth>
            <UserTable />
        </AdminAuth>

    )
}

export default page