import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function SelectComponent({ placeholder, options, active, handleValueChange }: { placeholder: string, options: { value: string, name: string }[], active: string, handleValueChange: (value: string) => void }) {
    return (
        <Select value={active} onValueChange={handleValueChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-background">
                <SelectGroup>

                    {
                        options.map((option) => {
                            return (
                                <SelectItem key={option.value} value={option.value}>{option.name}</SelectItem>
                            )
                        })
                    }

                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
