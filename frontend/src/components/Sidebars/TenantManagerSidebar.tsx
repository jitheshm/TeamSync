import { ThemeState } from '@/features/theme/themeSlice';
import Link from 'next/link';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';  // Import usePathname
import Cookies from 'js-cookie';
import { logout } from '@/features/user/userSlice';
interface SidebarProps {
    sidebarOpen: boolean;
}

interface RootState {
    theme: ThemeState;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen }) => {
    const { background, text } = useSelector((state: RootState) => state.theme);
    const pathname = usePathname();  // Get the current path
    const dispatch = useDispatch()
    // Define a function to get background color based on the current path
    const getLinkClass = (path: string) => {
        return pathname.startsWith(path) ? 'bg-violet-500' : '';
    }

    const handleLogout = () => {
        dispatch(logout())
        // dispatch(adminLogout())
        Cookies.remove('team-sync-token')
        localStorage.removeItem('team-sync-refresh-token');

    }

    return (
        <div
            className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform shadow-lg z-10 ${background} lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'
                }`}
        >
            <div className="flex items-center justify-center mt-8">
                <div className="flex items-center">
                    <img src="/logo.png" alt="" className="w-12 h-12" />
                    <span className={`mx-2 text-2xl font-semibold ${text}`}>TeamSync</span>
                </div>
            </div>

            <nav className="mt-14">
                <Link href="/employee/manager/dashboard">
                    <div className={`flex items-center px-6 py-2 mt-8 ${text} ${pathname === '/employee/manager/dashboard' ? 'bg-violet-500' : ''}`}>
                        <i className={`fa-solid fa-gauge ${text}`} />
                        <span className="mx-3">Dashboard</span>
                    </div>
                </Link>

                <Link href="/employee/manager/dashboard/users">
                    <div className={`flex items-center px-6 py-2 mt-8 ${text} ${getLinkClass('/employee/manager/dashboard/users')}`}>
                        <i className={`fa-solid fa-gauge ${text}`} />
                        <span className="mx-3">Users</span>
                    </div>
                </Link>

                <Link href="/employee/manager/dashboard/projects">
                    <div className={`flex items-center px-6 py-2 mt-8 ${text} ${getLinkClass('/employee/manager/dashboard/projects')}`}>
                        <i className={`fa-solid fa-list-check ${text}`} />
                        <span className="mx-3">Projects</span>
                    </div>
                </Link>

                <Link href="/employee/manager/dashboard/chats">
                    <div className={`flex items-center px-6 py-2 mt-8 ${text} ${getLinkClass('/employee/manager/dashboard/chats')}`}>
                        <i className={`fa-regular fa-comments ${text}`} />
                        <span className="mx-3">Chat</span>
                    </div>
                </Link>

                <Link href="/employee/manager/dashboard/meeting">
                    <div className={`flex items-center px-6 py-2 mt-8 ${text} ${getLinkClass('/employee/manager/dashboard/meeting')}`}>
                        <i className={`fa-solid fa-video ${text}`} />
                        <span className="mx-3">Meeting</span>
                    </div>
                </Link>

                <Link href="/employee/manager/dashboard/todo">
                    <div className={`flex items-center px-6 py-2 mt-8 ${text} ${getLinkClass('/employee/manager/dashboard/todo')}`}>
                        <i className={`fa-solid fa-pen ${text}`} />
                        <span className="mx-3">Todo</span>
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
