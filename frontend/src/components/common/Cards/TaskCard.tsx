import React from 'react'
import randomColor from 'randomcolor'
import fontColorContrast from 'font-color-contrast'
import MoreButton from '../Buttons/MoreButton'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { ITask } from '@/interfaces/Task'

function TaskCard({ data, handleDelete, role, projectId }: { data: ITask, handleDelete: (pId: string) => void, role: string, projectId: string }) {

    const bgColor = randomColor()
    const textFont = fontColorContrast(bgColor)

    return (
        <div className='border border-border rounded-2xl  h-32 p-3  shadow-lg m-4'>
            <div className='flex justify-between'>
                <div className='w-8 h-8 font-semibold  flex justify-center items-center rounded-md ' style={{ backgroundColor: bgColor, color: textFont }}>
                    {data.title.charAt(0).toUpperCase()}
                </div>
                <div>
                    <MoreButton >
                        {
                            role === 'Project_Manager' &&
                            (
                                <>

                                    <Link href={`/employee/project_manager/dashboard/projects/${projectId}/tasks/${data._id}`}>
                                        <DropdownMenuItem>
                                            View
                                        </DropdownMenuItem>
                                    </Link>


                                    <Link href={`/employee/project_manager/dashboard/projects/${projectId}/tasks/${data._id}/edit`}>
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
                            role === 'Developer' &&
                            (
                                <>

                                    <Link href={`/employee/developer/dashboard/projects/${projectId}/tasks/${data._id}`}>
                                        <DropdownMenuItem>
                                            View
                                        </DropdownMenuItem>
                                    </Link>


                                    <Link href={`/employee/developer/dashboard/projects/${projectId}/tasks/${data._id}/tickets`}>
                                        <DropdownMenuItem>
                                            Show Tickets
                                        </DropdownMenuItem>
                                    </Link>





                                </>

                            )

                        }



                        {
                            role === 'Tester' &&
                            (
                                <>

                                    <Link href={`/employee/tester/dashboard/projects/${projectId}/tasks/${data._id}`}>
                                        <DropdownMenuItem>
                                            View
                                        </DropdownMenuItem>
                                    </Link>


                                    <Link href={`/employee/tester/dashboard/projects/${projectId}/tasks/${data._id}/tickets/create`}>
                                        <DropdownMenuItem>
                                            Create Tickets
                                        </DropdownMenuItem>
                                    </Link>

                                    <Link href={`/employee/tester/dashboard/projects/${projectId}/tasks/${data._id}/tickets`}>
                                        <DropdownMenuItem>
                                            Show Tickets
                                        </DropdownMenuItem>
                                    </Link>


                                </>

                            )

                        }

                    </MoreButton>
                </div>
            </div>

            <div className='font-bold mt-2'>
                {data.title}
            </div>

            <div className='font-thin text-xs mt-4 text-right'>
                {new Date(data.due_date).toLocaleDateString()}
            </div>
        </div>
    )
}

export default TaskCard