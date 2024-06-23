import Login from '@/components/Login/Login'
import LoginLanding from '@/components/Login'
import React from 'react'
import UserLayout from '@/components/Layout/UserLayout'

function page() {
    return (
        <UserLayout>
            <LoginLanding>
                <Login />
            </LoginLanding>
        </UserLayout>
    )
}

export default page