import React from 'react'
import TenantTesterSidebar from '../Sidebars/TenantTesterSidebar';


interface TenantTesterLayoutProps {
    children: React.ReactNode;
}

const TenantTesterLayout: React.FC<TenantTesterLayoutProps> = ({ children }) => {
    return (
        <div className='bg-gray-950 min-h-screen'>

            <div className='fixed bg-gray-950 z-10'>
                <TenantTesterSidebar />

            </div>
            <div className="p-4 ">
                {children}

            </div>
        </div>
    )
}

export default TenantTesterLayout