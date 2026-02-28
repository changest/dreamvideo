"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getApiConfigs } from "@/lib/storage";
import { ApiConfig } from "@/types";
import {
  ArrowLeft,
  Clock,
  Play,
  Settings,
  Sparkles,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const aspectRatioOptions = [
  { value: "16:9", label: "16:9 横屏" },
  { value: "9:16", label: "9:16 竖屏" },
  { value: "1:1", label: "1:1 方形" },
];

const durationOptions = [
  { value: "5", label: "5 秒" },
  { value: "10", label: "10 秒" },
];

const resolutionOptions = [
  { value: "720p", label: "720p" },
  { value: "1080p", label: "1080p" },
];

export default function GeneratePage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [duration, setDuration] = useState("5");
  const [resolution, setResolution] = useState("720p");
  const [apiConfigs, setApiConfigs] = useState<ApiConfig[]>([]);
  const [selectedApiId, setSelectedApiId] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const configs = getApiConfigs();
    setApiConfigs(configs);
    if (configs.length > 0) {
      setSelectedApiId(configs[0].id);
    }
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim() || !selectedApiId) return;

    setIsGenerating(true);

    // 构建查询参数并跳转到进度页面
    const params = new URLSearchParams({
      prompt: prompt.trim(),
      aspectRatio,
      duration,
      resolution,
      apiConfigId: selectedApiId,
    });

    router.push(`/generate/progress?${params.toString()}`);
  };

  const hasNoApiConfig = apiConfigs.length === 0;

  // 防止服务端渲染不匹配
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F5F6F7]">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E6E7]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  返回
                </Button>
              </Link>
              <h1 className="text-lg font-semibold text-[#333333]">
                创作视频
              </h1>
            </div>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">加载中...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F7]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E6E7]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                返回
              </Button>
            </Link>
            <h1 className="text-lg font-semibold text-[#333333]">
              创作视频
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* API Config Warning */}
        {hasNoApiConfig && (
          <Card className="mb-6 bg-[#FFF7E6] border-[#FFD591]" padding="md">
            <div className="flex items-start gap-3">
              <Settings className="w-5 h-5 text-[#FAAD14] mt-0.5" />
              <div>
                <p className="text-[#333333] font-medium">
                  请先配置 API
                </p>
                <p className="text-sm text-[#666666] mt-1">
                  需要配置视频生成 API 才能开始创作
                </p>
                <Link href="/settings/api" className="inline-block mt-2">
                  <Button size="sm" variant="outline">
                    去配置
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Input Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card padding="lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#0085FA]/10 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#0085FA]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[#333333]">
                    描述你的创意
                  </h2>
                  <p className="text-sm text-[#666666]">
                    输入文字描述，AI 将为你生成视频
                  </p>
                </div>
              </div>

              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="例如：一只可爱的柴犬在樱花树下玩耍，阳光明媚，微风轻拂..."
                className="min-h-[180px] text-base"
              />

              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-[#999999]">
                  {prompt.length} 字
                </span>
                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || !selectedApiId || isGenerating}
                  isLoading={isGenerating}
                  className="gap-2"
                >
                  <Play className="w-4 h-4" />
                  开始生成
                </Button>
              </div>
            </Card>

            {/* Tips */}
            <Card padding="md" className="bg-[#F0F9FF] border-[#BAE7FF]">
              <h3 className="text-sm font-medium text-[#333333] mb-2 flex items-center gap-2">
                <Video className="w-4 h-4 text-[#0085FA]" />
                提示技巧
              </h3>
              <ul className="text-sm text-[#666666] space-y-1">
                <li>• 描述具体场景、主体和动作</li>
                <li>• 说明光照、氛围和风格</li>
                <li>• 越详细的描述，效果越好</li>
              </ul>
            </Card>
          </div>

          {/* Settings Panel */}
          <div className="space-y-6">
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-[#333333] mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                生成设置
              </h2>

              <div className="space-y-5">
                {/* API Selection */}
                <div>
                  <label className="block text-sm font-medium text-[#333333] mb-2">
                    选择 API
                  </label>
                  {apiConfigs.length > 0 ? (
                    <div className="space-y-2">
                      {apiConfigs.map((config) => (
                        <label
                          key={config.id}
                          className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${
                            selectedApiId === config.id
                              ? "border-[#0085FA] bg-[#0085FA]/5"
                              : "border-[#E5E6E7] hover:border-[#0085FA]/50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="api"
                            value={config.id}
                            checked={selectedApiId === config.id}
                            onChange={(e) => setSelectedApiId(e.target.value)}
                            className="sr-only"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-[#333333]">
                              {config.name}
                            </p>
                            <p className="text-xs text-[#999999] capitalize">
                              {config.provider}
                            </p>
                          </div>
                          {selectedApiId === config.id && (
                            <div className="w-5 h-5 bg-[#0085FA] rounded-full flex items-center justify-center">
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                          )}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <Link href="/settings/api">
                      <Button variant="outline" className="w-full">
                        <Settings className="w-4 h-4 mr-2" />
                        添加 API 配置
                      </Button>
                    </Link>
                  )}
                </div>

                {/* Aspect Ratio */}
                <Select
                  label="视频比例"
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  options={aspectRatioOptions}
                />

                {/* Duration */}
                <Select
                  label="视频时长"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  options={durationOptions}
                />

                {/* Resolution */}
                <Select
                  label="分辨率"
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  options={resolutionOptions}
                />
              </div>
            </Card>

            {/* Quick Info */}
            <Card padding="md" className="bg-[#F5F6F7]">
              <div className="flex items-center gap-2 text-sm text-[#666666]">
                <Clock className="w-4 h-4" />
                <span>预计生成时间 1-5 分钟</span>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
