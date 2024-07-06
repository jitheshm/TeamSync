import React from 'react'
import TenantAdminSidebar from '../Sidebars/TenantAdminSidebar';

interface TenantAdminLayoutProps {
    children: React.ReactNode;
}

const TenantAdminLayout: React.FC<TenantAdminLayoutProps> = ({ children }) => {
    return (
        <div className='bg-[#0f1729] min-h-screen'>

            <div className='fixed bg-[#0f1729] z-10'>
                <TenantAdminSidebar />

            </div>
            <div className="p-4 ">
                {children}

            </div>
        </div>
    )
}

export default TenantAdminLayout