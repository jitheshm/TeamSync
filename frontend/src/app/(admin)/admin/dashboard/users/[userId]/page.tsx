import AdminAuth from '@/components/AdminPanel/Auth/AdminAuth'
import UserDetails from '@/components/AdminPanel/UserDetails/UserDetails'
import React from 'react'

function page({ params }: { params: { userId: string } }) {
    return (
        <AdminAuth>
            <UserDetails userId={params.userId} />
        </AdminAuth>

    )
}

export default page