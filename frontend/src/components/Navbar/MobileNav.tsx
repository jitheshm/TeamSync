import Link from 'next/link'
import React from 'react'
import { useSelector } from 'react-redux'


interface UserState {
  name: string
  verified: boolean
  tenantId: string
}

interface RootState {
  user: UserState
}

function MobileNav({ setMobileNav }: { setMobileNav: React.Dispatch<React.SetStateAction<boolean>> }) {
  const { name, verified } = useSelector((state: RootState) => state.user)
  return (
    <div className="lg:hidden" role="dialog" aria-modal="true">
      {/* Background backdrop, show/hide based on slide-over state. */}
      <div className="fixed inset-0 z-50" />
      <div className="fixed top-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div className="flex items-center justify-between">
          <div className="flex lg:flex-1 gap-3">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only ">TeamSync</span>
              <img className="h-8 w-auto" src="/logo.png" alt='TeamSync' />

            </a>
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-black">TeamSync</span>
          </div>
          <button type="button" className="-m-2.5 rounded-md p-2.5 text-gray-700" onClick={() => setMobileNav(false)}>
            <span className="sr-only">Close menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mt-6 flow-root">
          <div className="-my-6 divide-y divide-gray-500/10">
            <div className="space-y-2 py-6">
              <a href="/#home" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Home</a>
              <a href="/#features" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Features</a>
              <a href="/#plans" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Plans</a>
              <a href="/#follow" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Follow Us</a>
            </div>
            <div className="py-6">
              {
                verified ? <Link href={'/dashboard/'} className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Dashboard</Link> : <a href="/login" className="text-sm font-semibold leading-6 text-gray-900">Log in <span aria-hidden="true">→</span></a>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileNav