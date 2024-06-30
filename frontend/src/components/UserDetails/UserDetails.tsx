"use client"
import { fetchUser } from '@/api/userService/user'
import React, { useEffect, useState } from 'react'
import SubscriptionDetails from './SubscriptionDetails'
import { ISubscriptionDetails } from '@/interfaces/subscription'
import Empty from '../Empty/Empty'
import { IUserDetails } from '@/interfaces/User'

const UserDetails: React.FC<{ userId: string }> = ({ userId }) => {

    



    const [userDetails, setUserDetails] = useState<IUserDetails>()
    const [subscriptionDetails, setSubscriptionDetails] = useState<ISubscriptionDetails | null>(null)

    useEffect(() => {

        fetchUser(userId).then((res) => {
            setUserDetails(res.data)
        })
    }, [])

    return (
        <div className="container mx-auto my-5 p-5">
            <div className="md:flex no-wrap md:-mx-2 ">
                {/* Left Side */}
                <div className="w-full md:w-4/12 md:mx-2">
                    {/* Profile Card */}
                    <div className="bg-gray-700 p-3 border-t-4 border-green-400">

                        <h1 className="text-gray-100 font-bold text-xl leading-8 my-1">{userDetails?.first_name}</h1>
                        <h3 className="text-gray-100 font-lg text-semibold leading-6">Owner at Her Company Inc.</h3>
                        <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
                            <li className="flex items-center py-3">
                                <span>Status</span>
                                {
                                    userDetails?.is_deleted ? <span className="ml-auto"><span className="bg-red-500 py-1 px-2 rounded text-white text-sm">Deleted</span></span> : userDetails?.is_blocked ? <span className="ml-auto"><span className="bg-red-500 py-1 px-2 rounded text-white text-sm">Blocked</span></span> : userDetails?.is_verified ? <span className="ml-auto"><span className="bg-green-500 py-1 px-2 rounded text-white text-sm">Active</span></span> : <span className="ml-auto"><span className="bg-red-500 py-1 px-2 rounded text-white text-sm">Not verified</span></span>
                                }

                            </li>
                            <li className="flex items-center py-3">
                                <span>Member since</span>
                                <span className="ml-auto">{userDetails ? new Date(userDetails.created_at).toLocaleDateString() : ""}</span>
                            </li>
                        </ul>
                    </div>
                    {/* End of profile card */}
                    <div className="my-4" />
                    {/* Friends card */}

                    <SubscriptionDetails userId={userId} subscriptionDetails={subscriptionDetails} setSubscriptionDetails={setSubscriptionDetails} />
                    {/* End of friends card */}
                </div>
                {/* Right Side */}
                <div className="w-full md:w-9/12 mx-2 h-64">
                    {/* Profile tab */}
                    {/* About Section */}
                    <div className="bg-gray-700 p-3 shadow-sm rounded-sm">
                        <div className="flex items-center space-x-2 font-semibold text-gray-100 mt-4 leading-8">
                            <span clas="text-green-500">
                                <svg className="h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </span>
                            <span className="tracking-wide">About</span>
                        </div>
                        <div className="text-gray-100">
                            <div className="grid md:grid-cols-2 text-sm">
                                <div className="grid grid-cols-2">
                                    <div className="px-4 py-2 font-semibold">User id :</div>
                                    <div className="px-4 py-2">
                                        <a className="text-blue-300" href="mailto:jane@example.com">{userDetails?.user_id}</a>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2">
                                    <div className="px-4 py-2 font-semibold">First Name :</div>
                                    <div className="px-4 py-2">{userDetails?.first_name}</div>
                                </div>
                                <div className="grid grid-cols-2">
                                    <div className="px-4 py-2 font-semibold">Last Name :</div>
                                    <div className="px-4 py-2">{userDetails?.last_name} </div>
                                </div>
                                <div className="grid grid-cols-2">
                                    <div className="px-4 py-2 font-semibold">Contact No :</div>
                                    <div className="px-4 py-2">{userDetails?.phone_no} </div>
                                </div>
                                <div className="grid grid-cols-2">
                                    <div className="px-4 py-2 font-semibold">Email :</div>
                                    <div className="px-4 py-2">
                                        <a className="text-blue-300" href={`mailto:${userDetails?.email}`}>{userDetails?.email}</a>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2">
                                    <div className="px-4 py-2 font-semibold">Authentication id :</div>
                                    <div className="px-4 py-2">
                                        <a className="text-blue-300" href="mailto:jane@example.com">{userDetails?.authentication_id}</a>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2">
                                    <div className="px-4 py-2 font-semibold">Authentication Provider :</div>
                                    <div className="px-4 py-2">
                                        <a className="text-blue-300" href="mailto:jane@example.com">{userDetails?.authentication_provider}</a>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2">
                                    <div className="px-4 py-2 font-semibold">Stripe Customer id :</div>
                                    <div className="px-4 py-2">
                                        <a className="text-blue-300" href="mailto:jane@example.com">{userDetails?.stripe_customer_id}</a>
                                    </div>
                                </div>



                            </div>
                        </div>

                    </div>
                    {/* End of about section */}
                    <div className="my-4" />
                    {/* Experience and education */}
                    <div className="bg-gray-700 p-3 shadow-sm rounded-sm">
                        <p>Transactions</p>
                        {

                            subscriptionDetails?.transactions?.length?"":<Empty/>
                        }
                        {/* End of Experience and education grid */}
                    </div>
                </div></div></div>
    )
}

export default UserDetails