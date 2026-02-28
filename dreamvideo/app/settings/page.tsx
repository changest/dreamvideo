"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getSettings, saveSettings, clearGenerationHistory } from "@/lib/storage";
import {
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  Database,
  Key,
  Monitor,
  Palette,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [theme, setTheme] = useState("system");

  useEffect(() => {
    const settings = getSettings();
    setTheme(settings.theme);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    saveSettings({ theme: newTheme as "light" | "dark" | "system" });
  };

  const handleClearHistory = () => {
    if (confirm("确定要清空所有历史记录吗？此操作不可恢复。")) {
      clearGenerationHistory();
      alert("历史记录已清空");
    }
  };

  const menuItems = [
    {
      icon: Key,
      title: "API 配置管理",
      description: "管理视频生成 API",
      href: "/settings/api",
    },
    {
      icon: Database,
      title: "清除缓存",
      description: "清除历史记录和数据",
      action: handleClearHistory,
      danger: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F6F7]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E6E7]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                返回
              </Button>
            </Link>
            <h1 className="text-lg font-semibold text-[#333333]">设置</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Appearance Section */}
        <section>
          <h2 className="text-sm font-medium text-[#999999] mb-3 px-1">
            外观
          </h2>
          <Card padding="md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0085FA]/10 rounded-xl flex items-center justify-center">
                  <Palette className="w-5 h-5 text-[#0085FA]" />
                </div>
                <div>
                  <h3 className="font-medium text-[#333333]">主题</h3>
                  <p className="text-sm text-[#999999]">选择应用主题</p>
                </div>
              </div>
              <div className="flex bg-[#F5F6F7] rounded-lg p-1">
                {["light", "dark", "system"].map((t) => (
                  <button
                    key={t}
                    onClick={() => handleThemeChange(t)}
                    className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                      theme === t
                        ? "bg-white text-[#0085FA] shadow-sm"
                        : "text-[#666666] hover:text-[#333333]"
                    }`}
                  >
                    {t === "light" && "浅色"}
                    {t === "dark" && "深色"}
                    {t === "system" && "跟随系统"}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </section>

        {/* General Section */}
        <section>
          <h2 className="text-sm font-medium text-[#999999] mb-3 px-1">
            通用
          </h2>
          <Card padding="none">
            <div className="divide-y divide-[#E5E6E7]">
              {menuItems.map((item, index) => (
                <div key={index}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="flex items-center justify-between p-4 hover:bg-[#F5F6F7] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            item.danger
                              ? "bg-[#FF4D4F]/10"
                              : "bg-[#0085FA]/10"
                          }`}
                        >
                          <item.icon
                            className={`w-5 h-5 ${
                              item.danger ? "text-[#FF4D4F]" : "text-[#0085FA]"
                            }`}
                          />
                        </div>
                        <div>
                          <h3
                            className={`font-medium ${
                              item.danger ? "text-[#FF4D4F]" : "text-[#333333]"
                            }`}
                          >
                            {item.title}
                          </h3>
                          <p className="text-sm text-[#999999]">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#999999]" />
                    </Link>
                  ) : (
                    <button
                      onClick={item.action}
                      className="w-full flex items-center justify-between p-4 hover:bg-[#F5F6F7] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            item.danger
                              ? "bg-[#FF4D4F]/10"
                              : "bg-[#0085FA]/10"
                          }`}
                        >
                          <item.icon
                            className={`w-5 h-5 ${
                              item.danger ? "text-[#FF4D4F]" : "text-[#0085FA]"
                            }`}
                          />
                        </div>
                        <div>
                          <h3
                            className={`font-medium ${
                              item.danger ? "text-[#FF4D4F]" : "text-[#333333]"
                            }`}
                          >
                            {item.title}
                          </h3>
                          <p className="text-sm text-[#999999]">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* About Section */}
        <section>
          <h2 className="text-sm font-medium text-[#999999] mb-3 px-1">
            关于
          </h2>
          <Card padding="lg" className="text-center">
            <div className="w-16 h-16 bg-[#0085FA] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Monitor className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-[#333333] mb-1">
              DreamVideo
            </h2>
            <p className="text-sm text-[#666666] mb-4">
              支持自定义 API 的文生视频工具
            </p>
            <p className="text-xs text-[#999999]">版本 1.0.0</p>
          </Card>
        </section>
      </main>
    </div>
  );
}
