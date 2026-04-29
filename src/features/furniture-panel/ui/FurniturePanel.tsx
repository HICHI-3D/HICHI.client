import type { FurnitureRecord } from '@entities/furniture';
import { Furniture3DModal } from '@features/furniture-3d';
import { FurnitureScanModal } from '@features/furniture-scan';
import { listFurniture } from '@shared/api';
import { useCallback, useEffect, useState } from 'react';

type Tab = '전체' | '즐겨찾기' | '배치된 가구';

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

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <line x1="9" y1="3" x2="9" y2="15" stroke="currentColor" strokeWidth="1.5" />
    <line x1="3" y1="9" x2="15" y2="9" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

type Props = {
  onClose: () => void;
};

const FurniturePanel = ({ onClose }: Props) => {
  const [activeTab, setActiveTab] = useState<Tab>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<FurnitureRecord[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [scanOpen, setScanOpen] = useState(false);
  const [viewing, setViewing] = useState<FurnitureRecord | null>(null);

  const tabs: Tab[] = ['전체', '즐겨찾기', '배치된 가구'];

  const refresh = useCallback(async () => {
    try {
      const list = await listFurniture();
      setItems(list);
      setLoadError(null);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : '목록 로드 실패');
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const filteredItems = items.filter((item) =>
    item.name.includes(searchQuery),
  );

  return (
    <>
      <aside
        className="
        col h-full w-[284px] shrink-0 overflow-hidden bg-gray-100 ds-right-12
      "
      >
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
          {/* 스캔 버튼 */}
          <button
            type="button"
            onClick={() => setScanOpen(true)}
            className="
              flex-center gap-6 shrink-0 rounded-8 bg-functional-indigo
              px-12 py-10 label-l text-white cursor-pointer transition-opacity
              hover:opacity-80
            "
          >
            <PlusIcon />
            가구 스캔
          </button>

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
            <div
              className="
              flex items-center gap-8 rounded-8 bg-gray-200 p-12 ds-under-2
            "
            >
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

          {/* 에러/빈 상태 */}
          {loadError && (
            <p className="label-s text-red-500">목록 로드 실패: {loadError}</p>
          )}
          {!loadError && filteredItems.length === 0 && (
            <p className="label-s text-gray-700">
              아직 스캔한 가구가 없어요. "가구 스캔"으로 시작하세요.
            </p>
          )}

          {/* 가구 그리드 */}
          <div className="grid grid-cols-2 gap-12 overflow-y-auto">
            {filteredItems.map((item) => {
              const isReady = item.scan_status === 'completed';
              const isFailed =
                item.scan_status === 'failed' ||
                item.scan_status === 'cancelled';
              return (
                <button
                  key={item.id}
                  onClick={() => isReady && setViewing(item)}
                  disabled={!isReady}
                  className={[
                    'col gap-6 p-8 rounded-12 ds-under-2 text-left transition-colors',
                    isReady
                      ? 'bg-gray-200 cursor-pointer hover:bg-gray-300'
                      : 'bg-gray-200 cursor-default',
                  ].join(' ')}
                >
                  <span className="label-l text-gray-800">{item.name}</span>
                  {/* 썸네일 placeholder + 상태 */}
                  <div className="size-[108px] flex-center rounded-8 bg-gray-100">
                    {isReady ? (
                      <span className="label-s text-functional-indigo">
                        3D
                      </span>
                    ) : isFailed ? (
                      <span className="label-s text-red-500">실패</span>
                    ) : (
                      <span className="label-s text-gray-700">
                        {(item.scan_progress * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* 스캔 모달 */}
      <FurnitureScanModal
        open={scanOpen}
        onClose={() => {
          setScanOpen(false);
          void refresh();
        }}
        onCompleted={() => void refresh()}
      />

      {/* 3D 뷰어 모달 */}
      <Furniture3DModal
        furniture={viewing}
        onClose={() => setViewing(null)}
      />
    </>
  );
};

export default FurniturePanel;
