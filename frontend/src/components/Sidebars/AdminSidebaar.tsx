import { ThemeState } from '@/features/theme/themeSlice';
import Link from 'next/link';
import React, { use } from 'react';
import { useSelector } from 'react-redux';

interface SidebarProps {
    sidebarOpen: boolean;
}
interface RootState {
    theme: ThemeState
}
const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen }) => {
    const { background, text } = useSelector((state: RootState) => state.theme)

    return (
        <div
            className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform  shadow-lg z-10 ${background} lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'
                }`}
        >
            <div className="flex items-center justify-center mt-8">
                <div className="flex items-center">
                    <img src="/logo.png" alt="" className="w-12 h-12" />
                    <span className={`mx-2 text-2xl font-semibold ${text}`}>TeamSync</span>
                </div>
            </div>

            <nav className="mt-14">
                <Link href="/">
                    <div className={`flex items-center px-6 py-2 mt-8 ${text} bg-gray-700 bg-opacity-25`}>
                        <i className={`fa-solid fa-gauge ${text}`} />
                        <span className="mx-3">Dashboard</span>
                    </div>
                </Link>
                <Link href="/admin/dashboard/plans">
                    <div className={`flex items-center px-6 py-2 mt-8 ${text} bg-opacity-25`}>
                        <i className={`fa-solid fa-gauge ${text}`} />
                        <span className="mx-3">Plans</span>
                    </div>
                </Link>
                <Link href="/admin/dashboard/subscriptions">
                    <div className={`flex items-center px-6 py-2 mt-8 ${text} bg-opacity-25`}>
                        <i className={`fa-solid fa-gauge ${text}`} />
                        <span className="mx-3">Subscription</span>
                    </div>
                </Link>

                <Link href="/admin/dashboard/users">
                    <div className={`flex items-center px-6 py-2 mt-8 ${text}  bg-opacity-25`}>
                        <i className={`fa-solid fa-list-check ${text}`} />
                        <span className="mx-3">Users</span>
                    </div>
                </Link>

                

                {/* Add more navigation items */}
            </nav>
        </div>
    );
};

export default Sidebar;
