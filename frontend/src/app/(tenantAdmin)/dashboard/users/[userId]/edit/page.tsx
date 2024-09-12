import AdminPanelUserForm from '@/components/common/Forms/AdminPanelUserForm';
import React from 'react'

const roles = [{ name: 'Manager', value: 'Manager' },{ name: 'Project_Manager', value: 'Project_Manager' }, { name: 'Developer', value: 'Developer' }, { name: 'Tester', value: 'Tester' }];

function page({ params }: { params: { userId: string } }) {
    return (
        <AdminPanelUserForm edit={true} userId={params.userId}  />
    )
}

export default page