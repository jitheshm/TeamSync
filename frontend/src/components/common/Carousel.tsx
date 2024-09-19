import * as React from "react"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "../ui/card"

export function CarouselComponent({ projects }: { projects: any }) {
    return (
        <Carousel
            opts={{
                align: "start",
            }}
            className="w-full  "
        >
            <CarouselContent>
                {projects.map((data:any,index:any) => (
                    <CarouselItem key={index} className="w-fit md:basis-1/2 pl-0 md:pl-4 ">
                        <div className="p-1  m-auto">
                            <Card className="bg-transparent w-fit m-auto">
                                <CardContent className=" p-0">
                                    <div className='w-[200px] md:w-[250px] flex flex-col h-56 rounded-lg border border-primary'>
                                        <p className='text-center pt-10 font-bold'>
                                            {data.name}
                                        </p>
                                        <div className='flex justify-center items-center flex-1'>
                                            <div className={`rounded-full  w-32 h-32 ${data.stage === 'pending' ? 'bg-red-500' : data.stage === 'development' ? 'bg-yellow-600' : ' bg-green-600'} flex justify-center items-center drop-shadow-2xl`}>
                                                <span className="text-white">{data.stage}</span>
                                            </div>
                                        </div>
                                    </div >
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}
