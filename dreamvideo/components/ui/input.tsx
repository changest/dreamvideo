"use client";

import { cn } from "@/lib/utils";
import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#333333] mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            // 基础样式
            "w-full px-4 py-3 rounded-xl bg-white",
            "border border-[#E5E6E7]",
            "text-[#333333] placeholder:text-[#999999]",
            "transition-all duration-200",

            // 聚焦样式
            "focus:outline-none focus:border-[#0085FA] focus:ring-2 focus:ring-[#0085FA]/10",

            // 错误样式
            error && "border-[#FF4D4F] focus:border-[#FF4D4F] focus:ring-[#FF4D4F]/10",

            // 禁用样式
            "disabled:bg-[#F5F6F7] disabled:text-[#999999] disabled:cursor-not-allowed",

            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-[#FF4D4F]">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-[#666666]">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
