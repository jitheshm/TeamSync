import React from 'react'
import randomColor from 'randomcolor'
import fontColorContrast from 'font-color-contrast'
import MoreButton from '../Buttons/MoreButton'
import { IProjects } from '@/interfaces/Project'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import Link from 'next/link'

function ProjectCard({ data, handleDelete, role }: { data: IProjects, handleDelete: (projectId: string) => void, role: string }) {

    const bgColor = randomColor()
    const textFont = fontColorContrast(bgColor)

    return (
        <div className='border border-border rounded-2xl  h-32 p-3  shadow-lg m-4'>
            <div className='flex justify-between'>
                <div className='w-8 h-8 font-semibold  flex justify-center items-center rounded-md ' style={{ backgroundColor: bgColor, color: textFont }}>
                    {data.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <MoreButton >
                        {
                            role === 'Manager' &&
                            (
                                <>

                                    <Link href={`/employee/manager/dashboard/projects/${data._id}`}>
                                        <DropdownMenuItem>
                                            View
                                        </DropdownMenuItem>
                                    </Link>


                                    <Link href={`/employee/manager/dashboard/projects/${data._id}/edit`}>
                                        <DropdownMenuItem>
                                            Edit
                                        </DropdownMenuItem>
                                    </Link>

                                    <DropdownMenuItem onClick={() => handleDelete(data._id)}>
                                        Delete
                                    </DropdownMenuItem>
                                </>

                            )

                        }

                        {
                            role === 'Project_Manager' &&
                            (
                                <>

                                    <Link href={`/employee/project_manager/dashboard/projects/${data._id}`}>
                                        <DropdownMenuItem>
                                            View
                                        </DropdownMenuItem>
                                    </Link>


                                    <Link href={`/employee/project_manager/dashboard/projects/${data._id}/tasks/create`}>
                                        <DropdownMenuItem>
                                            Create Task
                                        </DropdownMenuItem>
                                    </Link>


                                    <Link href={`/employee/project_manager/dashboard/projects/${data._id}/tasks`}>
                                        <DropdownMenuItem>
                                            Show Tasks
                                        </DropdownMenuItem>
                                    </Link>


                                </>

                            )

                        }

                        {
                            role === 'Developer' &&
                            (
                                <>

                                    <Link href={`/employee/developer/dashboard/projects/${data._id}`}>
                                        <DropdownMenuItem>
                                            View
                                        </DropdownMenuItem>
                                    </Link>


                                    <Link href={`/employee/developer/dashboard/projects/${data._id}/tasks`}>
                                        <DropdownMenuItem>
                                            Show Tasks
                                        </DropdownMenuItem>
                                    </Link>


                                </>

                            )

                        }

                        {
                            role === 'Tester' &&
                            (
                                <>

                                    <Link href={`/employee/tester/dashboard/projects/${data._id}`}>
                                        <DropdownMenuItem>
                                            View
                                        </DropdownMenuItem>
                                    </Link>


                                    <Link href={`/employee/tester/dashboard/projects/${data._id}/tasks`}>
                                        <DropdownMenuItem>
                                            Show Tasks
                                        </DropdownMenuItem>
                                    </Link>


                                </>

                            )

                        }

                    </MoreButton>
                </div>
            </div>

            <div className='font-bold mt-2'>
                {data.name}
            </div>
            <div className='font-medium mt-1 text-xs'>
                {data.client_name}
            </div>
            <div className='font-thin text-xs text-right'>
                {data.created_at}
            </div>
        </div>
    )
}

export default ProjectCard