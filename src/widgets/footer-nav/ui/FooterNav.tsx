import { useState } from 'react';

type ViewMode = '2D' | '3D';
type UnitMode = 'mm' | 'ft/in';
type ToolKey = 'lock' | 'camera' | 'add' | 'divider' | 'expand';

/* ── 아이콘 ─────────────────────────────────────── */

const LockIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect
      x="6.5"
      y="13"
      width="15"
      height="11"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M10 13V9.5a4 4 0 0 1 8 0V13"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const CameraIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path
      d="M5 9V7.5A1.5 1.5 0 0 1 6.5 6H9M23 9V7.5A1.5 1.5 0 0 0 21.5 6H19M5 19v1.5A1.5 1.5 0 0 0 6.5 22H9M23 19v1.5A1.5 1.5 0 0 1 21.5 22H19"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="14" cy="14" r="3.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const PlusIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <line
      x1="14"
      y1="6"
      x2="14"
      y2="22"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <line
      x1="6"
      y1="14"
      x2="22"
      y2="14"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

/* poweron rotated 90° → 가로선 아이콘 */
const DividerLineIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <line
      x1="5"
      y1="14"
      x2="23"
      y2="14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle
      cx="14"
      cy="14"
      r="3"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
  </svg>
);

/* 4방향 화살표 확장 아이콘 */
const ExpandIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path
      d="M7 7L11 11M7 7H11M7 7V11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 7L17 11M21 7H17M21 7V11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 21L11 17M7 21H11M7 21V17"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 21L17 17M21 21H17M21 21V17"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ── 도구 목록 ─────────────────────────────────── */

type Tool = { key: ToolKey; icon: React.ReactNode };

const tools: Tool[] = [
  { key: 'lock', icon: <LockIcon /> },
  { key: 'camera', icon: <CameraIcon /> },
  { key: 'add', icon: <PlusIcon /> },
  { key: 'divider', icon: <DividerLineIcon /> },
  { key: 'expand', icon: <ExpandIcon /> },
];

/* ── 재사용 버튼 ────────────────────────────────── */

type IconBtnProps = {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  label?: string;
};

const ToolBtn = ({ active, onClick, children, label }: IconBtnProps) => (
  <button
    onClick={onClick}
    title={label}
    className={[
      'flex-center size-56 rounded-8 transition-colors cursor-pointer',
      active
        ? 'bg-functional-indigo-20 text-functional-indigo'
        : 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    ].join(' ')}
  >
    {children}
  </button>
);

/* ── FooterNav ──────────────────────────────────── */

const FooterNav = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('2D');
  const [unit, setUnit] = useState<UnitMode>('mm');
  const [activeTools, setActiveTools] = useState<Set<ToolKey>>(new Set());

  const toggleTool = (key: ToolKey) => {
    setActiveTools((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  return (
    <footer className="flex items-center justify-between px-12 py-12 shrink-0">
      {/* ── 2D / 3D 전환 ── */}
      <div className="flex p-4 rounded-12 ds-all-12">
        {(['2D', '3D'] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={[
              'flex-center size-56 rounded-8 label-l transition-colors cursor-pointer',
              viewMode === mode
                ? 'bg-functional-indigo-20 text-functional-indigo'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            ].join(' ')}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* ── 도구 버튼 그룹 ── */}
      <div className="flex items-center gap-8 px-4 py-4 bg-gray-100 rounded-8 ds-all-12">
        {/* 아이콘 도구 */}
        {tools.map(({ key, icon }) => (
          <ToolBtn
            key={key}
            active={activeTools.has(key)}
            onClick={() => toggleTool(key)}
          >
            {icon}
          </ToolBtn>
        ))}

        {/* 세로 구분선 */}
        <div className="w-px self-stretch bg-gray-400 mx-4" />

        {/* 단위 전환 */}
        {(['mm', 'ft/in'] as UnitMode[]).map((u) => (
          <button
            key={u}
            onClick={() => setUnit(u)}
            className={[
              'flex-center size-56 rounded-8 label-m transition-colors cursor-pointer',
              unit === u
                ? 'bg-functional-indigo-20 text-functional-indigo'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300',
            ].join(' ')}
          >
            {u}
          </button>
        ))}
      </div>
    </footer>
  );
};

export default FooterNav;
