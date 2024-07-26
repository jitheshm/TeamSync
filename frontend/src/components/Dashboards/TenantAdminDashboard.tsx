"use client"
import React, { useEffect, useState } from 'react'
import Slider from '../TenantUserPanel/Slider/Slider'
import { IProjects } from '@/interfaces/Project'
import { fetchTenantRecentProjects } from '@/api/projectService/project'
import { useDispatch } from 'react-redux'
import { logout } from '@/features/user/userSlice'
import { useRouter } from 'next/navigation'
import Cards from '../TenantUserPanel/Cards/Cards'

function TenantAdminDashboard() {
    const [projects, setProjects] = useState<IProjects[]>([])
    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(() => {
        fetchTenantRecentProjects().then((result) => {
            console.log(result);
            setProjects(result.data)
        }).catch((err) => {
            console.log(err);
            if (err.response?.status === 401) {
                dispatch(logout())
                router.push('/employee/login')
            }
        })


    }, [])

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

        </div>
    )
}

export default TenantAdminDashboard