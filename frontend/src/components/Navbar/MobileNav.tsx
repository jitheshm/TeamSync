import { logout } from '@/features/user/userSlice'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import { motion } from 'framer-motion'

interface UserState {
  name: string
  verified: boolean
  tenantId: string
}

interface RootState {
  user: UserState
}

function MobileNav({ setMobileNav }: { setMobileNav: React.Dispatch<React.SetStateAction<boolean>> }) {
  const { name, verified, tenantId } = useSelector((state: RootState) => state.user)
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
 
<motion.div
      className="md:hidden fixed z-50 w-full"
      role="dialog"
      aria-modal="true"
      initial={{ opacity: 0, y: -50 }} // Fade in from top
      animate={{ opacity: 1, y: 0 }}  // Final state (fully visible and in place)
      exit={{ opacity: 0, y: -50 }}   // Exit state (fade out upwards)
      transition={{ duration: 0.3 }}  // Animation duration
    >
    <div className="md:hidden fixed  z-50 bg-neutral-800 w-11/12 left-1/2 transform -translate-x-1/2 rounded-xl p-6" role="dialog" aria-modal="true">
      <Link href={'/'}><div className='mb-3'>Home</div></Link>
      <Link href={'/#product'}><div className='mb-3'>Product</div></Link>
      <Link href={'/#features'}><div className='mb-3'>Features</div></Link>
      <Link href={'/#pricing'}><div className='mb-3'>Pricing</div></Link>
      <Link href={'/#reviews'}><div className='mb-3'>Reviews</div></Link>
      <Link href={'/#contact'}><div className='mb-3'>Contact us</div></Link>
      <div className="py-6">
        {
          verified ? tenantId ?

            <Link href={'/dashboard/'} className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold t shadow-sm ">Dashboard</Link>
            :
            <>
              <Link href={'/subscription-plans/'} className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold  shadow-sm ">Choose a plan</Link>
              <button onClick={handleLogout} type="button" className="text-sm font-semibold leading-6 text-gray-100">Logout</button>
            </>
            : <Link href="/login" className="text-sm font-semibold leading-6 text-gray-100">Log in <span aria-hidden="true">→</span></Link>
        }
      </div>
    </div>
    </motion.div>
  )
}

export default MobileNav