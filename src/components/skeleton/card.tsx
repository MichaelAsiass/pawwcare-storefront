import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function SkeletonCard() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <Skeleton className="h-4 w-3/4 mx-auto" />
        <Skeleton className="h-8 w-1/2 mx-auto mt-2" />
        <Skeleton className="h-4 w-2/3 mx-auto mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-10 w-full mt-4" />
      </CardContent>
    </Card>
  )
}