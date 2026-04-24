import { useCallback, useEffect, useState } from 'react';

import type {
  DrawingMode,
  Point,
  Shape,
  Unit,
  ViewMode,
  Viewport,
} from './types';

const uid = () => Math.random().toString(36).slice(2, 10);

export type Editor = ReturnType<typeof useEditor>;

export function useEditor() {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [history, setHistory] = useState<Shape[][]>([]);
  const [future, setFuture] = useState<Shape[][]>([]);

  const [mode, setMode] = useState<DrawingMode | null>(null);
  const [draftPoints, setDraftPoints] = useState<Point[]>([]);
  const [hoverPoint, setHoverPoint] = useState<Point | null>(null);

  const [viewport, setViewport] = useState<Viewport>({
    panX: 600,
    panY: 400,
    zoom: 0.3,
    locked: false,
    flipH: false,
  });
  const [unit, setUnit] = useState<Unit>('mm');
  const [viewMode, setViewMode] = useState<ViewMode>('2D');

  /* history */
  const pushHistory = useCallback((prev: Shape[]) => {
    setHistory((h) => [...h.slice(-49), prev]);
    setFuture([]);
  }, []);

  const undo = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setFuture((f) => [shapes, ...f]);
      setShapes(prev);
      return h.slice(0, -1);
    });
  }, [shapes]);

  const redo = useCallback(() => {
    setFuture((f) => {
      if (f.length === 0) return f;
      const next = f[0];
      setHistory((h) => [...h, shapes]);
      setShapes(next);
      return f.slice(1);
    });
  }, [shapes]);

  /* shape helpers */
  const commitShape = useCallback(
    (shape: Shape) => {
      setShapes((prev) => {
        pushHistory(prev);
        return [...prev, shape];
      });
    },
    [pushHistory],
  );

  const removeShape = useCallback(
    (id: string) => {
      setShapes((prev) => {
        pushHistory(prev);
        return prev.filter((s) => s.id !== id);
      });
    },
    [pushHistory],
  );

  /* mode */
  const changeMode = useCallback((next: DrawingMode | null) => {
    setMode(next);
    setDraftPoints([]);
  }, []);

  /* interaction — commit point for current mode */
  const handleCanvasClick = useCallback(
    (world: Point) => {
      if (!mode) return;

      if (mode === 'delete') return; // delete handled via shape click

      setDraftPoints((pts) => {
        const points = [...pts, world];

        if (mode === 'room') {
          // close when clicking near first point (3+ points)
          if (points.length >= 3) {
            const first = points[0];
            const dx = world.x - first.x;
            const dy = world.y - first.y;
            if (Math.hypot(dx, dy) < 300) {
              commitShape({
                id: uid(),
                type: 'room',
                points: points.slice(0, -1),
              });
              return [];
            }
          }
          return points;
        }

        if (points.length === 2) {
          const [a, b] = points;
          if (mode === 'wall') {
            commitShape({ id: uid(), type: 'wall', start: a, end: b });
          } else if (mode === 'aux-line') {
            commitShape({ id: uid(), type: 'aux-line', start: a, end: b });
          } else if (mode === 'measurement') {
            commitShape({ id: uid(), type: 'measurement', start: a, end: b });
          } else if (mode === 'rect-column') {
            commitShape({
              id: uid(),
              type: 'rect-column',
              x: Math.min(a.x, b.x),
              y: Math.min(a.y, b.y),
              w: Math.abs(b.x - a.x),
              h: Math.abs(b.y - a.y),
            });
          } else if (mode === 'circle-column') {
            commitShape({
              id: uid(),
              type: 'circle-column',
              cx: a.x,
              cy: a.y,
              r: Math.hypot(b.x - a.x, b.y - a.y),
            });
          }
          return [];
        }

        return points;
      });
    },
    [mode, commitShape],
  );

  const finishDraft = useCallback(() => {
    if (mode === 'room' && draftPoints.length >= 3) {
      commitShape({ id: uid(), type: 'room', points: draftPoints });
    }
    setDraftPoints([]);
  }, [mode, draftPoints, commitShape]);

  const cancelDraft = useCallback(() => setDraftPoints([]), []);

  /* viewport */
  const pan = useCallback(
    (dx: number, dy: number) => {
      if (viewport.locked) return;
      setViewport((v) => ({ ...v, panX: v.panX + dx, panY: v.panY + dy }));
    },
    [viewport.locked],
  );

  const zoomAt = useCallback(
    (factor: number, center?: { x: number; y: number }) => {
      setViewport((v) => {
        const nextZoom = Math.min(3, Math.max(0.05, v.zoom * factor));
        if (!center) return { ...v, zoom: nextZoom };
        // zoom toward cursor position in screen coords
        const ratio = nextZoom / v.zoom;
        return {
          ...v,
          zoom: nextZoom,
          panX: center.x - (center.x - v.panX) * ratio,
          panY: center.y - (center.y - v.panY) * ratio,
        };
      });
    },
    [],
  );

  const toggleLock = useCallback(
    () => setViewport((v) => ({ ...v, locked: !v.locked })),
    [],
  );

  const toggleFlipH = useCallback(
    () => setViewport((v) => ({ ...v, flipH: !v.flipH })),
    [],
  );

  const fitView = useCallback(
    (screenW: number, screenH: number) => {
      if (shapes.length === 0) {
        setViewport((v) => ({
          ...v,
          panX: screenW / 2,
          panY: screenH / 2,
          zoom: 0.3,
        }));
        return;
      }

      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      const visit = (p: Point) => {
        if (p.x < minX) minX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.x > maxX) maxX = p.x;
        if (p.y > maxY) maxY = p.y;
      };
      for (const s of shapes) {
        if (
          s.type === 'wall' ||
          s.type === 'aux-line' ||
          s.type === 'measurement'
        ) {
          visit(s.start);
          visit(s.end);
        } else if (s.type === 'room') {
          s.points.forEach(visit);
        } else if (s.type === 'rect-column') {
          visit({ x: s.x, y: s.y });
          visit({ x: s.x + s.w, y: s.y + s.h });
        } else if (s.type === 'circle-column') {
          visit({ x: s.cx - s.r, y: s.cy - s.r });
          visit({ x: s.cx + s.r, y: s.cy + s.r });
        }
      }
      const pad = 100;
      const w = maxX - minX + pad * 2;
      const h = maxY - minY + pad * 2;
      const zoom = Math.min(screenW / w, screenH / h, 2);
      setViewport((v) => ({
        ...v,
        zoom,
        panX: screenW / 2 - ((minX + maxX) / 2) * zoom,
        panY: screenH / 2 - ((minY + maxY) / 2) * zoom,
      }));
    },
    [shapes],
  );

  /* escape/enter keyboard */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cancelDraft();
        setMode(null);
      } else if (e.key === 'Enter') {
        finishDraft();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cancelDraft, finishDraft]);

  return {
    // state
    shapes,
    mode,
    draftPoints,
    hoverPoint,
    viewport,
    unit,
    viewMode,
    canUndo: history.length > 0,
    canRedo: future.length > 0,
    // state setters
    setHoverPoint,
    setUnit,
    setViewMode,
    // mode
    changeMode,
    // interactions
    handleCanvasClick,
    finishDraft,
    cancelDraft,
    removeShape,
    // history
    undo,
    redo,
    // viewport
    pan,
    zoomAt,
    toggleLock,
    toggleFlipH,
    fitView,
  };
}
