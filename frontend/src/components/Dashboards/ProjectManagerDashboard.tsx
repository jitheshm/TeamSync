"use client"
import React, { useEffect, useState } from 'react'
import Slider from '../TenantUserPanel/Slider/Slider'
import Cards from '../TenantUserPanel/Cards/Cards'
import { fetchPMTaskStats, fetchProjectsstats, fetchRecentPMProjects, fetchRecentProjects } from '@/api/projectService/project'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/features/user/userSlice'
import { useRouter } from 'next/navigation'
import { IProjects } from '@/interfaces/Project'
import PieCharts from '../Charts/PieChart'
import { PieValueType } from '@mui/x-charts/models'
import { ReduxUserState } from '@/interfaces/User'

interface TaskStats {
    count: number;
    status: string;
}

interface RootState {
    user: ReduxUserState;

}

function ProjectManagerDashboard() {
    const [projects, setProjects] = useState<IProjects[]>([])
    const [taskStats, setTaskStats] = useState<TaskStats[]>([])
    const dispatch = useDispatch()
    const router = useRouter()
    const { id, verified } = useSelector((state: RootState) => state.user);


    useEffect(() => {
        fetchRecentPMProjects(id).then((result) => {
            console.log(result);
            setProjects(result.data)
        }).catch((err) => {
            console.log(err);
            if (err.response?.status === 401) {
                dispatch(logout())
                router.push('/employee/login')
            }
        })

        fetchPMTaskStats(id).then((result) => {
            console.log(result);
            setTaskStats(result.data)
        }).catch((err) => {
            console.log(err);
            if (err.response?.status === 401) {
                dispatch(logout())
                router.push('/employee/login')
            }
        })
    }, [])

    const data: PieValueType[] = taskStats
        .map((ele, index) => ({
            id: index,
            value: ele.count,
            label: ele.status,
            color: ele.status === 'pending' ? 'red' : ele.status === 'in_progress' ? 'yellow' : 'green'
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
                    <p className='font-bold text-2xl'>Overall Task Stats</p>
                </div>
                <PieCharts data={data} />
            </div>
        </div>
    )
}

export default ProjectManagerDashboard