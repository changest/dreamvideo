import {
  VideoApiAdapter,
  VideoGenerationRequest,
  VideoGenerationResponse,
  ApiConfig,
} from "./types";

/**
 * Luma API 适配器
 */
export class LumaAdapter implements VideoApiAdapter {
  name = "Luma";
  private config: ApiConfig;
  private baseUrl: string;

  constructor(config: ApiConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || "https://api.lumalabs.ai";
  }

  async generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/dream-machine/v1/generations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          prompt: request.prompt,
          aspect_ratio: request.aspectRatio,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Luma API 错误: ${error}`);
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
        `${this.baseUrl}/dream-machine/v1/generations/${taskId}`,
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
      if (data.state === "completed") status = "completed";
      else if (data.state === "failed") status = "failed";
      else if (data.state === "queued") status = "pending";

      const videoAsset = data.assets?.video;

      return {
        taskId,
        status,
        videoUrl: videoAsset,
        thumbnailUrl: data.assets?.image,
        progress: this.calculateProgress(data.state),
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

  private calculateProgress(state: string): number {
    const progressMap: Record<string, number> = {
      queued: 0,
      pending: 10,
      processing: 50,
      completed: 100,
      failed: 0,
    };
    return progressMap[state] || 50;
  }
}
