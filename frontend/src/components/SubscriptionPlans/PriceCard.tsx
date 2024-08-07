import Link from 'next/link';
import React from 'react'

interface IFeatures {
    branches: number;
    meetings: number;
    support: 'basic' | 'expert';
}

export interface IPlan {
    plan_id: string;
    stripe_plan_id: string;
    description: string;
    bill_cycle: 'month' | 'year';
    features: IFeatures;
    price: string;
    name: string;
    currency: 'usd';
    created_at: Date;
    active: boolean;
    is_deleted: boolean;

}

const PriceCard: React.FC<{ plan: IPlan }> = ({ plan }) => {
    return (
        <div className="relative p-8  border border-gray-200 rounded-2xl shadow-sm flex flex-col">
            <div className="flex-1">
                <h3 className="text-xl font-semibold ">{plan.name}</h3>
                {/* <p className="absolute top-0 py-1.5 px-4 bg-emerald-500 text-white rounded-full text-xs font-semibold uppercase tracking-wide  transform -translate-y-1/2">
                    Most popular</p> */}
                <p className="mt-4 flex items-baseline ">
                    <span className="text-5xl font-extrabold tracking-tight">{plan.price}$</span><span className="ml-1 text-xl font-semibold">/{plan.bill_cycle}</span>
                </p>

                <ul role="list" className="mt-6 space-y-6">
                    <li className="flex"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 w-6 h-6 text-emerald-500" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                    </svg><span className="ml-3 ">{plan.features.branches} Branches</span></li>
                    <li className="flex"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 w-6 h-6 text-emerald-500" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                    </svg><span className="ml-3 ">{plan.features.meetings} Members Meetings</span></li>
                    <li className="flex"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 w-6 h-6 text-emerald-500" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                    </svg><span className="ml-3 ">{plan.features.support} Support</span></li>
                    
                </ul>
            </div><Link className="bg-emerald-500 text-white  hover:bg-emerald-600  block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium mt-32" href={`/tenant-registration/${plan.stripe_plan_id}`}>Select</Link>
        </div>
    )
}

export default PriceCard