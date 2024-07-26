"use client"
import { ThemeState } from '@/features/theme/themeSlice';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import TaskCard from '../Cards/TaskCard';
import { fetchProfit } from '@/api/subscriptionService/subscription';
import { logout } from '@/features/user/userSlice';
import { fetchUsersCount } from '@/api/userService/user';

interface RootState {

    theme: ThemeState;
}

function AdminDashboard() {
    const dispatch = useDispatch()
    const router = useRouter()
    const [profit, setProfit] = useState(0)
    const [usersCount, setusersCount] = useState(0)
    const { background, text, main, dark } = useSelector((state: RootState) => state.theme);

    useEffect(() => {

        fetchProfit().then((result) => {
            setProfit(result.data.total_earned)
        }).catch((err) => {
            if (err.response?.status === 401) {
                dispatch(logout())
                router.push('/admin/login')
            }
        })

        fetchUsersCount().then((result) => {
            setusersCount(result.data.usersCount)
        }).catch((err) => {
            if (err.response?.status === 401) {
                dispatch(logout())
                router.push('/admin/login')
            }
        })


    }, [])


    return (
        <div className='w-full '>
            <div className={`${background} min-h-64 w-11/12 md:w-8/12 mx-auto mt-10 rounded-md flex items-center justify-around flex-wrap px-20 py-10 gap-10`}>

                <TaskCard count={profit} title='Revenue' grd1='from-[#0A325A]' grd2='to-[#1D5BA9]' />
                <TaskCard count={usersCount} title='Users Count' grd1='from-[#0A325A]' grd2='to-[#1D5BA9]' />







            </div>




        </div>
    )
}

export default AdminDashboard