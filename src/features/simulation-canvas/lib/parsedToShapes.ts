/**
 * 백엔드에서 받은 ParsedFloorPlan → Editor가 이해하는 Shape 배열 변환.
 */

import type { ParsedFloorPlan } from '@shared/api';

import type { Shape } from '../model/types';

const uid = () => Math.random().toString(36).slice(2, 10);

export const parsedToShapes = (parsed: ParsedFloorPlan): Shape[] => {
  return parsed.walls.map<Shape>((w) => ({
    id: uid(),
    type: 'wall',
    start: { x: w.x1, y: w.y1 },
    end: { x: w.x2, y: w.y2 },
  }));
};
