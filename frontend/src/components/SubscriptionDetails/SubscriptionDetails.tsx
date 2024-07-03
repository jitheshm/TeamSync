import React from 'react'
import {ISubscriptionDetails} from '@/interfaces/subscription'

function SubscriptionDetails({subscription}:{subscription:ISubscriptionDetails | null}) {
  return (
    <div className="bg-gray-700 p-3 shadow-sm rounded-sm mt-5 w-11/12 mx-auto">
            <div className="flex items-center space-x-2 font-semibold text-gray-100 mt-4 leading-8">
                <span className="text-green-500">
                    <svg className="h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </span>
                <span className="tracking-wide">Subscription Details</span>
            </div>
            <div className="text-gray-100">
                <div className="grid md:grid-cols-2 text-sm">
                    <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Subscription Id :</div>
                        <div className="px-4 py-2">{subscription?.subscription_id} </div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Plan Name :</div>
                        <div className="px-4 py-2">{subscription?.plan.name}</div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Latest Invoice id :</div>
                        <div className="px-4 py-2">{subscription?.stripe_latest_invoice} </div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Renewal Date  :</div>
                        <div className="px-4 py-2">{subscription?new Date(subscription?.renewal_date).toLocaleDateString():""} </div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Status :</div>
                        <div className="px-4 py-2">{subscription?.status} </div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Payment Method :</div>
                        <div className="px-4 py-2">{subscription?.payment_method} </div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Bill Cycle :</div>
                        <div className="px-4 py-2">{subscription?.plan.bill_cycle} </div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Price :</div>
                        <div className="px-4 py-2">{subscription?.plan.price} </div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Currency :</div>
                        <div className="px-4 py-2">{subscription?.plan.currency} </div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Start Date :</div>
                        <div className="px-4 py-2">{subscription?new Date(subscription?.start_date).toLocaleDateString():""} </div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Max Branches :</div>
                        <div className="px-4 py-2">{subscription?.plan.features.branches} </div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Meeting Limit :</div>
                        <div className="px-4 py-2">{subscription?.plan.features.meetings} </div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Support :</div>
                        <div className="px-4 py-2">{subscription?.plan.features.support} </div>
                    </div>



                </div>
            </div>

        </div>
  )
}

export default SubscriptionDetails