"use client"
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useDispatch, useSelector } from 'react-redux'
import { logout, verify } from '@/features/user/userSlice'
import Link from 'next/link'
import MobileNav from './MobileNav'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'

interface UserState {
    name: string
    verified: boolean
    tenantId: string
}

interface RootState {
    user: UserState
}

function Navbar() {
    const { name, verified, tenantId } = useSelector((state: RootState) => state.user)
    const [mobileNav, setMobileNav] = useState(false)
    const dispatch = useDispatch()
    const router = useRouter()

    const handleLogout = () => {
        dispatch(logout())
        // dispatch(adminLogout())
        Cookies.remove('team-sync-token')
        localStorage.removeItem('team-sync-refresh-token');
        router.push('/login')

    }

    return (
        <>
            <header className="  inset-x-0 top-0 z-50  ">
                <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                    <div className="flex lg:flex-1 gap-3">
                        <a href="/" className="-m-1.5 p-1.5">
                            <span className="sr-only text-white">TeamSync</span>
                            <img className="h-7 w-auto" src="/logo.png" alt='TeamSync' />
                        </a>
                        <span className="self-center text-xl font-medium whitespace-nowrap text-White">TeamSync</span>
                    </div>
                    <div className="flex md:hidden">
                        <button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700" onClick={() => setMobileNav(!mobileNav)}>
                            <span className="sr-only">Open main menu</span>
                            {
                                !mobileNav ? <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg> : <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>

                            }
                        </button>
                    </div>

                    <div className="hidden md:flex lg:flex-1 lg:justify-end">
                        {
                            verified ? tenantId ? <Link href={'/dashboard/'} ><Button>Dashboard</Button></Link> :
                                <>
                                    <Link href={'/subscription-plans/'} className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Choose a plan</Link>
                                    <button onClick={handleLogout} type="button" className="mx-10 text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2  dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">Logout</button>
                                </>

                                : <Link href="/login" className="text-sm font-semibold leading-6 text-gray-900">Log in <span aria-hidden="true">→</span></Link>
                        }

                    </div>
                </nav>
                {/* Mobile menu, show/hide based on menu open state. */}

            </header>
            {
                mobileNav && <MobileNav setMobileNav={setMobileNav} />
            }
        </>
    )
}

export default Navbar
