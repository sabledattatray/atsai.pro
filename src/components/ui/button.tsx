import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap text-xs font-bold uppercase tracking-widest transition-all duration-300 active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-40 cursor-pointer select-none",
          {
            // Default: Indigo/Purple Gradient with drop glow
            "bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:brightness-110 border border-indigo-400/20": variant === "default",
            // Outline: Glassmorphic translucent border
            "border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white": variant === "outline",
            // Secondary: Slate glass button
            "bg-slate-800/80 text-white hover:bg-slate-700 border border-slate-700/50 shadow-sm": variant === "secondary",
            // Ghost: Completely clean hover action
            "text-slate-300 hover:bg-white/5 hover:text-white": variant === "ghost",
            
            // Sizes
            "h-11 px-6 rounded-xl": size === "default",
            "h-9 px-4 rounded-lg text-[10px]": size === "sm",
            "h-14 px-8 rounded-2xl text-sm": size === "lg",
            "h-11 w-11 rounded-xl": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
