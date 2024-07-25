"use client"
import React, { useEffect, useState } from 'react'
import Slider from '../TenantUserPanel/Slider/Slider'
import Cards from '../TenantUserPanel/Cards/Cards'
import { fetchProjectsstats, fetchRecentProjects } from '@/api/projectService/project'
import { useDispatch } from 'react-redux'
import { logout } from '@/features/user/userSlice'
import { useRouter } from 'next/navigation'
import { IProjects } from '@/interfaces/Project'
import PieCharts from '../Charts/PieChart'
import { PieValueType } from '@mui/x-charts/models'

interface ProjectStat {
    count: number;
    stage: string;
}

function TenantManagerDashboard() {
    const [projects, setProjects] = useState<IProjects[]>([])
    const [projectStats, setProjectStats] = useState<ProjectStat[]>([])
    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(() => {
        fetchRecentProjects().then((result) => {
            console.log(result);
            setProjects(result.data)
        }).catch((err) => {
            console.log(err);
            if (err.response?.status === 401) {
                dispatch(logout())
                router.push('/employee/login')
            }
        })

        fetchProjectsstats().then((result) => {
            console.log(result);
            setProjectStats(result.data)
        }).catch((err) => {
            console.log(err);
            if (err.response?.status === 401) {
                dispatch(logout())
                router.push('/employee/login')
            }
        })
    }, [dispatch, router])

    const data: PieValueType[] = projectStats
        .filter(ele => ele.stage !== 'completed')
        .map((ele, index) => ({
            id: index,
            value: ele.count,
            label: ele.stage,
            color: ele.stage === 'pending' ? 'red' : 'yellow'
        }));

    return (
        <div className='w-full '>
            <div className='mt-10' >
                <p className='font-bold text-2xl text-center'>Recent Projects</p>
            </div>
            <Slider>
                {
                    projects.map((project) => (
                        <Cards data={project} key={project._id} />
                    ))
                }
            </Slider>
            <div className='mx-auto   text-white md:w-[400px]'>
                <div className='text-center my-24'>
                    <p className='font-bold text-2xl'>Overall Project Stats</p>
                </div>
                <PieCharts data={data} />
            </div>
        </div>
    )
}

export default TenantManagerDashboard