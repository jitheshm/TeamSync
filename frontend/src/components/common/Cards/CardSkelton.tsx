import { Skeleton } from "@/components/ui/skeleton"

export function CardSkelton() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="  border border-border rounded-2xl  h-32 p-3  shadow-sm m-4 bg-gray-400/10  dark:bg-gray-600/10" />
    </div>
  )
}