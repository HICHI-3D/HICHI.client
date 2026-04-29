export type FurnitureItem = {
  id: number;
  name: string;
  category?: string | null;
  width_mm?: number | null;
  depth_mm?: number | null;
  height_mm?: number | null;
};

/** 백엔드 가구 응답 (스캔 진행 상태 포함) */
export type FurnitureRecord = FurnitureItem & {
  scan_status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  scan_progress: number;
  scan_stage: string | null;
  ai_job_id: string | null;
  error: string | null;
  /** 백엔드 상대 경로 (예: /api/furniture/12/model.glb) */
  model_url: string | null;
  created_at: string;
};
