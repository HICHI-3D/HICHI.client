export type Point = { x: number; y: number };

export type DrawingMode =
  | 'wall'
  | 'room'
  | 'rect-column'
  | 'circle-column'
  | 'aux-line'
  | 'measurement'
  | 'delete';

export type Shape =
  | { id: string; type: 'wall'; start: Point; end: Point }
  | { id: string; type: 'room'; points: Point[] }
  | {
      id: string;
      type: 'rect-column';
      x: number;
      y: number;
      w: number;
      h: number;
    }
  | { id: string; type: 'circle-column'; cx: number; cy: number; r: number }
  | { id: string; type: 'aux-line'; start: Point; end: Point }
  | { id: string; type: 'measurement'; start: Point; end: Point };

export type Viewport = {
  panX: number;
  panY: number;
  zoom: number;
  locked: boolean;
  flipH: boolean;
};

export type Unit = 'mm' | 'ft/in';

export type ViewMode = '2D' | '3D';

export const toolLabelToMode = (label: string | null): DrawingMode | null => {
  switch (label) {
    case '벽 그리기':
      return 'wall';
    case '방 그리기':
      return 'room';
    case '삭제':
      return 'delete';
    case '사각기둥 그리기':
      return 'rect-column';
    case '원 기둥 그리기':
      return 'circle-column';
    case '보조선 그리기':
      return 'aux-line';
    case '측정':
      return 'measurement';
    default:
      return null;
  }
};
