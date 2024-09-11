import UserForm from '@/components/common/Forms/UserForm'
import React from 'react'

const roles = [{ name: 'Project_Manager', value: 'Project_Manager' }, { name: 'Developer', value: 'Developer' }, { name: 'Tester', value: 'Tester' }];

function page({ params }: { params: { userId: string } }) {
    return (
        <UserForm edit={true} userId={params.userId} roles={roles} />
    )
}

export default page