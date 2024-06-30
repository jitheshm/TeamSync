import React from 'react'

function BranchForm() {
    return (

        <div className="bg-gray-800 border rounded-lg px-8 py-6 mx-auto my-8 max-w-2xl md:mt-60">
            <h2 className="text-2xl font-medium mb-4 text-gray-100 text-center">Create New Branch</h2>
            <form>
                <div className="mb-4">
                    <label htmlFor="location" className="block text-gray-100 font-medium mb-2">Location</label>
                    <input type="text" id="location" name="location" className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400 text-black" required />
                </div>

                <div className='text-center'>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 ">Submit</button>
                </div>

            </form >
        </div >

    )
}

export default BranchForm