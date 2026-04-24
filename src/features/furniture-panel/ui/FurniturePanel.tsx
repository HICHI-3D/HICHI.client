import type { FurnitureItem } from '@entities/furniture';
import { useState } from 'react';

type Tab = '전체' | '즐겨찾기' | '배치된 가구';

// 임시 가구 데이터 (추후 실제 데이터로 교체)
const furnitureItems: FurnitureItem[] = [
  { id: 1, name: '침대' },
  { id: 2, name: '침대' },
  { id: 3, name: '소파' },
  { id: 4, name: '소파' },
  { id: 5, name: '책상' },
  { id: 6, name: '의자' },
  { id: 7, name: '옷장' },
  { id: 8, name: '식탁' },
];

// 패널 접기 아이콘
const CollapseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect
      x="2.5"
      y="3.5"
      width="19"
      height="17"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <line
      x1="8.5"
      y1="3.5"
      x2="8.5"
      y2="20.5"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M13 9.5L11 12L13 14.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 검색 아이콘
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
    <line
      x1="12.5"
      y1="12.5"
      x2="15.5"
      y2="15.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

type Props = {
  onClose: () => void;
};

const FurniturePanel = ({ onClose }: Props) => {
  const [activeTab, setActiveTab] = useState<Tab>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const tabs: Tab[] = ['전체', '즐겨찾기', '배치된 가구'];

  const filteredItems = furnitureItems.filter((item) =>
    item.name.includes(searchQuery),
  );

  return (
    <aside className="
      col h-full w-[284px] shrink-0 overflow-hidden bg-gray-100 ds-right-12
    ">
      {/* 패널 헤더 */}
      <div className="flex shrink-0 items-center justify-between px-12 py-8">
        <span className="body-s text-black">가구 리스트</span>
        <button
          onClick={onClose}
          className="
            flex-center size-24 cursor-pointer rounded-8 text-gray-700
            transition-colors
            hover:bg-gray-300
          "
        >
          <CollapseIcon />
        </button>
      </div>

      {/* 구분선 */}
      <div className="h-px w-full shrink-0 bg-gray-400" />

      {/* 내용 */}
      <div className="col flex-1 gap-12 overflow-hidden px-12 py-8">
        {/* 탭 + 검색 */}
        <div className="col shrink-0 gap-4">
          {/* 탭 */}
          <div className="flex items-center">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={[
                  'px-6 py-6 label-m transition-colors cursor-pointer',
                  activeTab === tab
                    ? 'text-functional-indigo border-b-2 border-functional-indigo'
                    : 'text-black',
                ].join(' ')}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 검색바 */}
          <div className="
            flex items-center gap-8 rounded-8 bg-gray-200 p-12 ds-under-2
          ">
            <span className="shrink-0 text-gray-500">
              <SearchIcon />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="가구명을 입력하세요"
              className="
                flex-1 bg-transparent label-l text-gray-500 outline-none
                placeholder:text-gray-500
              "
            />
          </div>
        </div>

        {/* 구분선 */}
        <div className="h-px w-full shrink-0 bg-gray-400" />

        {/* 가구 그리드 */}
        <div className="grid grid-cols-2 gap-12 overflow-y-auto">
          {filteredItems.map((item) => {
            const isSelected = selectedId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedId(isSelected ? null : item.id)}
                className={[
                  'col gap-6 p-8 rounded-12 ds-under-2 text-left transition-colors cursor-pointer',
                  isSelected
                    ? 'bg-functional-indigo'
                    : 'bg-gray-200 hover:bg-gray-300',
                ].join(' ')}
              >
                <span
                  className={[
                    'label-l',
                    isSelected ? 'text-white' : 'text-gray-800',
                  ].join(' ')}
                >
                  {item.name}
                </span>
                {/* 가구 이미지 placeholder */}
                <div className="size-[108px] rounded-8 bg-gray-100" />
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default FurniturePanel;
