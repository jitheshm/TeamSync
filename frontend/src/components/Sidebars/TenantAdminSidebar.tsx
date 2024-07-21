// import { logout } from '@/features/user/userSlice';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import React, { useState, useEffect, useRef } from 'react';
// import { GiHamburgerMenu } from "react-icons/gi";
// import { useDispatch } from 'react-redux';
// import cookie from 'js-cookie';


// export default function TenantManagerSidebar() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const sidebarRef = useRef(null);
//   const dispacth = useDispatch()
//   const router = useRouter()

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const handleClickOutside = (event) => {
//     if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
//       setIsSidebarOpen(false);
//     }
//   };

//   useEffect(() => {
//     if (isSidebarOpen) {
//       document.addEventListener('click', handleClickOutside);
//     } else {
//       document.removeEventListener('click', handleClickOutside);
//     }
//     return () => {
//       document.removeEventListener('click', handleClickOutside);
//     };
//   }, [isSidebarOpen]);

//   const handleLogout = () => {
//     cookie.remove('team-sync-token')
//     dispacth(logout())
//     router.push('/login')
//   }

//   return (
//     <>
//       {/* <div className="min-h-screen bg-gray-900 text-gray-100"> */}

//       <div className="bg-[#0f1729] border-b border-gray-700 w-screen h-14  fixed top-0">
//         <div className='p-4 md:hidden'>
//           <GiHamburgerMenu className='text-white text-3xl cursor-pointer' onClick={toggleSidebar} />
//         </div>
//         <div className="fixed inset-x-0 mx-auto md:hidden top-3 flex justify-center gap-3  w-32">
//           <img src="/logo.png" className="w-10" alt="Logo" />
//           <h1 className='flex items-center font-semibold'>TeamSync</h1>
//         </div>



//       </div>

//       <div ref={sidebarRef} className={`sidebar fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out min-h-screen w-56 md:w-12 md:hover:w-56 overflow-hidden border-r border-gray-700 bg-inherit shadow-lg`}>
//         <div className="flex h-screen flex-col  justify-between pt-2 pb-6">
//           <div>
//             <div className="w-max p-1 flex align-middle gap-6" >
//               <img src="/logo.png" className="w-10" alt="Logo" />
//               <h1 className='flex items-center font-semibold'>TeamSync</h1>
//             </div>
//             <ul className=" space-y-6 tracking-wide mt-16">
//               <li className="min-w-max ">
//                 <Link href="/dashboard" aria-label="dashboard" className="relative flex items-center space-x-4 bg-gradient-to-r from-sky-600 to-cyan-400 px-4 py-3 text-white">
//                   <i className="fa-solid fa-chart-line " style={{ color: '#ffffff' }} />

//                   <span className="-mr-1 font-medium">Dashboard</span>
//                 </Link>
//               </li>
//               <li className="min-w-max">
//                 <Link href="/dashboard/branches" className="group flex items-center space-x-4  px-4 py-3 text-gray-400 hover:bg-gray-700">
//                   <i className="fa-solid fa-shop group-hover:text-gray-300" />

//                   <span className="group-hover:text-gray-300">Branches</span>
//                 </Link>
//               </li>
//               <li className="min-w-max">
//                 <Link href="/dashboard/users" className="group flex items-center space-x-4  px-4 py-3 text-gray-400 hover:bg-gray-700">
//                   <i className="fa-solid fa-user-group group-hover:text-gray-300" />

//                   <span className="group-hover:text-gray-300">Users</span>
//                 </Link>
//               </li>
//               <li className="min-w-max">
//                 <Link href="/dashboard/subscription-details" className="group flex items-center space-x-4 rounded-md px-4 py-3 text-gray-400 hover:bg-gray-700">
//                   <i className="fa-solid fa-credit-card group-hover:text-gray-300" />

//                   <span className="group-hover:text-gray-300">Subscriptions</span>
//                 </Link>
//               </li>
//               <li className="min-w-max">
//                 <Link href="/dashboard/meeting" className="group flex items-center space-x-4 rounded-md px-4 py-3 text-gray-400 hover:bg-gray-700">
//                   <i className="fa-solid fa-video group-hover:text-gray-300" />

//                   <span className="group-hover:text-gray-300">Meetings</span>
//                 </Link>
//               </li>
              
//             </ul>
//           </div>
//           <div className="w-max -mb-3">
//             <button onClick={handleLogout} className="group flex items-center space-x-4 rounded-md px-4 py-3 text-gray-400 hover:bg-gray-700">
//               <i className="fa-solid fa-right-from-bracket" style={{ color: '#ffffff' }} />

//               <span className="group-hover:text-gray-300">Logout</span>
//             </button>
//           </div>
//         </div>
//       </div>
//       {/* </div> */}
//     </>

//   );
// }


import { ThemeState } from '@/features/theme/themeSlice';
import Link from 'next/link';
import React, { use } from 'react';
import { useSelector } from 'react-redux';

interface SidebarProps {
    sidebarOpen: boolean;
}
interface RootState {
    theme: ThemeState
}
const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen }) => {
    const { background, text } = useSelector((state: RootState) => state.theme)

    return (
        <div
            className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform  shadow-lg z-10 ${background} lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'
                }`}
        >
            <div className="flex items-center justify-center mt-8">
                <div className="flex items-center">
                    <img src="/logo.png" alt="" className="w-12 h-12" />
                    <span className={`mx-2 text-2xl font-semibold ${text}`}>TeamSync</span>
                </div>
            </div>

            <nav className="mt-14">
                <Link href="/">
                    <div className={`flex items-center px-6 py-2 mt-8 ${text} bg-gray-700 bg-opacity-25`}>
                        <i className={`fa-solid fa-gauge ${text}`} />
                        <span className="mx-3">Dashboard</span>
                    </div>
                </Link>
                <Link href="/dashboard/branches">
                    <div className={`flex items-center px-6 py-2 mt-8 ${text} bg-opacity-25`}>
                        <i className={`fa-solid fa-gauge ${text}`} />
                        <span className="mx-3">Branches</span>
                    </div>
                </Link>
                <Link href="/dashboard/users">
                    <div className={`flex items-center px-6 py-2 mt-8 ${text} bg-opacity-25`}>
                        <i className={`fa-solid fa-gauge ${text}`} />
                        <span className="mx-3">Users</span>
                    </div>
                </Link>

                <Link href="/dashboard/subscription-details">
                    <div className={`flex items-center px-6 py-2 mt-8 ${text}  bg-opacity-25`}>
                        <i className={`fa-solid fa-list-check ${text}`} />
                        <span className="mx-3">Subscription</span>
                    </div>
                </Link>

                

                {/* Add more navigation items */}
            </nav>
        </div>
    );
};

export default Sidebar;
