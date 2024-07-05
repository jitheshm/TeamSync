import React from 'react'
import TenantManagerSidebar from '../Sidebars/TenantManagerSidebar';


interface TenantManagerLayoutProps {
    children: React.ReactNode;
}

const TenantManagerLayout: React.FC<TenantManagerLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-[100vh] bg-gray-900">
            <div className='grid grid-cols-12'>
                <div className='col-span-2'>
                    < TenantManagerSidebar />
                </div>
                <div className='col-span-10'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default TenantManagerLayout