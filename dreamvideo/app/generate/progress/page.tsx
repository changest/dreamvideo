"use client";

import { Suspense } from "react";
import { ProgressContent } from "./progress-content";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function GenerateProgressPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProgressContent />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#F5F6F7] flex items-center justify-center">
      <Card padding="lg" className="text-center">
        <Loader2 className="w-8 h-8 text-[#0085FA] animate-spin mx-auto mb-4" />
        <p className="text-[#666666]">加载中...</p>
      </Card>
    </div>
  );
}
