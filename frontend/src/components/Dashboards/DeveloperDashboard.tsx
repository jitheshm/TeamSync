"use client"
import { ThemeState } from '@/features/theme/themeSlice';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import TaskCard from '../Cards/TaskCard';
import { fetchTaskStats } from '@/api/projectService/project';
import { logout } from '@/features/user/userSlice';
import { useRouter } from 'next/navigation';


interface TaskStats {
    count: number;
    status: string;
}

interface RootState {

    theme: ThemeState;
}

function DeveloperDashboard() {

    const [pending, setPending] = useState(0)
    const [progress, setProgress] = useState(0)
    const [total, setTotal] = useState(0)
    const [testing, setTesting] = useState(0)

    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(() => {


        fetchTaskStats().then((result) => {
            const data: TaskStats[] = result.data
            console.log(data);
            setTotal(0)

            data.forEach((ele) => {
                console.log(ele);

                if (ele.status === 'pending') {
                    setPending(ele.count)
                    setTotal((prev) => prev + ele.count)

                } else if (ele.status === 'in_progress') {

                    setProgress(ele.count)
                    setTotal((prev) => prev + ele.count)
                } else if (ele.status === 'testing') {
                    setTesting(ele.count)
                    setTotal((prev) => prev + ele.count)
                }
            })
        }).catch((err) => {
            console.log(err);
            if (err.response?.status === 401) {
                dispatch(logout())
                router.push('/employee/login')
            }
        })


    }, [])

    const { background, text, main, dark } = useSelector((state: RootState) => state.theme);

    return (
        <div className='w-full '>
            <div className={`${background} min-h-64 w-11/12 md:w-8/12 mx-auto mt-10 rounded-md flex items-center justify-around flex-wrap px-20 py-10 gap-10`}>

                <TaskCard count={total} title='Total Task' grd1='#0A325A' grd2='#1D5BA9' />
                <TaskCard count={pending} title='Pending Task' grd1='#371B1B' grd2='#A93333' />
                <TaskCard count={progress} title='Progress Task' grd1='#5a2e0a' grd2='#a95c1d' />



            </div>


        </div>
    )
}

export default DeveloperDashboard