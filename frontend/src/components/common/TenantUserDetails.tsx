import { User } from '@nextui-org/react'
import React from 'react'

function TenantUserDetails() {
    return (
        <div className='md:px-16'>
            <div className='my-5 flex '>
                <p>
                    User Details
                </p>
            </div>
            <div className='border border-border p-5 rounded-lg'>
                <User
                    name="Jane Doe"
                    description="Product Designer"
                    avatarProps={{
                        src: "https://i.pravatar.cc/150?u=a04258114e29026702d"
                    }}
                />
            </div>
            <div className='mt-8 border border-border p-5 rounded-lg w-full'>
                <div className='w-full lg:w-8/12 flex flex-wrap gap-5 md:gap-0'>
                    <div className='w-full md:w-6/12 flex flex-col gap-5 '>
                        <div>
                            <p className='dark:text-gray-400 text-gray-500'>Name</p>
                            <p>Jithesh M</p>
                        </div>
                        <div>
                            <p className='dark:text-gray-400 text-gray-500'>Email</p>
                            <p>jitheshmjithooz@gmail.com</p>
                        </div>
                    </div>
                    <div className='w-full md:w-6/12 flex flex-col gap-5'>
                        <div>
                            <p className='dark:text-gray-400 text-gray-500'>Branch</p>
                            <p>Kerala</p>
                        </div>
                        <div>
                            <p className='dark:text-gray-400 text-gray-500'>Role</p>
                            <p>Developer</p>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default TenantUserDetails