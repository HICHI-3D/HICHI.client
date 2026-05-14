import { useRef, useState } from 'react';

type UploadResult = {
  parser: 'vision' | 'opencv';
  wallCount: number;
};

type Props = {
  activeTool: string | null;
  onToolClick: (tool: string) => void;
  onClose: () => void;
  onUploadFloorPlan?: (
    file: File,
  ) => Promise<UploadResult | void> | UploadResult | void;
};

type ToolGroup = {
  category: string;
  tools: string[];
};

const FLOOR_PLAN_UPLOAD_TOOL = '도면 이미지 업로드';

const toolGroups: ToolGroup[] = [
  { category: '특수기능', tools: [FLOOR_PLAN_UPLOAD_TOOL] },
  { category: '방만들기', tools: ['벽 그리기', '방 그리기', '삭제'] },
  { category: '구조물 그리기', tools: ['사각기둥 그리기', '원 기둥 그리기'] },
  { category: '보조선 그리기', tools: ['보조선 그리기', '측정'] },
  { category: '도면 반전', tools: ['좌우 반전'] },
];


const DrawingPanel = ({
  activeTool,
  onToolClick,
  onUploadFloorPlan,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadStatus, setUploadStatus] = useState<
    | { type: 'idle' }
    | { type: 'loading'; filename: string }
    | {
        type: 'success';
        filename: string;
        parser?: 'vision' | 'opencv';
        wallCount?: number;
      }
    | { type: 'error'; message: string }
  >({ type: 'idle' });

  const handleToolButton = (tool: string) => {
    if (tool === FLOOR_PLAN_UPLOAD_TOOL) {
      fileInputRef.current?.click();
      return;
    }
    onToolClick(tool);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // 같은 파일 재선택 가능하도록
    if (!file || !onUploadFloorPlan) return;

    setUploadStatus({ type: 'loading', filename: file.name });
    try {
      const info = await onUploadFloorPlan(file);
      if (info && typeof info === 'object' && 'parser' in info) {
        setUploadStatus({
          type: 'success',
          filename: file.name,
          parser: info.parser,
          wallCount: info.wallCount,
        });
      } else {
        setUploadStatus({ type: 'success', filename: file.name });
      }
    } catch (err) {
      setUploadStatus({
        type: 'error',
        message: err instanceof Error ? err.message : '업로드 실패',
      });
    }
  };

  return (
    <aside
      className="
      col h-full w-[284px] shrink-0 overflow-hidden bg-gray-150 border-r border-gray-400 rounded-r-8
    "
    >
      {/* 패널 헤더 */}
      <div className="flex shrink-0 items-center justify-between px-16 py-16">
        <span className="body-s text-black">도면 그리기</span>
      </div>

      {/* 구분선 */}
      <div className="h-px w-full shrink-0 bg-gray-400" />

      {/* 숨겨진 파일 input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

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
                const isUploading =
                  tool === FLOOR_PLAN_UPLOAD_TOOL &&
                  uploadStatus.type === 'loading';
                return (
                  <button
                    key={tool}
                    onClick={() => handleToolButton(tool)}
                    disabled={isUploading}
                    className={[
                      'flex items-center px-12 py-12 border border-gray-400 rounded-8  transition-colors w-full text-left',
                      isUploading
                        ? 'bg-gray-200 text-gray-700 cursor-wait'
                        : 'cursor-pointer',
                      isActive
                        ? 'bg-functional-indigo text-white'
                        : !isUploading &&
                          'bg-gray-200 text-black hover:bg-gray-300',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <span className="label-l">
                      {isUploading ? '업로드 중…' : tool}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* 업로드 상태 메시지 */}
        {uploadStatus.type !== 'idle' && (
          <div className="px-12">
            {uploadStatus.type === 'loading' && (
              <p className="label-s text-gray-700">
                도면 인식 중… ({uploadStatus.filename})
              </p>
            )}
            {uploadStatus.type === 'success' && (
              <div className="col gap-2">
                <p className="label-s text-functional-indigo">
                  도면 적용 완료: {uploadStatus.filename}
                </p>
                {uploadStatus.parser !== undefined && (
                  <p className="label-s text-gray-700">
                    AI 인식:{' '}
                    {uploadStatus.parser === 'vision'
                      ? 'Gemini Vision'
                      : 'OpenCV (fallback)'}{' '}
                    · 벽 {uploadStatus.wallCount ?? 0}개
                  </p>
                )}
              </div>
            )}
            {uploadStatus.type === 'error' && (
              <p className="label-s text-red-500">
                업로드 실패: {uploadStatus.message}
              </p>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default DrawingPanel;
