/**
 * API 配置类型
 */
export interface ApiConfig {
  id: string;
  name: string;
  provider: ApiProvider;
  apiKey: string;
  baseUrl?: string;
  model?: string;
  createdAt: number;
  updatedAt: number;
}

/**
 * 支持的 API 提供商
 */
export type ApiProvider =
  | "kling"      // 可灵
  | "runway"     // Runway
  | "pika"       // Pika
  | "luma"       // Luma
  | "haiper"     // Haiper
  | "stable-video"; // Stable Video

/**
 * 视频生成参数
 */
export interface VideoGenerationParams {
  prompt: string;
  aspectRatio: AspectRatio;
  duration: VideoDuration;
  resolution: Resolution;
  apiConfigId: string;
}

/**
 * 视频比例
 */
export type AspectRatio = "16:9" | "9:16" | "1:1";

/**
 * 视频时长
 */
export type VideoDuration = 5 | 10;

/**
 * 视频分辨率
 */
export type Resolution = "720p" | "1080p";

/**
 * 生成任务状态
 */
export type GenerationStatus =
  | "pending"     // 等待中
  | "processing"  // 生成中
  | "completed"   // 已完成
  | "failed";     // 失败

/**
 * 生成步骤
 */
export type GenerationStep =
  | "analyzing"   // 分析文本
  | "generating"  // 生成视频
  | "processing"  // 处理中
  | "completed";  // 完成

/**
 * 视频生成任务
 */
export interface VideoGenerationTask {
  id: string;
  taskId?: string;  // API 返回的任务 ID
  prompt: string;
  params: VideoGenerationParams;
  status: GenerationStatus;
  currentStep: GenerationStep;
  progress: number;
  videoUrl?: string;
  thumbnailUrl?: string;
  error?: string;
  createdAt: number;
  updatedAt: number;
}

/**
 * 生成历史记录
 */
export interface GenerationHistory {
  tasks: VideoGenerationTask[];
}

/**
 * API 提供商信息
 */
export interface ApiProviderInfo {
  id: ApiProvider;
  name: string;
  description: string;
  logo?: string;
  website: string;
  requiresModel: boolean;
  supportedModels?: string[];
}
