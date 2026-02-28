"use client";

import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding = "md", hover = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // 基础样式
          "bg-white rounded-xl",
          "shadow-[0_2px_12px_rgba(0,0,0,0.08)]",
          "transition-all duration-200",

          // 悬停效果
          hover && "hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)] hover:-translate-y-0.5",

          // 内边距
          padding === "none" && "",
          padding === "sm" && "p-4",
          padding === "md" && "p-6",
          padding === "lg" && "p-8",

          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export { Card };
