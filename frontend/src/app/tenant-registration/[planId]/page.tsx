import UserLayout from '@/components/Layout/UserLayout'
import TenantForm from '@/components/TenantForm/TenantForm'
import React from 'react'
import Payment from '@/components/Stripe/Payment'
function page() {
    return (

        <UserLayout>
            <TenantForm />
            {/* <Payment /> */}
        </UserLayout>


    )
}

export default page