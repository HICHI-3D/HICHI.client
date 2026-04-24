import type { Editor } from '@features/simulation-canvas';
import type { Unit, ViewMode } from '@features/simulation-canvas';
import { Icon } from '@shared/ui';

type Props = {
  editor: Editor;
  onFitView: () => void;
};

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
    <footer className="absolute bottom-0 left-0 w-full  flex shrink-0 items-center justify-between p-12">
      {/* ── 2D / 3D 전환 ── */}
      <div className="flex rounded-12 p-4 ds-all-12 gap-8">
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
      <div
        className="
        flex items-center gap-8 rounded-8 bg-gray-100 p-4 ds-all-12
      "
      >
        <ToolBtn
          active={viewport.locked}
          onClick={toggleLock}
          title="화면 잠금"
        >
          <Icon name="lock" alt="화면 잠금" className="size-28" />
        </ToolBtn>
        <ToolBtn onClick={onFitView} title="화면 맞춤">
          <Icon name="camera" alt="화면 맞춤" className="size-28" />
        </ToolBtn>
        <ToolBtn onClick={() => zoomAt(1.2)} title="확대">
          <Icon name="zoomIn" alt="확대" className="size-28" />
        </ToolBtn>
        <ToolBtn onClick={() => zoomAt(1 / 1.2)} title="축소">
          <Icon name="zoomOut" alt="축소" className="size-28" />
        </ToolBtn>
        <ToolBtn onClick={onFitView} title="전체 보기">
          <Icon name="zoomFit" alt="전체 보기" className="size-28" />
        </ToolBtn>

        <div className="mx-4 w-px self-stretch bg-gray-400" />

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
