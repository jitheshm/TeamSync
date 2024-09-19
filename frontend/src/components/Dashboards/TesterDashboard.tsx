"use client"
import { ThemeState } from '@/features/theme/themeSlice';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTaskStats, fetchTicketStats } from '@/api/projectService/project';
import { logout } from '@/features/user/userSlice';
import { useRouter } from 'next/navigation';
import PieCharts from '../Charts/PieChart';
import { PieValueType } from '@mui/x-charts/models';
import StatsCard from '../common/Cards/StatsCard';


interface TaskStats {
    count: number;
    status: string;
}

interface TicketStats {
    count: number;
    status: string;
}

interface RootState {

    theme: ThemeState;
}

function TesterDashboard() {

    const [pending, setPending] = useState(0)
    const [progress, setProgress] = useState(0)
    const [total, setTotal] = useState(0)
    const [testing, setTesting] = useState(0)
    const [ticketStats, setTicketStats] = useState<TicketStats[]>([])


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


        fetchTicketStats().then((result) => {
            console.log(result, "res");
            setTicketStats(result.data)
        }).catch((err) => {
            console.log(err);
            if (err.response?.status === 401) {
                dispatch(logout())
                router.push('/employee/login')
            }
        })


    }, [])

    const data: PieValueType[] = ticketStats
        .map((ele, index) => ({
            id: index,
            value: ele.count,
            label: ele.status,
            color: ele.status === 'pending' ? 'red' : ele.status === 'resolved' ? 'orange' : 'green'
        }));


    return (
        <div>
            <div className='min-h-64 w-12/12 md:w-12/12 mx-auto mt-5 rounded-md flex items-center justify-around flex-wrap px-10 md:px-20 py-10 gap-10'>
                <StatsCard count={total} title='Total Task' className='border border-blue-500 md:w-3/12 lg:w-2/12 w-full sm:w-4/12 ' />
                <StatsCard count={pending} title='Pending Task' className='border border-red-500 md:w-3/12 lg:w-2/12 w-full sm:w-4/12' />
                <StatsCard count={progress} title='Progress Task' className='border border-yellow-500 md:w-3/12 lg:w-2/12 w-full sm:w-4/12' />
                <StatsCard count={testing} title='Testing Task' className='border border-green-500 md:w-3/12 lg:w-2/12 w-full sm:w-4/12' />
            </div>
            <div className='mx-auto   text-white md:w-[400px]'>
                <div className='text-center my-10'>
                    <p className='font-bold text-2xl'>Overall Ticket Stats</p>
                </div>
                {
                    data.length === 0 ? <p className='text-center'>No Data Available</p> : <PieCharts data={data} />
                }

            </div>
        </div>
    )
}

export default TesterDashboard