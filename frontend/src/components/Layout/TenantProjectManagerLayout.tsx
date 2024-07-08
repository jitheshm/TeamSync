import React from 'react'
import TenantProjectManagerSidebar from '../Sidebars/TenantProjectManagerSidebar';


interface TenantProjectManagerLayoutProps {
    children: React.ReactNode;
}

const TenantProjectManagerLayout: React.FC<TenantProjectManagerLayoutProps> = ({ children }) => {
    return (
        <div className='bg-gray-800 min-h-screen'>

            <div className='fixed bg-gray-800 z-10'>
                <TenantProjectManagerSidebar />

            </div>
            <div className="p-4 ">
                {children}

            </div>
        </div>
    )
}

export default TenantProjectManagerLayout