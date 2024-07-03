import { ITenants } from '@/interfaces/subscription'
import React from 'react'

function CompanyDetails({ tenant }: { tenant: ITenants | null }) {
    return (
        <div className="bg-gray-700 p-3 shadow-sm rounded-sm mt-5 w-11/12 mx-auto">
            <div className="flex items-center space-x-2 font-semibold text-gray-100 mt-4 leading-8">
                <span className="text-green-500">
                    <svg className="h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </span>
                <span className="tracking-wide">Company Details</span>
            </div>
            <div className="text-gray-100">
                <div className="grid md:grid-cols-2 text-sm">
                    <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Tenant Id :</div>
                        <div className="px-4 py-2">{tenant?._id} </div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Company Name :</div>
                        <div className="px-4 py-2">{tenant?.company_name}</div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Company Type :</div>
                        <div className="px-4 py-2">{tenant?.company_type} </div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Phone No :</div>
                        <div className="px-4 py-2">{tenant?.phone_no} </div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Domain :</div>
                        <div className="px-4 py-2">{tenant?.domain} </div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Register Date :</div>
                        <div className="px-4 py-2">{tenant ? new Date(tenant.register_date).toLocaleDateString() : ""} </div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Building No :</div>
                        <div className="px-4 py-2">{tenant?.address.building_no} </div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">City :</div>
                        <div className="px-4 py-2">{tenant?.address.city} </div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Street :</div>
                        <div className="px-4 py-2">{tenant?.address.street} </div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">State :</div>
                        <div className="px-4 py-2">{tenant?.address.state} </div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Country :</div>
                        <div className="px-4 py-2">{tenant?.address.country} </div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Postal Code :</div>
                        <div className="px-4 py-2">{tenant?.address.postal_code} </div>
                    </div>



                </div>
            </div>

        </div>
    )
}

export default CompanyDetails