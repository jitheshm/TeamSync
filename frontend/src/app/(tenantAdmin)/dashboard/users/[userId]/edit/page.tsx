import UserForm from '@/components/Forms/UserForm'
import React from 'react'

function page({ params }: { params: { userId: string } }) {
    return (
        <UserForm edit={true} userId={params.userId} />
    )
}

export default page