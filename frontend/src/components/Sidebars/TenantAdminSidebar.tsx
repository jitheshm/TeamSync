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
          <img src="https://tailus.io/images/logo.svg" className="w-32" alt="Logo" />
        </div>



      </div>

      <div ref={sidebarRef} className={`sidebar fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out min-h-screen w-56 md:w-12 md:hover:w-56 overflow-hidden border-r border-gray-700 bg-inherit shadow-lg`}>
        <div className="flex h-screen flex-col  justify-between pt-2 pb-6">
          <div>
            <div className="w-max p-2.5">
              <img src="https://tailus.io/images/logo.svg" className="w-32" alt="Logo" />
            </div>
            <ul className="mt-6 space-y-2 tracking-wide mt-16">
              <li className="min-w-max ">
                <Link href="/dashboard" aria-label="dashboard" className="relative flex items-center space-x-4 bg-gradient-to-r from-sky-600 to-cyan-400 px-4 py-3 text-white">
                <i className="fa-solid fa-chart-line" style={{color: '#ffffff'}} />

                  <span className="-mr-1 font-medium">Dashboard</span>
                </Link>
              </li>
              <li className="min-w-max">
                <Link href="/dashboard/branches" className="group flex items-center space-x-4 rounded-full px-4 py-3 text-gray-400 hover:bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path className="fill-current text-gray-300 group-hover:text-cyan-300" fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z" clipRule="evenodd" />
                    <path className="fill-current text-gray-600 group-hover:text-cyan-600" d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
                  </svg>
                  <span className="group-hover:text-gray-300">Branches</span>
                </Link>
              </li>
              <li className="min-w-max">
                <Link href="/dashboard/users" className="group flex items-center space-x-4 rounded-full px-4 py-3 text-gray-400 hover:bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path className="fill-current text-gray-300 group-hover:text-cyan-300" fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z" clipRule="evenodd" />
                    <path className="fill-current text-gray-600 group-hover:text-cyan-600" d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
                  </svg>
                  <span className="group-hover:text-gray-300">Users</span>
                </Link>
              </li>
              <li className="min-w-max">
                <Link href="/dashboard/subscription-details" className="group flex items-center space-x-4 rounded-md px-4 py-3 text-gray-400 hover:bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path className="fill-current text-gray-600 group-hover:text-cyan-600" fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
                    <path className="fill-current text-gray-300 group-hover:text-cyan-300" d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
                  </svg>
                  <span className="group-hover:text-gray-300">Subscriptions</span>
                </Link>
              </li>
              <li className="min-w-max">
                <Link href="/dashboard/meetings" className="group flex items-center space-x-4 rounded-md px-4 py-3 text-gray-400 hover:bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path className="fill-current text-gray-600 group-hover:text-cyan-600" d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                    <path className="fill-current text-gray-300 group-hover:text-cyan-300" d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                  </svg>
                  <span className="group-hover:text-gray-300">Meetings</span>
                </Link>
              </li>
              <li className="min-w-max">
                <Link href="/dashboard/chats" className="group flex items-center space-x-4 rounded-md px-4 py-3 text-gray-400 hover:bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path className="fill-current text-gray-300 group-hover:text-cyan-300" d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path className="fill-current text-gray-600 group-hover:text-cyan-600" fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h6a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                  <span className="group-hover:text-gray-300">Chats</span>
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-max -mb-3">
            <a href="#" className="group flex items-center space-x-4 rounded-md px-4 py-3 text-gray-400 hover:bg-gray-700">
            <i className="fa-solid fa-right-from-bracket" style={{color: '#ffffff'}} />

              <span className="group-hover:text-gray-300">Logout</span>
            </a>
          </div>
        </div>
      </div>
      {/* </div> */}
    </>

  );
}
