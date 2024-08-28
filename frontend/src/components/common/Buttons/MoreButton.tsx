import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IoMdMore } from "react-icons/io";

function MoreButton({ children }: { children: any }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="focus-visible:ring-0 border-none">
                    <IoMdMore />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-background">
                <DropdownMenuGroup>
                    {children}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default MoreButton