import React from 'react'
import TenantProjectManagerSidebar from '../Sidebars/TenantProjectManagerSidebar';


interface TenantProjectManagerLayoutProps {
    children: React.ReactNode;
}

const TenantProjectManagerLayout: React.FC<TenantProjectManagerLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-[100vh] bg-gray-900">
            <div className='grid grid-cols-12'>
                <div className='col-span-2'>
                    < TenantProjectManagerSidebar />
                </div>
                <div className='col-span-10'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default TenantProjectManagerLayout