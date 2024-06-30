import React from 'react'
import TenantAdminSidebar from '../Sidebars/TenantAdminSidebar';

interface TenantAdminLayoutProps {
    children: React.ReactNode;
}

const TenantAdminLayout: React.FC<TenantAdminLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-[100vh] bg-gray-200">
            <div className='grid grid-cols-12'>
                <div className='col-span-2'>
                    < TenantAdminSidebar/>
                </div>
                <div className='col-span-10'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default TenantAdminLayout