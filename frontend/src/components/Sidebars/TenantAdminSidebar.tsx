import { ThemeState } from '@/features/theme/themeSlice';
import Link from 'next/link';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePathname } from 'next/navigation'; // Import usePathname
import { logout } from '@/features/user/userSlice';
import Cookies from 'js-cookie';
interface SidebarProps {
    sidebarOpen: boolean;
}

interface RootState {
    theme: ThemeState;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen }) => {
    const { background, text } = useSelector((state: RootState) => state.theme);
    const pathname = usePathname(); // Get the current path
    const dispatch=useDispatch()
    // Function to determine active link styles
    const getLinkClass = (path: string) => {
        return pathname.startsWith(path) ? 'bg-violet-500' : '';
    }

    const handleLogout = () => {
        dispatch(logout())
        // dispatch(adminLogout())
        Cookies.remove('team-sync-token')
    }

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
                <Link href="/dashboard">
                    <div className={`flex items-center px-6 py-2 mt-8 ${text} ${pathname === '/dashboard' ? 'bg-violet-500' : ''}`}>
                        <i className={`fa-solid fa-gauge ${text}`} />
                        <span className="mx-3">Dashboard</span>
                    </div>
                </Link>
                <Link href="/dashboard/branches">
                    <div className={`flex items-center px-6 py-2 mt-8 ${text} ${getLinkClass('/dashboard/branches')}`}>
                        <i className={`fa-solid fa-branch ${text}`} /> {/* Updated icon for clarity */}
                        <span className="mx-3">Branches</span>
                    </div>
                </Link>
                <Link href="/dashboard/users">
                    <div className={`flex items-center px-6 py-2 mt-8 ${text} ${getLinkClass('/dashboard/users')}`}>
                        <i className={`fa-solid fa-users ${text}`} /> {/* Updated icon for clarity */}
                        <span className="mx-3">Users</span>
                    </div>
                </Link>
                <Link href="/dashboard/subscription-details">
                    <div className={`flex items-center px-6 py-2 mt-8 ${text} ${getLinkClass('/dashboard/subscription-details')}`}>
                        <i className={`fa-solid fa-list-check ${text}`} />
                        <span className="mx-3">Subscription</span>
                    </div>
                </Link>

                <div className='px-10 mt-10 lg:hidden'>
                    <button onClick={handleLogout} type="button" className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2  dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">Logout</button>

                </div>
                {/* Add more navigation items */}
            </nav>
        </div>
    );
};

export default Sidebar;
