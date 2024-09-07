"use client"

import { FaLaptopCode } from "react-icons/fa";
import { IoChatbubbleEllipsesOutline, IoVideocamOutline } from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";
import Appbar from "../common/Appbar";
import { ScrollArea } from "../ui/scroll-area";
import ProjectManagerSidebar from "../projectManager/ProjectManagerSidebar";
import ProjectManagerMobileNav from "../projectManager/ProjectManagerMobileNav";


interface TenantProjectManagerLayoutProps {
    children: React.ReactNode;
}



const TenantProjectManagerLayout: React.FC<TenantProjectManagerLayoutProps> = ({ children }) => {
    const icons = [
        {
          icon: RxDashboard,
          name: 'Dashboard',
          link:'/employee/project_manager/dashboard'
        },
        
        {
          icon: FaLaptopCode,
          name: 'Projects',
          link:'/employee/project_manager/dashboard/projects'
        },
        {
          icon: IoChatbubbleEllipsesOutline,
          name: 'Chats',
          link:'/employee/project_manager/dashboard/chats'
        },
        {
          icon: IoVideocamOutline,
          name: 'Meeting',
          link:'/employee/project_manager/dashboard/meeting'
        },
        // {
        //   icon: SlNote,
        //   name: 'Todo',
        //   link:'/employee/project_manager/dashboard/todo'
        // }
      ]

    return (
        <>
            <div className="md:flex hidden ">
                <ProjectManagerSidebar icons={icons}/>
                <div className="w-full">
                    <Appbar icons={icons}/>
                    <ScrollArea className="h-[calc(100vh-3.5rem)] ">
                        {/* body goes here */}
                        {children}
                    </ScrollArea>
                </div>
            </div>
            <div className="md:hidden">
                <ProjectManagerMobileNav icons={icons}/>
                <ScrollArea className="h-[calc(100vh-3.5rem)] ">
                        {/* body goes here */}
                        {children}
                    </ScrollArea>

            </div>
        </>
    );
};

export default TenantProjectManagerLayout;
