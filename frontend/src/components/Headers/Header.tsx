import { ThemeState, toogleTheme } from '@/features/theme/themeSlice';
import { logout } from '@/features/user/userSlice';
import { logout as adminLogout } from '@/features/admin/adminSlice';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';

interface HeaderProps {
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface RootState {
    theme: ThemeState
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
    const [notificationOpen, setNotificationOpen] = useState<boolean>(false);
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const { background, text, main } = useSelector((state: RootState) => state.theme)
    const dispatch = useDispatch()
    const handleThemeToogle = () => {
        dispatch(toogleTheme())
    }

    const handleLogout = () => {
        dispatch(logout())
        dispatch(adminLogout())
        Cookies.remove('team-sync-token')
    }

    return (
        <header className={`flex items-center ${background} justify-between shadow-lg lg:z-50 px-6 py-6 lg:py-6  ${background === 'bg-gray-100' ? 'border-b border-gray-300' : ""} shadow-md  `}>
            <div className="flex items-center">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className=" focus:outline-none lg:hidden"
                >
                    <i className={`fa-solid fa-bars ${text}`} />
                </button>
            </div>

            <div className="flex items-center me-20">
                <div className='px-10 '>
                    <button onClick={handleLogout} type="button" className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2  dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">Logout</button>

                </div>

                {/* <div onClick={handleThemeToogle}>
                    {
                        background === 'bg-gray-100' ? <i className={`fa-solid fa-moon ${text}`} /> : <i className={`fa-solid fa-sun ${text}`} />
                    }

                </div> */}
            </div>
        </header>
    );
};

export default Header;
