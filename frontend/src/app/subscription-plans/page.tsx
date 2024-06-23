import React from 'react'
import SubscriptionPlans from '@/components/SubscriptionPlans'
import UserLayout from '@/components/Layout/UserLayout'

function page() {
  return (
    <UserLayout>
      <SubscriptionPlans />
    </UserLayout>
  )
}

export default page