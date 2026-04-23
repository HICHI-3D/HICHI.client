import { useState } from 'react';
import { Header } from '@widgets/header';
import { SideNav } from '@widgets/side-nav';
import { FooterNav } from '@widgets/footer-nav';
import { DrawingPanel } from '@features/drawing-panel';
import { FurniturePanel } from '@features/furniture-panel';
import type { NavId } from '../model/types';

const AppShell = () => {
  const [activeNav, setActiveNav] = useState<NavId | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const handleNavClick = (id: NavId) => {
    if (activeNav === id) {
      // 같은 버튼: 패널 닫기 (AI는 deselect)
      setActiveNav(null);
      setActiveTool(null);
    } else {
      setActiveNav(id);
      setActiveTool(null); // 패널 전환 시 도구 초기화
    }
  };

  const handleClosePanel = () => {
    setActiveNav(null);
    setActiveTool(null);
  };

  const handleToolClick = (tool: string) => {
    setActiveTool((prev) => (prev === tool ? null : tool));
  };

  const isPanelOpen = activeNav === 'drawing' || activeNav === 'furniture';

  return (
    <div className="flex w-full h-full">
      {/* 사이드바: 전체 높이 */}
      <SideNav activeNav={activeNav} onNavClick={handleNavClick} />

      {/* 오른쪽: 헤더 + 콘텐츠 */}
      <div className="col flex-1 min-w-0">
        <Header />

        {/* 헤더 아래: 패널(옵션) + [캔버스 + 풋터] */}
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

          {/* 캔버스 + 풋터 네브 */}
          <div className="col flex-1 min-w-0 min-h-0">
            <main className="flex-1 bg-gray-100" />
            <FooterNav />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppShell;
