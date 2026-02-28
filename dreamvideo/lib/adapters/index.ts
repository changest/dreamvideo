import { KlingAdapter } from "./kling";
import { RunwayAdapter } from "./runway";
import { PikaAdapter } from "./pika";
import { LumaAdapter } from "./luma";
import { VideoApiAdapter, ApiConfig, VideoGenerationRequest, VideoGenerationResponse } from "./types";

export * from "./types";
export { KlingAdapter } from "./kling";
export { RunwayAdapter } from "./runway";
export { PikaAdapter } from "./pika";
export { LumaAdapter } from "./luma";

/**
 * 支持的 API 提供商类型
 */
export type ApiProvider = "kling" | "runway" | "pika" | "luma" | "haiper" | "stable-video";

/**
 * 创建视频 API 适配器
 */
export function createVideoAdapter(provider: ApiProvider, config: ApiConfig): VideoApiAdapter {
  switch (provider) {
    case "kling":
      return new KlingAdapter(config);
    case "runway":
      return new RunwayAdapter(config);
    case "pika":
      return new PikaAdapter(config);
    case "luma":
      return new LumaAdapter(config);
    default:
      // 默认使用可灵适配器
      return new KlingAdapter(config);
  }
}

/**
 * 生成视频（带重试机制）
 */
export async function generateVideoWithRetry(
  adapter: VideoApiAdapter,
  request: VideoGenerationRequest,
  maxRetries = 3
): Promise<VideoGenerationResponse> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await adapter.generateVideo(request);
      if (result.status !== "failed") {
        return result;
      }
      if (result.error) {
        lastError = new Error(result.error);
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }

    // 等待后重试
    if (i < maxRetries - 1) {
      await delay(1000 * (i + 1));
    }
  }

  return {
    taskId: "",
    status: "failed",
    error: lastError?.message || "生成失败，请重试",
  };
}

/**
 * 轮询检查视频生成状态
 */
export async function pollVideoStatus(
  adapter: VideoApiAdapter,
  taskId: string,
  onProgress?: (response: VideoGenerationResponse) => void,
  interval = 5000,
  timeout = 600000 // 10分钟超时
): Promise<VideoGenerationResponse> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const result = await adapter.checkStatus(taskId);

    if (onProgress) {
      onProgress(result);
    }

    if (result.status === "completed" || result.status === "failed") {
      return result;
    }

    await delay(interval);
  }

  return {
    taskId,
    status: "failed",
    error: "生成超时，请稍后查看历史记录",
  };
}

/**
 * 延迟函数
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 获取提供商显示名称
 */
export function getProviderDisplayName(provider: ApiProvider): string {
  const names: Record<ApiProvider, string> = {
    kling: "可灵",
    runway: "Runway",
    pika: "Pika",
    luma: "Luma",
    haiper: "Haiper",
    "stable-video": "Stable Video",
  };
  return names[provider] || provider;
}
