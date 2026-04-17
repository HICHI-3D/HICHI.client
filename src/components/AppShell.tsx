import { useState } from 'react';
import Header from '@components/header.tsx';
import Side from '@components/side.tsx';
import DrawingPanel from '@components/DrawingPanel.tsx';
import FurniturePanel from '@components/FurniturePanel.tsx';

export type NavId = 'drawing' | 'furniture' | 'ai';

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
      <Side activeNav={activeNav} onNavClick={handleNavClick} />

      {/* 오른쪽: 헤더 + 콘텐츠 */}
      <div className="col flex-1 min-w-0">
        <Header />

        {/* 헤더 아래: 패널(옵션) + 캔버스 */}
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
          <main className="flex-1 bg-gray-100" />
        </div>
      </div>
    </div>
  );
};

export default AppShell;
