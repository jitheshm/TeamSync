import React from 'react'

function PriceCard() {
    return (
        <div className="relative p-8  border border-gray-200 rounded-2xl shadow-sm flex flex-col">
            <div className="flex-1">
                <h3 className="text-xl font-semibold ">Pro</h3>
                {/* <p className="absolute top-0 py-1.5 px-4 bg-emerald-500 text-white rounded-full text-xs font-semibold uppercase tracking-wide  transform -translate-y-1/2">
                    Most popular</p> */}
                <p className="mt-4 flex items-baseline ">
                    <span className="text-5xl font-extrabold tracking-tight">$12</span><span className="ml-1 text-xl font-semibold">/month</span>
                </p>
                <p className="mt-6 ">You want to learn and have a personal assistant</p>
                <ul role="list" className="mt-6 space-y-6">
                    <li className="flex"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 w-6 h-6 text-emerald-500" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                    </svg><span className="ml-3 ">30 credits</span></li>
                    <li className="flex"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 w-6 h-6 text-emerald-500" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                    </svg><span className="ml-3 ">Powered by GPT-4 (more accurate)</span></li>
                    <li className="flex"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 w-6 h-6 text-emerald-500" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                    </svg><span className="ml-3 ">Generate video (2 credits)</span></li>
                    <li className="flex"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 w-6 h-6 text-emerald-500" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                    </svg><span className="ml-3 ">Quizz (1 credits) </span></li>
                    <li className="flex"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 w-6 h-6 text-emerald-500" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                    </svg><span className="ml-3 ">Analytics on the quizz</span></li>
                </ul>
            </div><a className="bg-emerald-500 text-white  hover:bg-emerald-600 mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium" href="/auth/login">Select</a>
        </div>
    )
}

export default PriceCard