"use client"
import React, { useState } from 'react';
import Header from '../Headers/Header';
import { useSelector } from 'react-redux';
import { ThemeState } from '@/features/theme/themeSlice';
import Sidebar from '../Sidebars/AdminSidebaar';

interface AdminLayoutProps {
    children: React.ReactNode;
}

interface RootState {
    theme: ThemeState
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {



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

export default AdminLayout;
