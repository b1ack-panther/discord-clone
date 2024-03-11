"use client"

import { TooltipArrow } from "@radix-ui/react-tooltip";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { cn } from "@/lib/utils";

interface ActionTooltipProps {
  label: string, 
  children: React.ReactNode,
  side?: "top" | "right" | "bottom" | "left",
  align?: "start" | "center" | "end"
  className?: string,
}

const ActionTooltip: React.FC<ActionTooltipProps> = ({ label, children, side, align, className } : ActionTooltipProps) => {
  return ( 
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side={side} align={align}>
          <p className={cn("font-semibold text-sm capitalize", className)}>{label.toLowerCase()}</p>
          <TooltipArrow   />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
   );
}
 
export default ActionTooltip;