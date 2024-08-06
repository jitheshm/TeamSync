import AdminAuth from '@/components/AdminPanel/Auth/AdminAuth'
import PlanForm from '@/components/AdminPanel/Forms/PlanForm'
import React from 'react'

function page({ params }: { params: { planId: string } }) {
    return (
        <PlanForm viewOnly={true} id={params.planId} />
    )
}

export default page