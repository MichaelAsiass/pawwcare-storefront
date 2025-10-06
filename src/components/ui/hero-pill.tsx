'use client'


import { cn } from "@/lib/utils"

interface HeroPillProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  text: string
  className?: string
  /**
   * @default true
   */
  animate?: boolean
}

export function HeroPill({ 
  icon, 
  text, 
  className,
  ...props 
}: HeroPillProps) {
  return (
    <div 
      className={cn(
        "mb-4",
        className
      )} 
      {...props}
    >
      <p className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-background px-3 py-1 text-sm font-medium text-foreground dark:bg-accent transition-colors border border-foreground/10">
        {icon && (
          <span className="mr-2 flex shrink-0 border-r border-foreground/10 pr-2">
            {icon}
          </span>
        )}
        {text}
      </p>
    </div>
  )
}