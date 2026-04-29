/**
 * 환경 설정. Vite는 import.meta.env.VITE_* 만 노출.
 */

export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000',
  /** 기본 1px = 10mm (이미지 1000px ≒ 10m). 추후 캘리브레이션 UI에서 조정. */
  defaultPixelsPerMm: 0.1,
} as const;
