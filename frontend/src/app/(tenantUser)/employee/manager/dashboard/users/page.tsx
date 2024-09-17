import TenantUsersTable from '@/components/Tables/TenantUsersTable'
import { SelectComponent } from '@/components/common/Buttons/Select'
import TenantUserTable from '@/components/common/TenantUserTable'
import React from 'react'

function page() {
  const options = [
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
    <div className='md:p-10'>

      <TenantUserTable admin={false} options={options} />
    </div>

  )
}

export default page