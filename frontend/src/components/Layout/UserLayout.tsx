import React from 'react'
import Navbar from '../Navbar/Navbar'

interface UserLayoutProps {
    children: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
    return (
        <div className="h-[99vh]">
            <Navbar />
            {children}
        </div>
    )
}

export default UserLayout