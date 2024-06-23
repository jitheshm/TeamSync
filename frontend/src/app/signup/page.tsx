import SignUp from '@/components/Login/SignUp'
import LoginLanding from '@/components/Login/landing'
import React from 'react'

function page() {
    return (
        <LoginLanding>
            <SignUp />
        </LoginLanding>
    )
}

export default page