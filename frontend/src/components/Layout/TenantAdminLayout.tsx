"use client"
import React, { useState } from 'react';
import Header from '../Headers/Header';
import Sidebar from '../Sidebars/TenantAdminSidebar';
import { useSelector } from 'react-redux';
import { ThemeState } from '@/features/theme/themeSlice';

interface TenantAdminLayoutProps {
    children: React.ReactNode;
}

interface RootState {
    theme: ThemeState
}

const TenantAdminLayout: React.FC<TenantAdminLayoutProps> = ({ children }) => {



    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const { background, text, main } = useSelector((state: RootState) => state.theme)


    return (
        <div className="flex h-screen ">
            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className={`fixed inset-0 z-20 transition-opacity ${background} opacity-50 lg:hidden`}
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            <Sidebar sidebarOpen={sidebarOpen} />

            <div className="flex flex-col flex-1 overflow-hidden">
                <Header setSidebarOpen={setSidebarOpen} />
                <div className={`h-screen ${main} overflow-auto flex justify-center`}>

                    {children}
                </div>
            </div>
        </div>
    );
};

export default TenantAdminLayout;
