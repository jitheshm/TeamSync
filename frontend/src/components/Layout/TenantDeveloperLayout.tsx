import React from 'react'
import TenantDeveloperSidebar from '../Sidebars/TenantDeveloperSidebar';


interface TenantDeveloperLayoutProps {
    children: React.ReactNode;
}

const TenantDeveloperLayout: React.FC<TenantDeveloperLayoutProps> = ({ children }) => {
    return (
        <div className='bg-gray-800 min-h-screen'>

            <div className='fixed bg-gray-800 z-10'>
                <TenantDeveloperSidebar />

            </div>
            <div className="p-4 ">
                {children}

            </div>
        </div>
    )
}

export default TenantDeveloperLayout