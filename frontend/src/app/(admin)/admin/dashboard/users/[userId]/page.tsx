import UserDetails from '@/components/UserDetails/UserDetails'
import React from 'react'

function page({ params }: { params: { userId: string } }) {
    return (
       <UserDetails userId={params.userId}/>

    )
}

export default page