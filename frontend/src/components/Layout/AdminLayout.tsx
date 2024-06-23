import React from 'react'
import Sidebar from '../AdminPanel/Sidebar/Sidebar';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    return (
        <div className="h-[99vh]">
            <div className='grid grid-cols-12'>
                <div className='col-span-2'>
                    <Sidebar />
                </div>
                <div className='col-span-10'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default AdminLayout