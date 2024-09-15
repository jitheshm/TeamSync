import React from 'react'
import { Button } from "@/components/ui/button"

interface MainButtonProps {
  name: string;
  onClick?: () => void;
  className?: string
}

function MainButton({ name, onClick, className }: MainButtonProps) {
  return (
    <Button
      className={`bg-primary text-white ${className}`}
      onClick={onClick ? onClick : undefined}
    >
      {name}
    </Button>
  )
}

export default MainButton
