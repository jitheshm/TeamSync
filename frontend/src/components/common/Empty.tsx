import React from 'react'
import { FaFolderOpen } from "react-icons/fa";

function Empty() {
    return (

        <div className='w-full'>
            <section className="container px-4 mx-auto ">

                <div className="flex items-center mt-6 text-center  h-96 dark:border-gray-700 ">
                    <div className="flex flex-col w-full max-w-sm px-4 mx-auto">
                        <div className="p-3 mx-auto text-6xl text-primary  rounded-full">
                            <FaFolderOpen />
                        </div>
                        <h1 className="mt-3 text-lg text-gray-800 dark:text-white">No data found</h1>
                        
                    </div>
                </div>

            </section>
        </div>

    )
}

export default Empty