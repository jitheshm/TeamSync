import React from 'react';

type FlatObject = { [key: string]: any };

function flattenObject(obj: Record<string, any>, parentKey: string = '', result: FlatObject = {}): FlatObject {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            const newKey = parentKey ? `${parentKey}_${key}` : key;

            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                flattenObject(value, newKey, result);
            } else {
                result[newKey] = value;
            }
        }
    }
    return result;
}

function Details({ data }: { data: Record<string, any> }) {
    data = flattenObject(data);
    console.log(data);

    const dataEntries = Object.entries(data);
    const third = Math.ceil(dataEntries.length / 3);
    const firstThird = dataEntries.slice(0, third);
    const secondThird = dataEntries.slice(third, 2 * third);
    const thirdThird = dataEntries.slice(2 * third);

    return (

        <div className="mt-3 mb-8 border border-border p-5 rounded-lg w-full">
            <div className=" flex flex-wrap justify-between md:gap-0 ">
                <div className="w-full md:w-4/12 flex flex-col gap-5">
                    {firstThird.map(([key, value]) => {
                        if (key === 'is_deleted'||key==='__v') {
                            return null
                        }

                        return (<div key={key}>
                            <p className="dark:text-gray-400 text-gray-500">{key}</p>
                            <p>{value}</p>
                        </div>)
                    })}
                </div>

                <div className="w-full md:w-4/12 flex flex-col gap-5">
                    {secondThird.map(([key, value]) => {
                        if (key === 'is_deleted'||key==='__v') {
                            return null
                        }

                        return (<div key={key}>
                            <p className="dark:text-gray-400 text-gray-500">{key}</p>
                            <p>{value}</p>
                        </div>)
                    })}
                </div>

                <div className="w-full md:w-4/12 flex flex-col gap-5">
                    {thirdThird.map(([key, value]) => {
                        if (key === 'is_deleted'||key==='__v') {
                            return null
                        }

                        return (<div key={key}>
                            <p className="dark:text-gray-400 text-gray-500">{key}</p>
                            <p>{value}</p>
                        </div>)
                    })}
                </div>
            </div>
        </div>

    );
}

export default Details;
