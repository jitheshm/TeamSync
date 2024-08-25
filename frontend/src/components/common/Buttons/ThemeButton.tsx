"use client"
import React from 'react'
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from 'next-themes'

function ThemeButton() {
    const { setTheme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="default" className='focus-visible:ring-0 px-0'>
                    <SunIcon className="h-[1.2rem] w-[1.2rem] mx-2 rotate-0 scale-100 transition-all dark:hidden" />
                    <MoonIcon className=" h-[1.2rem] w-[1.2rem] mx-2 rotate-90 scale-0 transition-all hidden dark:block dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                    <span className='md:hidden'>Dark/light</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className='bg-none'>
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ThemeButton