import { DrawingPanel } from '@features/drawing-panel';
import { FurniturePanel } from '@features/furniture-panel';
import {
  parsedToShapes,
  Scene3DCanvas,
  SimulationCanvas,
  toolLabelToMode,
  useEditor,
} from '@features/simulation-canvas';
import { uploadFloorPlan } from '@shared/api';
import { config } from '@shared/config';
import { FooterNav } from '@widgets/footer-nav';
import { Header } from '@widgets/header';
import { SideNav } from '@widgets/side-nav';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { NavId } from '../model/types';

const AppShell = () => {
  const [activeNav, setActiveNav] = useState<NavId | null>('drawing');
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const editor = useEditor();
  const canvasAreaRef = useRef<HTMLDivElement>(null);

  /* activeTool from panel → editor drawing mode */
  useEffect(() => {
    editor.changeMode(toolLabelToMode(activeTool));
  }, [activeTool]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNavClick = (id: NavId) => {
    if (activeNav === id) {
      setActiveNav(null);
      setActiveTool(null);
    } else {
      setActiveNav(id);
      setActiveTool(null);
    }
  };

  const handleClosePanel = () => {
    setActiveNav(null);
    setActiveTool(null);
  };

  const handleToolClick = (tool: string) => {
    if (tool === '좌우 반전') {
      editor.toggleFlipH();
      return;
    }
    setActiveTool((prev) => (prev === tool ? null : tool));
  };

  const fitToView = () => {
    const el = canvasAreaRef.current;
    if (!el) return;
    editor.fitView(el.clientWidth, el.clientHeight);
  };

  const handleUploadFloorPlan = useCallback(
    async (file: File) => {
      const result = await uploadFloorPlan(file);
      if (result.status === 'failed' || !result.parsed) {
        throw new Error(result.error ?? 'AI 파싱 실패');
      }
      const shapes = parsedToShapes(result.parsed);
      editor.addShapes(shapes);

      const parser = result.parsed.parser ?? 'opencv';
      const wallCount = result.parsed.walls.length;

      // 원본 이미지를 캔버스 배경으로 설정 (사진 같은 느낌)
      if (result.image_url) {
        const { image_width, image_height, pixels_per_mm } =
          result.parsed.meta;
        const ppm = pixels_per_mm > 0 ? pixels_per_mm : config.defaultPixelsPerMm;
        editor.setBackgroundImage({
          url: `${config.apiBaseUrl}${result.image_url}`,
          widthMm: image_width / ppm,
          heightMm: image_height / ppm,
          opacity: 0.85,
        });
      }

      // 캔버스에 맞춰 뷰포트 자동 정렬
      const el = canvasAreaRef.current;
      if (el) {
        // shapes가 state 반영된 다음 tick에 fitView
        requestAnimationFrame(() =>
          editor.fitView(el.clientWidth, el.clientHeight),
        );
      }

      return { parser, wallCount };
    },
    [editor],
  );

  const isPanelOpen = activeNav === 'drawing' || activeNav === 'furniture';

  return (
    <div className="flex size-full">
      <SideNav activeNav={activeNav} onNavClick={handleNavClick} />
      <div className="min-w-0 col flex-1">
        <Header editor={editor} />
        <div className="min-h-0 flex flex-1 bg-gray-100">
          {isPanelOpen && activeNav === 'drawing' && (
            <DrawingPanel
              activeTool={activeTool}
              onToolClick={handleToolClick}
              onClose={handleClosePanel}
              onUploadFloorPlan={handleUploadFloorPlan}
            />
          )}
          {isPanelOpen && activeNav === 'furniture' && (
            <FurniturePanel onClose={handleClosePanel} />
          )}
          <div className="min-w-0 min-h-0 w-full col flex-1 relative">
            <div ref={canvasAreaRef} className="min-h-0 flex-1">
              {editor.viewMode === '3D' ? (
                <Scene3DCanvas editor={editor} />
              ) : (
                <SimulationCanvas editor={editor} />
              )}
            </div>
            <FooterNav editor={editor} onFitView={fitToView} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppShell;
