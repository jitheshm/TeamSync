import React from 'react'
import { Button } from "@/components/ui/button"

function MainButton({name}:{name:string}) {
  return (
    <Button className='bg-primary text-white'>{name}</Button>
  )
}

export default MainButton