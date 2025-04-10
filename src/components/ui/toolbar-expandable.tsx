"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AnimatePresence, motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface ToolbarExpandableProps extends Omit<HTMLMotionProps<"div">, "animate"> {
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  defaultCollapsed?: boolean
  expandedContent?: React.ReactNode
  collapsedContent?: React.ReactNode
  height?: number
  collapsedHeight?: number
}

const useClickOutside = (
  ref: React.RefObject<HTMLDivElement | null>,
  handler: () => void
) => {
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref, handler])
}

export function ToolbarExpandable({
  collapsed: collapsedProp,
  onCollapsedChange,
  defaultCollapsed = true,
  expandedContent,
  collapsedContent,
  height = 200,
  collapsedHeight = 64,
  className,
  ...props
}: ToolbarExpandableProps) {
  const [collapsedState, setCollapsedState] = React.useState(defaultCollapsed)
  const isCollapsed = collapsedProp !== undefined ? collapsedProp : collapsedState
  const toolbarRef = React.useRef<HTMLDivElement>(null)

  const setIsCollapsed = React.useCallback(
    (value: boolean) => {
      setCollapsedState(value)
      onCollapsedChange?.(value)
    },
    [onCollapsedChange]
  )

  const toggle = () => {
    setIsCollapsed(!isCollapsed)
  }

  const collapseToolbar = React.useCallback(() => {
    setIsCollapsed(true)
  }, [setIsCollapsed])

  useClickOutside(toolbarRef, collapseToolbar)

  return (
    <motion.div
      ref={toolbarRef}
      className={cn(
        "relative overflow-hidden rounded-lg bg-card shadow-md",
        className
      )}
      initial={{ height: collapsedHeight }}
      animate={{ height: isCollapsed ? collapsedHeight : height }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      {...props}
    >
      <div 
        className="cursor-pointer p-4 flex items-center justify-between"
        onClick={toggle}
      >
        {collapsedContent}
        <div className="flex items-center space-x-2">
          <motion.div
            animate={{ rotate: isCollapsed ? 0 : 180 }}
            transition={{ duration: 0.3 }}
            className="text-muted-foreground"
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="p-4 pt-0"
          >
            {expandedContent}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
} 