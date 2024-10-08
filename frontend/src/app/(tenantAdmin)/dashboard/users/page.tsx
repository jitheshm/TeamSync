import TenantUserTable from '@/components/common/TenantUserTable'
import React from 'react'

function page() {
    const options = [
        {
            name: 'Manager',
            value: 'Manager'
        },
        {
            name: 'Project Manager',
            value: 'Project_Manager'
        },
        {
            name: 'Developer',
            value: 'Developer'
        },
        {
            name: 'Tester',
            value: 'Tester'
        }
    ]
    return (
        // <TenantUsersTable admin={false}/>
        <div className='md:p-10 p-5'>

            <TenantUserTable admin={true} options={options} />
        </div>

    )
}

export default page