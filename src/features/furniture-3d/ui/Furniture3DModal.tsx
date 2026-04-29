/**
 * 가구 3D 미리보기 모달.
 */

import type { FurnitureRecord } from '@entities/furniture';
import { resolveModelUrl } from '@shared/api';

import Furniture3DViewer from './Furniture3DViewer';

type Props = {
  furniture: FurnitureRecord | null;
  onClose: () => void;
};

const Furniture3DModal = ({ furniture, onClose }: Props) => {
  if (!furniture) return null;

  const modelUrl = furniture.model_url
    ? resolveModelUrl(furniture.model_url)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex-center bg-black/50 p-16">
      <div className="col w-full max-w-[860px] max-h-[90vh] overflow-hidden rounded-16 bg-white">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-20 py-16 border-b border-gray-300">
          <div className="col">
            <span className="body-l text-black">{furniture.name}</span>
            {furniture.category && (
              <span className="label-s text-gray-700">
                {furniture.category}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="
              flex-center size-32 cursor-pointer rounded-8 text-gray-700
              hover:bg-gray-200
            "
          >
            ✕
          </button>
        </div>

        {/* 3D 뷰어 */}
        <div className="flex-1 min-h-[400px]">
          {modelUrl ? (
            <Furniture3DViewer modelUrl={modelUrl} />
          ) : (
            <div className="flex-center size-full">
              <p className="label-l text-gray-700">
                3D 모델이 준비되지 않았어요
              </p>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="flex items-center justify-end gap-12 px-20 py-12 border-t border-gray-300">
          <button
            type="button"
            onClick={onClose}
            className="
              px-16 py-10 rounded-8 label-l text-gray-700 bg-gray-200
              cursor-pointer hover:bg-gray-300
            "
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Furniture3DModal;
