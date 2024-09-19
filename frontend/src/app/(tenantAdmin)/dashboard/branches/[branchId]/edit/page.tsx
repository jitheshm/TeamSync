import BranchForm from '@/components/common/Forms/BranchForm'
import React from 'react'

function page({ params }: { params: { branchId: string } }) {
    return (
        <BranchForm edit={true} id={params.branchId} />
    )
}

export default page