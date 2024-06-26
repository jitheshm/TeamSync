import UserLayout from '@/components/Layout/UserLayout'
import TenantForm from '@/components/TenantForm/TenantForm'
import React from 'react'
import Payment from '@/components/Stripe/Payment'
import Auth from '@/components/Auth/Auth'
function page() {
    return (

        <UserLayout>
            <Auth>
                <TenantForm />
            </Auth>
        </UserLayout>


    )
}

export default page