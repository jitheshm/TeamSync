import BranchForm from '@/components/Forms/BranchForm'
import React from 'react'

function page({ params }: { params: { branchId: string } }) {
    return (
        <BranchForm edit={true} id={params.branchId} />
    )
}

export default page