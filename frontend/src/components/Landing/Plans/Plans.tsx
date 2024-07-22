import { fetchPlans } from '@/api/subscriptionService/subscription'
import PriceCard from '@/components/SubscriptionPlans/PriceCard'
import { IPlan } from '@/interfaces/subscription'

async function Plans() {

    const response = await fetchPlans()
    const plans: IPlan[] = response.data
    return (
        <div className='w-screen h-screen bg-white text-black'>

            <div className=' w-11/12 md:w-7/12 lg:w-7/12 xl:w-4/12 mx-auto pt-20 '>
                <h1 className="text-3xl lg:text-5xl  font-bold tracking-tight  text-center ">Choose Your Plan</h1>
            </div>
            <div className='grid grid-cols-12 md:w-11/12 xl:w-9/12 mx-auto mt-20 '  >

                {
                    plans.map((ele, index) => {
                        return (

                            <div className='col-span-4' key={index}>
                                <PriceCard plan={ele} />
                            </div>

                        )
                    })
                }
            </div>

        </div>
    )
}

export default Plans