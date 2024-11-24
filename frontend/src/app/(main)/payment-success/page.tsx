import Auth from '@/components/Auth/Auth'
import UserLayout from '@/components/Layout/UserLayout'
import PaymentSuccess from '@/components/Success/PaymentSuccess'
import React from 'react'

function Page() {
    return (

        <UserLayout>
            {/* <Auth> */}

                <PaymentSuccess />
            {/* </Auth> */}
        </UserLayout>

    )
}

export default Page