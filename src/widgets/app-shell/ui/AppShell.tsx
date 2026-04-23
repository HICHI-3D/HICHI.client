import { useEffect, useRef, useState } from 'react';
import { Header } from '@widgets/header';
import { SideNav } from '@widgets/side-nav';
import { FooterNav } from '@widgets/footer-nav';
import { DrawingPanel } from '@features/drawing-panel';
import { FurniturePanel } from '@features/furniture-panel';
import {
  SimulationCanvas,
  toolLabelToMode,
  useEditor,
} from '@features/simulation-canvas';
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

  const isPanelOpen = activeNav === 'drawing' || activeNav === 'furniture';

  return (
    <div className="flex w-full h-full">
      <SideNav activeNav={activeNav} onNavClick={handleNavClick} />

      <div className="col flex-1 min-w-0">
        <Header />

        <div className="flex flex-1 min-h-0">
          {isPanelOpen && activeNav === 'drawing' && (
            <DrawingPanel
              activeTool={activeTool}
              onToolClick={handleToolClick}
              onClose={handleClosePanel}
            />
          )}
          {isPanelOpen && activeNav === 'furniture' && (
            <FurniturePanel onClose={handleClosePanel} />
          )}

          <div className="col flex-1 min-w-0 min-h-0">
            <div ref={canvasAreaRef} className="flex-1 min-h-0">
              <SimulationCanvas editor={editor} />
            </div>
            <FooterNav editor={editor} onFitView={fitToView} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppShell;
