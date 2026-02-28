/**
 * 视频生成 API 适配器类型定义
 */

export interface VideoGenerationRequest {
  prompt: string;
  aspectRatio: "16:9" | "9:16" | "1:1";
  duration: 5 | 10;
  resolution: "720p" | "1080p";
}

export interface VideoGenerationResponse {
  taskId: string;
  status: "pending" | "processing" | "completed" | "failed";
  videoUrl?: string;
  thumbnailUrl?: string;
  progress?: number;
  error?: string;
}

export interface VideoApiAdapter {
  name: string;
  generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResponse>;
  checkStatus(taskId: string): Promise<VideoGenerationResponse>;
}

export interface ApiConfig {
  apiKey: string;
  baseUrl?: string;
  model?: string;
}
