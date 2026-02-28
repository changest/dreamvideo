"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getGenerationHistory } from "@/lib/storage";
import { VideoGenerationTask } from "@/types";
import {
  Film,
  History,
  Play,
  Plus,
  Settings,
  Sparkles,
  Wand2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [recentTasks, setRecentTasks] = useState<VideoGenerationTask[]>([]);

  useEffect(() => {
    const tasks = getGenerationHistory().slice(0, 3);
    setRecentTasks(tasks);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F6F7]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E6E7]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0085FA] rounded-lg flex items-center justify-center">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-[#333333]">
              DreamVideo
            </span>
          </div>
          <Link href="/settings">
            <Button variant="ghost" size="sm" className="gap-2">
              <Settings className="w-4 h-4" />
              设置
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#333333] mb-6 tracking-tight">
            文字变视频
            <span className="text-[#0085FA]"> 创意无限</span>
          </h1>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto mb-8 leading-relaxed">
            输入文字描述，AI 将为你生成精美视频。
            <br />
            支持多种视频生成 API，让创作更简单。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/generate">
              <Button size="lg" className="gap-2 px-8">
                <Sparkles className="w-5 h-5" />
                开始创作
              </Button>
            </Link>
            <Link href="/history">
              <Button variant="secondary" size="lg" className="gap-2 px-8">
                <History className="w-5 h-5" />
                历史记录
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-[#333333] text-center mb-10">
            功能特色
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card padding="lg" hover className="text-center">
              <div className="w-14 h-14 bg-[#0085FA]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Wand2 className="w-7 h-7 text-[#0085FA]" />
              </div>
              <h3 className="text-lg font-semibold text-[#333333] mb-2">
                文生视频
              </h3>
              <p className="text-[#666666] text-sm leading-relaxed">
                输入文字描述，AI 自动生成高质量视频内容，支持多种风格和比例
              </p>
            </Card>

            <Card padding="lg" hover className="text-center">
              <div className="w-14 h-14 bg-[#0085FA]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Settings className="w-7 h-7 text-[#0085FA]" />
              </div>
              <h3 className="text-lg font-semibold text-[#333333] mb-2">
                自定义 API
              </h3>
              <p className="text-[#666666] text-sm leading-relaxed">
                支持接入可灵、Runway、Pika 等多种视频生成 API，灵活选择
              </p>
            </Card>

            <Card padding="lg" hover className="text-center">
              <div className="w-14 h-14 bg-[#0085FA]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Play className="w-7 h-7 text-[#0085FA]" />
              </div>
              <h3 className="text-lg font-semibold text-[#333333] mb-2">
                实时预览
              </h3>
              <p className="text-[#666666] text-sm leading-relaxed">
                生成过程实时展示，完成后可立即预览和下载视频
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent History Section */}
      {recentTasks.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#333333]">最近创作</h2>
              <Link href="/history">
                <Button variant="ghost" size="sm">
                  查看全部
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentTasks.map((task) => (
                <Link key={task.id} href={`/history`}>
                  <Card padding="md" hover className="cursor-pointer">
                    <div className="aspect-video bg-gradient-to-br from-[#0085FA]/10 to-[#0085FA]/5 rounded-lg mb-3 flex items-center justify-center">
                      {task.thumbnailUrl ? (
                        <img
                          src={task.thumbnailUrl}
                          alt={task.prompt}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Film className="w-10 h-10 text-[#0085FA]/30" />
                      )}
                    </div>
                    <p className="text-sm text-[#333333] line-clamp-2">
                      {task.prompt}
                    </p>
                    <p className="text-xs text-[#999999] mt-1">
                      {new Date(task.createdAt).toLocaleDateString("zh-CN")}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Floating Action Button */}
      <Link href="/generate">
        <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#0085FA] hover:bg-[#0070D9] text-white rounded-full shadow-[0_4px_20px_rgba(0,133,250,0.4)] flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95">
          <Plus className="w-6 h-6" />
        </button>
      </Link>
    </div>
  );
}
