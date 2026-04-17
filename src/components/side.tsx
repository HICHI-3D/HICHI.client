import { useState } from 'react';
import Logo from '@assets/logo.svg';
import Cube from '@assets/icon/cube.svg';
import Couch from '@assets/icon/couch.svg';
import Sparkle from '@assets/icon/sparkle.svg';

type NavItem = {
  id: number;
  icon: string;
  label: string;
};

const navItems: NavItem[] = [
  { id: 1, icon: Cube, label: '도면 그리기' },
  { id: 2, icon: Couch, label: '가구 리스트' },
  { id: 3, icon: Sparkle, label: 'AI 배치 추천' },
];

const Side = () => {
  const [activeId, setActiveId] = useState<number>(1);

  return (
    <nav className="col h-full bg-gray-200 ds-right-12 shrink-0">
      {/* 로고 */}
      <div className="flex-center border-b border-gray-400 py-20 px-12 shrink-0">
        <img src={Logo} alt="HICHI" className="h-11" />
      </div>

      {/* 네비게이션 버튼 */}
      <div className="col flex-1 items-center justify-center gap-8 px-12 py-12">
        {navItems.map((item, index) => (
          <div key={item.id} className="col items-center w-full gap-8">
            {/* AI 배치 추천 위에 구분선 */}
            {index === 2 && <div className="w-full h-px bg-gray-400" />}

            <button
              onClick={() => setActiveId(item.id)}
              className={[
                'col flex-center gap-6 size-72 rounded-8 transition-colors cursor-pointer',
                activeId === item.id
                  ? 'bg-functional-indigo-20'
                  : 'hover:bg-gray-300',
              ].join(' ')}
            >
              <img src={item.icon} alt={item.label} className="size-28" />
              <span
                className={[
                  'label-m',
                  activeId === item.id
                    ? 'text-functional-indigo'
                    : 'text-gray-800',
                ].join(' ')}
              >
                {item.label}
              </span>
            </button>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Side;
