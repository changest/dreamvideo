import {
  VideoApiAdapter,
  VideoGenerationRequest,
  VideoGenerationResponse,
  ApiConfig,
} from "./types";

/**
 * Pika API 适配器
 */
export class PikaAdapter implements VideoApiAdapter {
  name = "Pika";
  private config: ApiConfig;
  private baseUrl: string;

  constructor(config: ApiConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || "https://api.pika.art";
  }

  async generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/generations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          prompt: request.prompt,
          aspect_ratio: request.aspectRatio,
          seconds: request.duration,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Pika API 错误: ${error}`);
      }

      const data = await response.json();

      return {
        taskId: data.id,
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
        `${this.baseUrl}/v1/generations/${taskId}`,
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
      if (data.status === "completed") status = "completed";
      else if (data.status === "failed") status = "failed";
      else if (data.status === "queued") status = "pending";

      return {
        taskId,
        status,
        videoUrl: data.video?.url,
        thumbnailUrl: data.video?.thumbnail_url,
        progress: data.progress || (status === "completed" ? 100 : 50),
        error: data.error,
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
