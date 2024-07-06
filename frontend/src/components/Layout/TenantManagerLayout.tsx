import React from 'react'
import TenantManagerSidebar from '../Sidebars/TenantManagerSidebar';


interface TenantManagerLayoutProps {
    children: React.ReactNode;
}

const TenantManagerLayout: React.FC<TenantManagerLayoutProps> = ({ children }) => {
    return (
        <div className='bg-gray-800 min-h-screen'>
            
            <div className='fixed bg-gray-800 z-10'>
            <TenantManagerSidebar />

            </div>
            <div className="p-4 ">
            {children}

            </div>
        </div>

    )
}

export default TenantManagerLayout