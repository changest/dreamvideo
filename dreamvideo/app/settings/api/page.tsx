"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  deleteApiConfig,
  getApiConfigs,
  saveApiConfig,
} from "@/lib/storage";
import { ApiConfig, ApiProvider } from "@/types";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  ChevronRight,
  Key,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const providerOptions = [
  { value: "kling", label: "可灵 (Kling)" },
  { value: "runway", label: "Runway" },
  { value: "pika", label: "Pika" },
  { value: "luma", label: "Luma" },
  { value: "haiper", label: "Haiper" },
  { value: "stable-video", label: "Stable Video" },
];

const providerInfo: Record<ApiProvider, { description: string; website: string }> = {
  kling: {
    description: "快手推出的 AI 视频生成工具，效果出色",
    website: "https://klingai.com",
  },
  runway: {
    description: "专业的 AI 视频编辑和生成平台",
    website: "https://runwayml.com",
  },
  pika: {
    description: "简单易用的 AI 视频生成工具",
    website: "https://pika.art",
  },
  luma: {
    description: "高质量的 AI 视频生成服务",
    website: "https://lumalabs.ai",
  },
  haiper: {
    description: "新兴的 AI 视频生成平台",
    website: "https://haiper.ai",
  },
  "stable-video": {
    description: "Stability AI 的视频生成模型",
    website: "https://stability.ai",
  },
};

export default function ApiSettingsPage() {
  const [configs, setConfigs] = useState<ApiConfig[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    provider: "kling" as ApiProvider,
    apiKey: "",
    baseUrl: "",
  });
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    setConfigs(getApiConfigs());
  }, []);

  const handleSave = () => {
    if (!formData.name.trim() || !formData.apiKey.trim()) return;

    const config: ApiConfig = {
      id: editingId || Date.now().toString(),
      name: formData.name.trim(),
      provider: formData.provider,
      apiKey: formData.apiKey.trim(),
      baseUrl: formData.baseUrl.trim() || undefined,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    saveApiConfig(config);
    setConfigs(getApiConfigs());
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm("确定要删除这个 API 配置吗？")) {
      deleteApiConfig(id);
      setConfigs(getApiConfigs());
    }
  };

  const handleEdit = (config: ApiConfig) => {
    setEditingId(config.id);
    setFormData({
      name: config.name,
      provider: config.provider,
      apiKey: config.apiKey,
      baseUrl: config.baseUrl || "",
    });
    setShowForm(true);
    setShowKey(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: "", provider: "kling", apiKey: "", baseUrl: "" });
    setShowKey(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F6F7]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E6E7]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/settings">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                返回
              </Button>
            </Link>
            <h1 className="text-lg font-semibold text-[#333333]">
              API 配置
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {!showForm ? (
          <div className="space-y-6">
            {/* Add Button */}
            <Button
              onClick={() => setShowForm(true)}
              className="w-full h-16 border-2 border-dashed border-[#E5E6E7] bg-transparent hover:bg-[#F5F6F7] text-[#666666] gap-2"
            >
              <Plus className="w-5 h-5" />
              添加 API 配置
            </Button>

            {/* Config List */}
            {configs.length === 0 ? (
              <Card className="text-center py-12" padding="lg">
                <div className="w-16 h-16 bg-[#F5F6F7] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Key className="w-8 h-8 text-[#999999]" />
                </div>
                <h2 className="text-lg font-medium text-[#333333] mb-2">
                  暂无 API 配置
                </h2>
                <p className="text-sm text-[#666666]">
                  添加 API 配置后即可开始创作视频
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {configs.map((config) => (
                  <Card
                    key={config.id}
                    padding="md"
                    className="flex items-center justify-between cursor-pointer hover:border-[#0085FA]/50"
                    onClick={() => handleEdit(config)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#0085FA]/10 rounded-xl flex items-center justify-center">
                        <Key className="w-5 h-5 text-[#0085FA]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-[#333333]">
                          {config.name}
                        </h3>
                        <p className="text-sm text-[#999999] capitalize">
                          {providerInfo[config.provider]?.description ||
                            config.provider}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(config.id);
                        }}
                        className="p-2 text-[#999999] hover:text-[#FF4D4F] hover:bg-[#FF4D4F]/5 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ChevronRight className="w-5 h-5 text-[#999999]" />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          <Card padding="lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#333333]">
                {editingId ? "编辑 API 配置" : "添加 API 配置"}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 text-[#999999] hover:text-[#333333] hover:bg-[#F5F6F7] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              <Input
                label="配置名称"
                placeholder="例如：我的可灵 API"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <Select
                label="API 提供商"
                value={formData.provider}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    provider: e.target.value as ApiProvider,
                  })
                }
                options={providerOptions}
              />

              <div className="bg-[#F0F9FF] border border-[#BAE7FF] rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#0085FA] mt-0.5" />
                  <div>
                    <p className="text-sm text-[#333333] font-medium">
                      {providerInfo[formData.provider].description}
                    </p>
                    <a
                      href={providerInfo[formData.provider].website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#0085FA] hover:underline mt-1 inline-block"
                    >
                      访问官网 →
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#333333] mb-2">
                  API Key
                </label>
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={formData.apiKey}
                    onChange={(e) =>
                      setFormData({ ...formData, apiKey: e.target.value })
                    }
                    placeholder="输入你的 API Key"
                    className="w-full px-4 py-3 pr-20 rounded-xl bg-white border border-[#E5E6E7] text-[#333333] placeholder:text-[#999999] focus:outline-none focus:border-[#0085FA] focus:ring-2 focus:ring-[#0085FA]/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#0085FA] hover:text-[#0070D9]"
                  >
                    {showKey ? "隐藏" : "显示"}
                  </button>
                </div>
              </div>

              <Input
                label="Base URL（可选）"
                placeholder="https://api.example.com/v1"
                value={formData.baseUrl}
                onChange={(e) =>
                  setFormData({ ...formData, baseUrl: e.target.value })
                }
                helperText="留空将使用默认地址"
              />

              <div className="flex gap-3 pt-4">
                <Button variant="secondary" className="flex-1" onClick={resetForm}>
                  取消
                </Button>
                <Button
                  className="flex-1 gap-2"
                  onClick={handleSave}
                  disabled={!formData.name.trim() || !formData.apiKey.trim()}
                >
                  <Save className="w-4 h-4" />
                  保存
                </Button>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
