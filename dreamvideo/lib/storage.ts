import { ApiConfig, VideoGenerationTask } from "@/types";

const STORAGE_KEYS = {
  API_CONFIGS: "dreamvideo_api_configs",
  GENERATION_HISTORY: "dreamvideo_generation_history",
  SETTINGS: "dreamvideo_settings",
} as const;

/**
 * 获取所有 API 配置
 */
export function getApiConfigs(): ApiConfig[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEYS.API_CONFIGS);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * 获取单个 API 配置
 */
export function getApiConfigById(id: string): ApiConfig | null {
  const configs = getApiConfigs();
  return configs.find((c) => c.id === id) || null;
}

/**
 * 保存 API 配置
 */
export function saveApiConfig(config: ApiConfig): void {
  if (typeof window === "undefined") return;
  const configs = getApiConfigs();
  const existingIndex = configs.findIndex((c) => c.id === config.id);
  if (existingIndex >= 0) {
    configs[existingIndex] = { ...config, updatedAt: Date.now() };
  } else {
    configs.push({ ...config, createdAt: Date.now(), updatedAt: Date.now() });
  }
  localStorage.setItem(STORAGE_KEYS.API_CONFIGS, JSON.stringify(configs));
}

/**
 * 删除 API 配置
 */
export function deleteApiConfig(id: string): void {
  if (typeof window === "undefined") return;
  const configs = getApiConfigs().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.API_CONFIGS, JSON.stringify(configs));
}

/**
 * 获取生成历史
 */
export function getGenerationHistory(): VideoGenerationTask[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEYS.GENERATION_HISTORY);
  if (!stored) return [];
  try {
    const tasks: VideoGenerationTask[] = JSON.parse(stored);
    // 按时间倒序排列
    return tasks.sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

/**
 * 保存生成任务
 */
export function saveGenerationTask(task: VideoGenerationTask): void {
  if (typeof window === "undefined") return;
  const tasks = getGenerationHistory();
  const existingIndex = tasks.findIndex((t) => t.id === task.id);
  if (existingIndex >= 0) {
    tasks[existingIndex] = { ...task, updatedAt: Date.now() };
  } else {
    tasks.push({ ...task, createdAt: Date.now(), updatedAt: Date.now() });
  }
  localStorage.setItem(STORAGE_KEYS.GENERATION_HISTORY, JSON.stringify(tasks));
}

/**
 * 删除生成任务
 */
export function deleteGenerationTask(id: string): void {
  if (typeof window === "undefined") return;
  const tasks = getGenerationHistory().filter((t) => t.id !== id);
  localStorage.setItem(STORAGE_KEYS.GENERATION_HISTORY, JSON.stringify(tasks));
}

/**
 * 清空所有历史
 */
export function clearGenerationHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.GENERATION_HISTORY);
}

/**
 * 应用设置
 */
export interface AppSettings {
  defaultAspectRatio: "16:9" | "9:16" | "1:1";
  defaultDuration: 5 | 10;
  defaultResolution: "720p" | "1080p";
  theme: "light" | "dark" | "system";
}

const DEFAULT_SETTINGS: AppSettings = {
  defaultAspectRatio: "16:9",
  defaultDuration: 5,
  defaultResolution: "720p",
  theme: "system",
};

/**
 * 获取应用设置
 */
export function getSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (!stored) return DEFAULT_SETTINGS;
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/**
 * 保存应用设置
 */
export function saveSettings(settings: Partial<AppSettings>): void {
  if (typeof window === "undefined") return;
  const current = getSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
}
