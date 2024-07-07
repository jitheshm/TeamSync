import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { GiHamburgerMenu } from "react-icons/gi";

export default function TenantManagerSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <>
      {/* <div className="min-h-screen bg-gray-900 text-gray-100"> */}

      <div className="bg-[#0f1729] border-b border-gray-700 w-screen h-14  fixed top-0">
        <div className='p-4 md:hidden'>
          <GiHamburgerMenu className='text-white text-3xl cursor-pointer' onClick={toggleSidebar} />
        </div>
        <div className="fixed inset-x-0 mx-auto md:hidden top-3  w-32">
          <img src="/logo.png" className="w-32" alt="Logo" />
        </div>



      </div>

      <div ref={sidebarRef} className={`sidebar fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out min-h-screen w-56 md:w-12 md:hover:w-56 overflow-hidden border-r border-gray-700 bg-inherit shadow-lg`}>
        <div className="flex h-screen flex-col  justify-between pt-2 pb-6">
          <div>
            <div className="w-max p-1 flex align-middle gap-6" >
              <img src="/logo.png" className="w-10" alt="Logo" />
              <h1 className='flex items-center font-semibold'>TeamSync</h1>
            </div>
            <ul className="mt-6 space-y-2 tracking-wide mt-16">
              <li className="min-w-max ">
                <Link href="/dashboard" aria-label="dashboard" className="relative flex items-center space-x-4 bg-gradient-to-r from-sky-600 to-cyan-400 px-4 py-3 text-white">
                  <i className="fa-solid fa-chart-line " style={{ color: '#ffffff' }} />

                  <span className="-mr-1 font-medium">Dashboard</span>
                </Link>
              </li>
              <li className="min-w-max">
                <Link href="/dashboard/branches" className="group flex items-center space-x-4  px-4 py-3 text-gray-400 hover:bg-gray-700">
                  <i className="fa-solid fa-shop group-hover:text-gray-300"  />

                  <span className="group-hover:text-gray-300">Branches</span>
                </Link>
              </li>
              <li className="min-w-max">
                <Link href="/dashboard/users" className="group flex items-center space-x-4  px-4 py-3 text-gray-400 hover:bg-gray-700">
               <i className="fa-solid fa-user-group group-hover:text-gray-300"  />

                  <span className="group-hover:text-gray-300">Users</span>
                </Link>
              </li>
              <li className="min-w-max">
                <Link href="/dashboard/subscription-details" className="group flex items-center space-x-4 rounded-md px-4 py-3 text-gray-400 hover:bg-gray-700">
               <i className="fa-solid fa-credit-card group-hover:text-gray-300"  />

                  <span className="group-hover:text-gray-300">Subscriptions</span>
                </Link>
              </li>
              <li className="min-w-max">
                <Link href="/dashboard/meetings" className="group flex items-center space-x-4 rounded-md px-4 py-3 text-gray-400 hover:bg-gray-700">
               <i className="fa-solid fa-video group-hover:text-gray-300"  />

                  <span className="group-hover:text-gray-300">Meetings</span>
                </Link>
              </li>
              <li className="min-w-max">
                <Link href="/dashboard/chats" className="group flex items-center space-x-4 rounded-md px-4 py-3 text-gray-400 hover:bg-gray-700">
                <i className="fa-solid fa-comments group-hover:text-gray-300"/>

                  <span className="group-hover:text-gray-300">Chats</span>
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-max -mb-3">
            <a href="#" className="group flex items-center space-x-4 rounded-md px-4 py-3 text-gray-400 hover:bg-gray-700">
              <i className="fa-solid fa-right-from-bracket" style={{ color: '#ffffff' }} />

              <span className="group-hover:text-gray-300">Logout</span>
            </a>
          </div>
        </div>
      </div>
      {/* </div> */}
    </>

  );
}
