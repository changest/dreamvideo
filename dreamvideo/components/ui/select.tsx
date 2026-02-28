"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#333333] mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              // 基础样式
              "w-full px-4 py-3 rounded-xl bg-white appearance-none",
              "border border-[#E5E6E7]",
              "text-[#333333]",
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
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666] pointer-events-none" />
        </div>
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

Select.displayName = "Select";

export { Select };
