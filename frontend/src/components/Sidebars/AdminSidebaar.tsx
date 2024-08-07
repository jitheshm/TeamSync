import { ThemeState } from '@/features/theme/themeSlice';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';
import { usePathname } from 'next/navigation'; // Import usePathname

interface SidebarProps {
    sidebarOpen: boolean;
}

interface RootState {
    theme: ThemeState;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen }) => {
    const { background, text } = useSelector((state: RootState) => state.theme);
    const pathname = usePathname(); // Get the current path

    // Function to determine active link styles
    const getLinkClass = (path: string) => {
        return pathname.startsWith(path) ? 'bg-violet-500' : '';
    };

    return (
        <div
            className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform shadow-lg ${background} lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'}`}
        >
            <div className="flex items-center justify-center mt-8">
                <div className="flex items-center">
                    <img src="/logo.png" alt="" className="w-12 h-12" />
                    <span className={`mx-2 text-2xl font-semibold ${text}`}>TeamSync</span>
                </div>
            </div>

            <nav className="mt-14">
                <Link href="/admin/dashboard">
                    <div className={`flex items-center px-6 py-2 mt-8 ${text} ${pathname === '/admin/dashboard' ? 'bg-violet-500' : ''}`}>
                        <i className={`fa-solid fa-gauge ${text}`} />
                        <span className="mx-3">Dashboard</span>
                    </div>
                </Link>
                <Link href="/admin/dashboard/plans">
                    <div className={`flex items-center px-6 py-2 mt-8 ${text} ${getLinkClass('/admin/dashboard/plans')}`}>
                        <i className={`fa-solid fa-calendar ${text}`} /> {/* Updated icon for clarity */}
                        <span className="mx-3">Plans</span>
                    </div>
                </Link>
                <Link href="/admin/dashboard/subscriptions">
                    <div className={`flex items-center px-6 py-2 mt-8 ${text} ${getLinkClass('/admin/dashboard/subscriptions')}`}>
                        <i className={`fa-solid fa-box ${text}`} /> {/* Updated icon for clarity */}
                        <span className="mx-3">Subscription</span>
                    </div>
                </Link>
                <Link href="/admin/dashboard/users">
                    <div className={`flex items-center px-6 py-2 mt-8 ${text} ${getLinkClass('/admin/dashboard/users')}`}>
                        <i className={`fa-solid fa-users ${text}`} />
                        <span className="mx-3">Users</span>
                    </div>
                </Link>
                {/* Add more navigation items */}
            </nav>
        </div>
    );
};

export default Sidebar;
