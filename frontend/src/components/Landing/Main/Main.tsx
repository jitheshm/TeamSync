
function Main() {
    return (
        <div>
            <div className='min-h-screen bg-gradient-to-b from-[#ffffff] from-60%  to-[#e9d2ff] text-gray-900 pb-16'>
                <div className=' w-11/12 md:w-7/12 lg:w-7/12 xl:w-5/12 mx-auto pt-36'>
                    <h1 className="text-3xl lg:text-5xl  font-bold tracking-tight  text-center ">A more effective way to track progress</h1>
                </div>
                <div className='w-11/12 lg:w-6/12 mx-auto mt-10' >
                    <img src="/demo.png" alt="" />
                </div>
                <div className='lg:w-11/12 xl:w-8/12 mx-auto'>
                    <div className='grid grid-cols-12 '>
                        <div className='col-span-12 md:col-span-4 h-fit'>
                            <div className='pt-14 md:pt-36'>
                                <p className='font-semibold text-center'>Integration ecosystem</p>
                                <p className='w-7/12 md:w-8/12 mx-auto text-center'>Track team progress and motivate them everyday.</p>
                            </div>
                        </div>
                        <div className='col-span-12 md:col-span-4'>
                            <div className='pt-14 md:pt-36'>
                                <p className='font-semibold text-center'>Secure data encryption</p>
                                <p className='w-7/12 md:w-8/12 mx-auto text-center'>Ensure your data&apos;s safety with top-tier encryption.</p>
                            </div>
                        </div>
                        <div className='col-span-12 md:col-span-4'>
                            <div className='pt-14 md:pt-36'>
                                <p className='font-semibold text-center'>Customizable notifications</p>
                                <p className='w-7/12 md:w-8/12 mx-auto text-center'>Get alerts on tasks and deadlines that matter most.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main