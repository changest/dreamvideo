import {
  createVideoAdapter,
  generateVideoWithRetry,
  pollVideoStatus,
  ApiProvider,
} from "./adapters";
import { getApiConfigById, saveGenerationTask } from "./storage";
import { VideoGenerationParams, VideoGenerationTask, GenerationStep } from "@/types";

/**
 * 开始视频生成任务
 */
export async function startVideoGeneration(
  params: VideoGenerationParams
): Promise<{ success: boolean; task?: VideoGenerationTask; error?: string }> {
  // 获取 API 配置
  const apiConfig = getApiConfigById(params.apiConfigId);
  if (!apiConfig) {
    return { success: false, error: "未找到 API 配置" };
  }

  // 创建任务记录
  const task: VideoGenerationTask = {
    id: generateTaskId(),
    prompt: params.prompt,
    params,
    status: "pending",
    currentStep: "analyzing",
    progress: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  // 保存任务
  saveGenerationTask(task);

  try {
    // 创建适配器
    const adapter = createVideoAdapter(apiConfig.provider as ApiProvider, {
      apiKey: apiConfig.apiKey,
      baseUrl: apiConfig.baseUrl,
      model: apiConfig.model,
    });

    // 更新任务状态为生成中
    task.status = "processing";
    task.currentStep = "generating";
    task.progress = 10;
    saveGenerationTask(task);

    // 调用 API 生成视频
    const result = await generateVideoWithRetry(adapter, {
      prompt: params.prompt,
      aspectRatio: params.aspectRatio,
      duration: params.duration,
      resolution: params.resolution,
    });

    if (result.status === "failed" || result.error) {
      task.status = "failed";
      task.error = result.error || "生成失败";
      saveGenerationTask(task);
      return { success: false, error: task.error, task };
    }

    // 保存任务 ID
    task.taskId = result.taskId;
    task.currentStep = "processing";
    task.progress = 30;
    saveGenerationTask(task);

    return { success: true, task };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "未知错误";
    task.status = "failed";
    task.error = errorMessage;
    saveGenerationTask(task);
    return { success: false, error: errorMessage, task };
  }
}

/**
 * 轮询视频生成状态
 */
export async function pollVideoGeneration(
  taskId: string,
  onProgress?: (task: VideoGenerationTask) => void
): Promise<VideoGenerationTask | null> {
  const { getGenerationHistory } = await import("./storage");

  // 查找任务
  const tasks = getGenerationHistory();
  const task = tasks.find((t) => t.id === taskId || t.taskId === taskId);
  if (!task) return null;

  // 如果任务已经完成或失败，直接返回
  if (task.status === "completed" || task.status === "failed") {
    return task;
  }

  // 获取 API 配置
  const apiConfig = getApiConfigById(task.params.apiConfigId);
  if (!apiConfig) {
    task.status = "failed";
    task.error = "API 配置不存在";
    saveGenerationTask(task);
    return task;
  }

  // 创建适配器
  const adapter = createVideoAdapter(apiConfig.provider as ApiProvider, {
    apiKey: apiConfig.apiKey,
    baseUrl: apiConfig.baseUrl,
    model: apiConfig.model,
  });

  if (!task.taskId) {
    task.status = "failed";
    task.error = "任务 ID 不存在";
    saveGenerationTask(task);
    return task;
  }

  // 轮询状态
  const result = await pollVideoStatus(
    adapter,
    task.taskId,
    (response) => {
      // 更新进度
      if (response.progress !== undefined) {
        task.progress = Math.min(30 + response.progress * 0.7, 95);
      }

      if (response.status === "completed") {
        task.status = "completed";
        task.currentStep = "completed";
        task.progress = 100;
        task.videoUrl = response.videoUrl;
        task.thumbnailUrl = response.thumbnailUrl;
      } else if (response.status === "failed") {
        task.status = "failed";
        task.error = response.error || "生成失败";
      }

      task.updatedAt = Date.now();
      saveGenerationTask(task);

      if (onProgress) {
        onProgress(task);
      }
    },
    5000, // 每 5 秒查询一次
    600000 // 10 分钟超时
  );

  // 最终结果
  if (result.status === "completed") {
    task.status = "completed";
    task.currentStep = "completed";
    task.progress = 100;
    task.videoUrl = result.videoUrl;
    task.thumbnailUrl = result.thumbnailUrl;
  } else if (result.status === "failed") {
    task.status = "failed";
    task.error = result.error || "生成失败";
  }

  task.updatedAt = Date.now();
  saveGenerationTask(task);

  return task;
}

/**
 * 生成任务 ID
 */
function generateTaskId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 获取步骤显示名称
 */
export function getStepDisplayName(step: GenerationStep): string {
  const names: Record<GenerationStep, string> = {
    analyzing: "分析文本",
    generating: "生成视频",
    processing: "处理中",
    completed: "已完成",
  };
  return names[step];
}

/**
 * 获取步骤顺序
 */
export function getStepOrder(step: GenerationStep): number {
  const orders: Record<GenerationStep, number> = {
    analyzing: 0,
    generating: 1,
    processing: 2,
    completed: 3,
  };
  return orders[step];
}
