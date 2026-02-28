import {
  VideoApiAdapter,
  VideoGenerationRequest,
  VideoGenerationResponse,
  ApiConfig,
} from "./types";

/**
 * Runway API 适配器
 */
export class RunwayAdapter implements VideoApiAdapter {
  name = "Runway";
  private config: ApiConfig;
  private baseUrl: string;

  constructor(config: ApiConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || "https://api.runwayml.com";
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
          aspect_ratio: this.mapAspectRatio(request.aspectRatio),
          seconds: request.duration,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Runway API 错误: ${error}`);
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
      if (data.status === "SUCCEEDED") status = "completed";
      else if (data.status === "FAILED") status = "failed";
      else if (data.status === "PENDING" || data.status === "THROTTLED") status = "pending";

      return {
        taskId,
        status,
        videoUrl: data.output?.[0]?.url,
        thumbnailUrl: data.output?.[0]?.preview_image_url,
        progress: this.calculateProgress(data.status),
        error: data.failure_reason,
      };
    } catch (error) {
      return {
        taskId,
        status: "failed",
        error: error instanceof Error ? error.message : "查询状态失败",
      };
    }
  }

  private mapAspectRatio(ratio: string): string {
    const map: Record<string, string> = {
      "16:9": "16:9",
      "9:16": "9:16",
      "1:1": "1:1",
    };
    return map[ratio] || "16:9";
  }

  private calculateProgress(status: string): number {
    const progressMap: Record<string, number> = {
      PENDING: 0,
      THROTTLED: 10,
      RUNNING: 50,
      SUCCEEDED: 100,
      FAILED: 0,
    };
    return progressMap[status] || 50;
  }
}
