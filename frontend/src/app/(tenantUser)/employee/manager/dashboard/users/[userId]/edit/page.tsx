import UserForm from '@/components/TenantUserPanel/Forms/UserForm'
import React from 'react'

function page({ params }: { params: { userId: string } }) {
    return (
        <UserForm edit={true} userId={params.userId} />
    )
}

export default page