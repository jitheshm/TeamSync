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

    // Function to get background color based on the current path
    const getLinkClass = (path: string) => {
        return pathname.startsWith(path) ? 'bg-violet-500' : '';
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
                <Link href="/employee/tester/dashboard">
                    <div className={`flex items-center px-6 py-2 mt-8 ${text} ${pathname === '/employee/tester/dashboard' ? 'bg-violet-500' : ''}`}>
                        <i className={`fa-solid fa-gauge ${text}`} />
                        <span className="mx-3">Dashboard</span>
                    </div>
                </Link>

                <Link href="/employee/tester/dashboard/projects">
                    <div className={`flex items-center px-6 py-2 mt-8 ${text} ${getLinkClass('/employee/tester/dashboard/projects')}`}>
                        <i className={`fa-solid fa-list-check ${text}`} />
                        <span className="mx-3">Projects</span>
                    </div>
                </Link>

                <Link href="/employee/tester/dashboard/chats">
                    <div className={`flex items-center px-6 py-2 mt-8 ${text} ${getLinkClass('/employee/tester/dashboard/chats')}`}>
                        <i className={`fa-regular fa-comments ${text}`} />
                        <span className="mx-3">Chat</span>
                    </div>
                </Link>

                <Link href="/employee/tester/dashboard/meeting">
                    <div className={`flex items-center px-6 py-2 mt-8 ${text} ${getLinkClass('/employee/tester/dashboard/meeting')}`}>
                        <i className={`fa-solid fa-video ${text}`} />
                        <span className="mx-3">Meeting</span>
                    </div>
                </Link>

                <Link href="/employee/tester/dashboard/todo">
                    <div className={`flex items-center px-6 py-2 mt-8 ${text} ${getLinkClass('/employee/tester/dashboard/todo')}`}>
                        <i className={`fa-solid fa-pen ${text}`} />
                        <span className="mx-3">Todo</span>
                    </div>
                </Link>

                {/* Add more navigation items */}
            </nav>
        </div>
    );
};

export default Sidebar;
