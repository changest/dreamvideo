"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { startVideoGeneration, pollVideoGeneration } from "@/lib/video-service";
import { saveGenerationTask } from "@/lib/storage";
import { VideoGenerationTask, GenerationStep } from "@/types";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Download,
  Film,
  Loader2,
  Sparkles,
  Wand2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

const steps: { key: GenerationStep; label: string; icon: typeof Sparkles }[] = [
  { key: "analyzing", label: "分析文本", icon: Sparkles },
  { key: "generating", label: "生成视频", icon: Wand2 },
  { key: "processing", label: "处理中", icon: Loader2 },
  { key: "completed", label: "已完成", icon: Check },
];

export function ProgressContent() {
  const searchParams = useSearchParams();
  const [task, setTask] = useState<VideoGenerationTask | null>(null);
  const [error, setError] = useState<string>("");
  const pollingRef = useRef(false);

  // 从 URL 参数获取生成参数
  useEffect(() => {
    const prompt = searchParams.get("prompt");
    const aspectRatio = searchParams.get("aspectRatio") as "16:9" | "9:16" | "1:1";
    const duration = searchParams.get("duration");
    const resolution = searchParams.get("resolution") as "720p" | "1080p";
    const apiConfigId = searchParams.get("apiConfigId");

    if (!prompt || !apiConfigId) {
      setError("缺少必要的生成参数");
      return;
    }

    // 开始生成
    startGeneration({
      prompt,
      aspectRatio: aspectRatio || "16:9",
      duration: parseInt(duration || "5") as 5 | 10,
      resolution: resolution || "720p",
      apiConfigId,
    });
  }, [searchParams]);

  const startGeneration = async (params: {
    prompt: string;
    aspectRatio: "16:9" | "9:16" | "1:1";
    duration: 5 | 10;
    resolution: "720p" | "1080p";
    apiConfigId: string;
  }) => {
    const result = await startVideoGeneration(params);

    if (!result.success || !result.task) {
      setError(result.error || "生成失败");
      return;
    }

    setTask(result.task);

    // 开始轮询
    if (result.task.taskId) {
      pollingRef.current = true;
      pollStatus(result.task);
    }
  };

  const pollStatus = async (currentTask: VideoGenerationTask) => {
    if (!currentTask.taskId) return;

    const updatedTask = await pollVideoGeneration(
      currentTask.taskId,
      (progressTask) => {
        setTask({ ...progressTask });
      }
    );

    if (updatedTask) {
      setTask(updatedTask);
    }

    pollingRef.current = false;
  };

  const handleRetry = () => {
    if (!task) return;

    // 重置任务状态
    const resetTask: VideoGenerationTask = {
      ...task,
      status: "pending",
      currentStep: "analyzing",
      progress: 0,
      error: undefined,
      updatedAt: Date.now(),
    };

    saveGenerationTask(resetTask);
    setTask(resetTask);
    setError("");

    // 重新开始生成
    startGeneration(task.params);
  };

  const currentStepIndex = steps.findIndex((s) => s.key === task?.currentStep);

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F6F7]">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E6E7]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
            <Link href="/generate">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                返回
              </Button>
            </Link>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-12">
          <Card padding="lg" className="text-center">
            <div className="w-16 h-16 bg-[#FF4D4F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-[#FF4D4F]" />
            </div>
            <h2 className="text-xl font-semibold text-[#333333] mb-2">
              生成失败
            </h2>
            <p className="text-[#666666] mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <Link href="/generate">
                <Button variant="secondary">重新输入</Button>
              </Link>
              <Button onClick={handleRetry}>重试</Button>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F7]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E6E7]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link href="/generate">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              返回
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {task?.status === "completed" ? (
          // 完成状态
          <Card padding="lg" className="text-center">
            <div className="w-16 h-16 bg-[#52C41A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-[#52C41A]" />
            </div>
            <h2 className="text-xl font-semibold text-[#333333] mb-2">
              生成完成！
            </h2>
            <p className="text-[#666666] mb-6">
              你的视频已经生成完毕
            </p>

            {/* 视频预览 */}
            {task.videoUrl && (
              <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6">
                <video
                  src={task.videoUrl}
                  controls
                  className="w-full h-full"
                  poster={task.thumbnailUrl}
                />
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Link href="/history">
                <Button variant="secondary">查看历史</Button>
              </Link>
              {task.videoUrl && (
                <a href={task.videoUrl} download target="_blank" rel="noopener noreferrer">
                  <Button className="gap-2">
                    <Download className="w-4 h-4" />
                    下载视频
                  </Button>
                </a>
              )}
            </div>
          </Card>
        ) : (
          // 生成中状态
          <Card padding="lg">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#0085FA]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                {task?.status === "processing" ? (
                  <Loader2 className="w-8 h-8 text-[#0085FA] animate-spin" />
                ) : (
                  <Film className="w-8 h-8 text-[#0085FA]" />
                )}
              </div>
              <h2 className="text-xl font-semibold text-[#333333] mb-2">
                {task?.status === "processing"
                  ? "正在生成视频..."
                  : "准备生成..."}
              </h2>
              <p className="text-[#666666] text-sm">
                预计需要 1-5 分钟，请耐心等待
              </p>
            </div>

            {/* 进度条 */}
            <div className="mb-8">
              <div className="h-2 bg-[#E5E6E7] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0085FA] rounded-full transition-all duration-500"
                  style={{ width: `${task?.progress || 0}%` }}
                />
              </div>
              <p className="text-center text-sm text-[#666666] mt-2">
                {task?.progress?.toFixed(0) || 0}%
              </p>
            </div>

            {/* 步骤指示器 */}
            <div className="space-y-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div
                    key={step.key}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                      isCurrent
                        ? "bg-[#0085FA]/5 border border-[#0085FA]/20"
                        : isActive
                        ? "bg-[#F5F6F7]"
                        : "opacity-50"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isActive
                          ? "bg-[#0085FA] text-white"
                          : "bg-[#E5E6E7] text-[#999999]"
                      }`}
                    >
                      {isActive && index < currentStepIndex ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Icon className={`w-5 h-5 ${isCurrent ? "animate-pulse" : ""}`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          isActive ? "text-[#333333]" : "text-[#999999]"
                        }`}
                      >
                        {step.label}
                      </p>
                      {isCurrent && (
                        <p className="text-sm text-[#0085FA]">进行中...</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 取消按钮 */}
            <div className="mt-8 text-center">
              <Link href="/generate">
                <Button variant="ghost" size="sm" className="text-[#999999]">
                  取消生成
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
