import { ThemeState, toogleTheme } from '@/features/theme/themeSlice';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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

    return (
        <header className={`flex items-center ${background} justify-between shadow-lg lg:z-50 px-6 py-6 lg:py-6  ${background==='bg-gray-100'?'border-b border-gray-300':""} shadow-md  `}>
            <div className="flex items-center">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className=" focus:outline-none lg:hidden"
                >
                    <i className={`fa-solid fa-bars ${text}`} />
                </button>
            </div>

            <div className="flex items-center me-20">
                {/* Notification dropdown */}
                {/* User dropdown */}
                <div onClick={handleThemeToogle}>
                    {
                        background === 'bg-gray-100' ? <i className={`fa-solid fa-moon ${text}`} /> : <i className={`fa-solid fa-sun ${text}`} />
                    }
                    
                </div>
            </div>
        </header>
    );
};

export default Header;
