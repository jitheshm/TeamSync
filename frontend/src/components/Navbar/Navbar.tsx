"use client"
import { verifyToken } from '@/api/authService/auth'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useDispatch, useSelector } from 'react-redux'
import { verify } from '@/features/user/userSlice'
import Link from 'next/link'
import MobileNav from './MobileNav'

interface UserState {
    name: string
    verified: boolean
    tenantId: string
}

interface RootState {
    user: UserState
}

function Navbar() {
    const { name, verified } = useSelector((state: RootState) => state.user)
    const [mobileNav, setMobileNav] = useState(false)
    const dispatch = useDispatch()

    return (
        <header className="absolute inset-x-0 top-0 z-50 backdrop-blur-md bg-white/30">
            <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1 gap-3">
                    <a href="#" className="-m-1.5 p-1.5">
                        <span className="sr-only">TeamSync</span>
                        <img className="h-8 w-auto" src="/logo.png" alt='TeamSync' />
                    </a>
                    <span className="self-center text-2xl font-semibold whitespace-nowrap text-black">TeamSync</span>
                </div>
                <div className="flex lg:hidden">
                    <button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700" onClick={() => setMobileNav(true)}>
                        <span className="sr-only">Open main menu</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    <a href="#" className="text-sm font-semibold leading-6 text-gray-900">Home</a>
                    <a href="#" className="text-sm font-semibold leading-6 text-gray-900">Features</a>
                    <a href="#" className="text-sm font-semibold leading-6 text-gray-900">Plans</a>
                    <a href="#" className="text-sm font-semibold leading-6 text-gray-900">Follow Us</a>
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <a href="#" className="text-sm font-semibold leading-6 text-gray-900">Log in <span aria-hidden="true">→</span></a>
                </div>
            </nav>
            {/* Mobile menu, show/hide based on menu open state. */}
            {
                mobileNav && <MobileNav setMobileNav={setMobileNav} />
            }
        </header>
    )
}

export default Navbar
