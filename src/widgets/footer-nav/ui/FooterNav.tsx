import type { Editor } from '@features/simulation-canvas';
import type { ViewMode, Unit } from '@features/simulation-canvas';

type Props = {
  editor: Editor;
  onFitView: () => void;
};

/* ── 아이콘 ─────────────────────────────────────── */

const LockIcon = ({ open }: { open?: boolean }) => (
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
      d={open ? 'M10 13V9.5a4 4 0 0 1 8 0V11' : 'M10 13V9.5a4 4 0 0 1 8 0V13'}
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
    <line x1="14" y1="6" x2="14" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="6" y1="14" x2="22" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const MinusIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <line x1="6" y1="14" x2="22" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ExpandIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M7 7L11 11M7 7H11M7 7V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 7L17 11M21 7H17M21 7V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 21L11 17M7 21H11M7 21V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 21L17 17M21 21H17M21 21V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ── 재사용 버튼 ────────────────────────────────── */

type IconBtnProps = {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
};

const ToolBtn = ({ active, onClick, children, title }: IconBtnProps) => (
  <button
    onClick={onClick}
    title={title}
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

const FooterNav = ({ editor, onFitView }: Props) => {
  const { viewport, viewMode, unit, setViewMode, setUnit, toggleLock, zoomAt } =
    editor;

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
        <ToolBtn active={viewport.locked} onClick={toggleLock} title="화면 잠금">
          <LockIcon open={!viewport.locked} />
        </ToolBtn>
        <ToolBtn onClick={onFitView} title="화면 맞춤">
          <CameraIcon />
        </ToolBtn>
        <ToolBtn onClick={() => zoomAt(1.2)} title="확대">
          <PlusIcon />
        </ToolBtn>
        <ToolBtn onClick={() => zoomAt(1 / 1.2)} title="축소">
          <MinusIcon />
        </ToolBtn>
        <ToolBtn onClick={onFitView} title="전체 보기">
          <ExpandIcon />
        </ToolBtn>

        {/* 세로 구분선 */}
        <div className="w-px self-stretch bg-gray-400 mx-4" />

        {/* 단위 전환 */}
        {(['mm', 'ft/in'] as Unit[]).map((u) => (
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
