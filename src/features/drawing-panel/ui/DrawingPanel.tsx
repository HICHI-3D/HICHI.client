type Props = {
  activeTool: string | null;
  onToolClick: (tool: string) => void;
  onClose: () => void;
};

type ToolGroup = {
  category: string;
  tools: string[];
};

const toolGroups: ToolGroup[] = [
  { category: '특수기능', tools: ['도면 이미지 업로드'] },
  { category: '방만들기', tools: ['벽 그리기', '방 그리기', '삭제'] },
  { category: '구조물 그리기', tools: ['사각기둥 그리기', '원 기둥 그리기'] },
  { category: '보조선 그리기', tools: ['보조선 그리기', '측정'] },
  { category: '도면 반전', tools: ['좌우 반전'] },
];

// 패널 접기 아이콘 (sidebar.left)
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

const DrawingPanel = ({ activeTool, onToolClick, onClose }: Props) => {
  return (
    <aside
      className="
      col h-full w-[284px] shrink-0 overflow-hidden bg-gray-100 ds-right-12
    "
    >
      {/* 패널 헤더 */}
      <div className="flex shrink-0 items-center justify-between px-12 py-8">
        <span className="body-s text-black">도면 그리기</span>
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

      {/* 도구 목록 */}
      <div className="col flex-1 gap-12 overflow-y-auto px-12 py-8">
        {toolGroups.map((group) => (
          <div key={group.category} className="col gap-4">
            {/* 카테고리 라벨 */}
            <div className="px-12 py-6">
              <span className="label-m text-black">{group.category}</span>
            </div>

            {/* 도구 버튼 목록 */}
            <div className="col gap-8">
              {group.tools.map((tool) => {
                const isActive = activeTool === tool;
                return (
                  <button
                    key={tool}
                    onClick={() => onToolClick(tool)}
                    className={[
                      'flex items-center px-12 py-12 rounded-8 ds-under-2 transition-colors cursor-pointer w-full text-left',
                      isActive
                        ? 'bg-functional-indigo text-white'
                        : 'bg-gray-200 text-black hover:bg-gray-300',
                    ].join(' ')}
                  >
                    <span className="label-l">{tool}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default DrawingPanel;
