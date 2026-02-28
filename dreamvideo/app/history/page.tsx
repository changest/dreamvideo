"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getGenerationHistory, deleteGenerationTask } from "@/lib/storage";
import { VideoGenerationTask } from "@/types";
import {
  ArrowLeft,
  Clock,
  Film,
  MoreVertical,
  Play,
  RotateCcw,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const statusConfig = {
  pending: { label: "等待中", color: "text-[#999999]", bg: "bg-[#F5F6F7]" },
  processing: {
    label: "生成中",
    color: "text-[#0085FA]",
    bg: "bg-[#0085FA]/10",
  },
  completed: {
    label: "已完成",
    color: "text-[#52C41A]",
    bg: "bg-[#52C41A]/10",
  },
  failed: { label: "失败", color: "text-[#FF4D4F]", bg: "bg-[#FF4D4F]/10" },
};

export default function HistoryPage() {
  const [tasks, setTasks] = useState<VideoGenerationTask[]>([]);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  useEffect(() => {
    setTasks(getGenerationHistory());
  }, []);

  const handleDelete = (id: string) => {
    deleteGenerationTask(id);
    setTasks(getGenerationHistory());
    setMenuOpen(null);
  };

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
            <h1 className="text-lg font-semibold text-[#333333]">历史记录</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {tasks.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-[#F5F6F7] rounded-full flex items-center justify-center mx-auto mb-6">
              <Film className="w-10 h-10 text-[#999999]" />
            </div>
            <h2 className="text-xl font-semibold text-[#333333] mb-2">
              暂无记录
            </h2>
            <p className="text-[#666666] mb-6">还没有生成过视频，开始创作吧</p>
            <Link href="/generate">
              <Button>开始创作</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => {
              const status = statusConfig[task.status];
              return (
                <Card key={task.id} padding="none" className="overflow-hidden">
                  {/* Thumbnail */}
                  <div className="aspect-video bg-gradient-to-br from-[#0085FA]/10 to-[#0085FA]/5 relative group">
                    {task.thumbnailUrl ? (
                      <img
                        src={task.thumbnailUrl}
                        alt={task.prompt}
                        className="w-full h-full object-cover"
                      />
                    ) : task.videoUrl ? (
                      <video
                        src={task.videoUrl}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Film className="w-12 h-12 text-[#0085FA]/30" />
                      </div>
                    )}

                    {/* Play Button */}
                    {task.videoUrl && (
                      <button className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                          <Play className="w-6 h-6 text-[#333333] ml-1" />
                        </div>
                      </button>
                    )}

                    {/* Status Badge */}
                    <div
                      className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}
                    >
                      {status.label}
                    </div>

                    {/* Menu */}
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() =>
                          setMenuOpen(menuOpen === task.id ? null : task.id)
                        }
                        className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-[#333333]" />
                      </button>

                      {menuOpen === task.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setMenuOpen(null)}
                          />
                          <div className="absolute right-0 top-10 w-40 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] py-1 z-20">
                            <button
                              onClick={() => handleDelete(task.id)}
                              className="w-full px-4 py-2.5 text-left text-sm text-[#FF4D4F] hover:bg-[#F5F6F7] flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              删除
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <p className="text-[#333333] text-sm line-clamp-2 mb-3">
                      {task.prompt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-[#999999]">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(task.createdAt).toLocaleDateString("zh-CN")}
                      </div>
                      {task.status === "completed" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 gap-1 text-xs"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          重新生成
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
