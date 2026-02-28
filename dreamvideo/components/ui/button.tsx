"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          // 基础样式
          "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0085FA] focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "active:scale-[0.98]",

          // 变体样式
          variant === "primary" && [
            "bg-[#0085FA] text-white",
            "hover:bg-[#0070D9]",
            "shadow-[0_2px_12px_rgba(0,133,250,0.3)]",
          ],

          variant === "secondary" && [
            "bg-white text-[#333333]",
            "border border-[#E5E6E7]",
            "hover:bg-[#F5F6F7]",
            "shadow-[0_2px_8px_rgba(0,0,0,0.04)]",
          ],

          variant === "outline" && [
            "bg-transparent text-[#0085FA]",
            "border border-[#0085FA]",
            "hover:bg-[#0085FA]/5",
          ],

          variant === "ghost" && [
            "bg-transparent text-[#666666]",
            "hover:bg-[#F5F6F7] hover:text-[#333333]",
          ],

          // 尺寸样式
          size === "sm" && "px-4 py-2 text-sm",
          size === "md" && "px-6 py-2.5 text-sm",
          size === "lg" && "px-8 py-3 text-base",

          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            加载中...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
