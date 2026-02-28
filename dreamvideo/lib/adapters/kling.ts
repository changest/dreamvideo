import {
  VideoApiAdapter,
  VideoGenerationRequest,
  VideoGenerationResponse,
  ApiConfig,
} from "./types";

/**
 * 可灵 (Kling) API 适配器
 */
export class KlingAdapter implements VideoApiAdapter {
  name = "可灵";
  private config: ApiConfig;
  private baseUrl: string;

  constructor(config: ApiConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || "https://api.klingai.com";
  }

  async generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/videos/generations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          prompt: request.prompt,
          aspect_ratio: request.aspectRatio,
          duration: request.duration,
          resolution: request.resolution,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`可灵 API 错误: ${error}`);
      }

      const data = await response.json();

      return {
        taskId: data.task_id,
        status: "pending",
        progress: 0,
      };
    } catch (error) {
      return {
        taskId: "",
        status: "failed",
        error: error instanceof Error ? error.message : "未知错误",
      };
    }
  }

  async checkStatus(taskId: string): Promise<VideoGenerationResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v1/videos/generations/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`查询状态失败: ${error}`);
      }

      const data = await response.json();

      // 映射状态
      let status: VideoGenerationResponse["status"] = "processing";
      if (data.status === "succeeded") status = "completed";
      else if (data.status === "failed") status = "failed";
      else if (data.status === "pending") status = "pending";

      return {
        taskId,
        status,
        videoUrl: data.video_url,
        thumbnailUrl: data.thumbnail_url,
        progress: data.progress || 0,
        error: data.error_message,
      };
    } catch (error) {
      return {
        taskId,
        status: "failed",
        error: error instanceof Error ? error.message : "查询状态失败",
      };
    }
  }
}
