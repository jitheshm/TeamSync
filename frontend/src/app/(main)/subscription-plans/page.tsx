"use client"
import React, { useEffect, useState } from 'react'
import SubscriptionPlans from '@/components/SubscriptionPlans'
import UserLayout from '@/components/Layout/UserLayout'
import Auth from '@/components/Auth/Auth'
import Loading from '@/components/Loading/Loading'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'

interface UserState {
  name: string
  verified: boolean
  tenantId: string
}

interface RootState {
  user: UserState
}

function Page() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { name, verified, tenantId } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    if (verified) {
      if (tenantId) {
        router.push('/dashboard')

      } else {
        setLoading(false)

      }
    } else {
      router.push('/login')
    }

  }, [])
  return (
    <UserLayout>
      {
        loading ? <Loading /> :

          <SubscriptionPlans />

      }
    </UserLayout>
  )
}

export default Page