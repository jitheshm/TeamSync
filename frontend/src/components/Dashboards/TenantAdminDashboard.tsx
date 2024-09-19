"use client"
import React, { useEffect, useState } from 'react'
import { IProjects } from '@/interfaces/Project'
import { fetchBranchProjectCount, fetchTenantRecentProjects } from '@/api/projectService/project'
import { useDispatch } from 'react-redux'
import { logout } from '@/features/user/userSlice'
import { useRouter } from 'next/navigation'
import Barchart from '../Charts/Barchart'
import Empty from '../common/Empty'
import { CarouselComponent } from '../common/Carousel'

function TenantAdminDashboard() {
    const [projects, setProjects] = useState<IProjects[]>([])
    const [dataValues, setDataValues] = useState<number[]>([])
    const [dataNames, setDataNames] = useState<string[]>([])
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
                router.push('/login')
            }
        })

        fetchBranchProjectCount('week').then((result) => {
            console.log(result);
            setDataValues(result.data.map((project: any) => project.count))
            setDataNames(result.data.map((project: any) => project.branchName))

        }).catch((err) => {
            console.log(err);
            if (err.response?.status === 401) {
                dispatch(logout())
                router.push('/login')
            }
        })




    }, [])



    return (
        <div className=''> 
            <div className='mt-10' >
                <p className='font-bold text-2xl text-center'>Recent Projects</p>
            </div>
            {
                projects.length > 0 ?
                    <div className='mx-auto flex w-fit mt-3'>
                        <CarouselComponent projects={projects} />
                    </div>
                    :
                    <Empty />
            }
            <div className='md:w-5/12 mx-auto mt-24'>
                <p className='font-bold text-2xl text-center'> Projects Count</p>
                {

                    dataValues.length === 0 ? <Empty /> :

                        <Barchart dataValues={dataValues} dataNames={dataNames} />
                }
            </div>

        </div>
    )
}

export default TenantAdminDashboard