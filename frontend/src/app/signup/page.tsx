import SignUp from '@/components/Login/SignUp'
import LoginLanding from '@/components/Login'
import React from 'react'
import UserLayout from '@/components/Layout/UserLayout'

function page() {
    return (
        <UserLayout>
            <LoginLanding>
                <SignUp />
            </LoginLanding>
        </UserLayout>
    )
}

export default page