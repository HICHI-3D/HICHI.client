/**
 * 가구 스캔 모달.
 *
 * 단계:
 *   1) 사진 수집 (파일 업로드 or 웹캠)
 *   2) 이름/카테고리 입력 후 시작
 *   3) 진행 상태 폴링 → 완료
 */

import type { FurnitureRecord } from '@entities/furniture';
import { scanFurniture } from '@shared/api';
import { useEffect, useRef, useState } from 'react';

import { useScanProgress } from '../model/useScanProgress';
import WebcamCapture from './WebcamCapture';

type Props = {
  open: boolean;
  onClose: () => void;
  onCompleted?: (record: FurnitureRecord) => void;
};

type Tab = 'upload' | 'webcam';

const MIN_PHOTOS = 5;
const RECOMMENDED_PHOTOS = 20;

const FurnitureScanModal = ({ open, onClose, onCompleted }: Props) => {
  const [tab, setTab] = useState<Tab>('upload');
  const [files, setFiles] = useState<File[]>([]);
  const [name, setName] = useState('새 가구');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [furnitureId, setFurnitureId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const progress = useScanProgress(furnitureId);

  useEffect(() => {
    if (progress.phase === 'completed' && onCompleted) {
      onCompleted(progress.record);
    }
  }, [progress, onCompleted]);

  // 모달 닫히면 상태 리셋
  useEffect(() => {
    if (!open) {
      setFiles([]);
      setName('새 가구');
      setSubmitError(null);
      setFurnitureId(null);
      setTab('upload');
    }
  }, [open]);

  if (!open) return null;

  const previews = files.map((f, i) => ({
    key: `${i}-${f.name}-${f.size}`,
    url: URL.createObjectURL(f),
    name: f.name,
  }));

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    e.target.value = '';
    if (!list) return;
    setFiles((prev) => [...prev, ...Array.from(list)]);
  };

  const handleWebcamCapture = (file: File) => {
    setFiles((prev) => [...prev, file]);
  };

  const handleRemove = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleStart = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const record = await scanFurniture(files, { name });
      setFurnitureId(record.id);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : '시작 실패');
    } finally {
      setSubmitting(false);
    }
  };

  const showProgressView =
    progress.phase === 'polling' ||
    progress.phase === 'completed' ||
    progress.phase === 'failed';
  const currentRecord = showProgressView ? progress.record : null;

  return (
    <div className="fixed inset-0 z-50 flex-center bg-black/50 p-16">
      <div className="col w-full max-w-[720px] max-h-[90vh] overflow-hidden rounded-16 bg-white">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-20 py-16 border-b border-gray-300">
          <span className="body-l text-black">가구 스캔</span>
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

        {/* 본문 */}
        <div className="flex-1 overflow-y-auto">
          {!showProgressView && (
            <>
              {/* 탭 */}
              <div className="flex border-b border-gray-300">
                {(['upload', 'webcam'] as const).map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setTab(t)}
                    className={[
                      'flex-1 py-12 label-l cursor-pointer',
                      tab === t
                        ? 'text-functional-indigo border-b-2 border-functional-indigo'
                        : 'text-gray-700',
                    ].join(' ')}
                  >
                    {t === 'upload' ? '파일 업로드' : '웹캠 촬영'}
                  </button>
                ))}
              </div>

              {/* 입력 */}
              {tab === 'upload' ? (
                <div className="p-16">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="
                      flex-center w-full py-32 rounded-12 border-2 border-dashed
                      border-gray-400 bg-gray-100 label-l text-gray-700 cursor-pointer
                      hover:bg-gray-200
                    "
                  >
                    + 사진 추가
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleAddFiles}
                  />
                </div>
              ) : (
                <WebcamCapture onCapture={handleWebcamCapture} />
              )}

              {/* 미리보기 */}
              {previews.length > 0 && (
                <div className="p-16">
                  <div className="grid grid-cols-4 gap-8">
                    {previews.map((p, i) => (
                      <div key={p.key} className="relative aspect-square">
                        <img
                          src={p.url}
                          alt={p.name}
                          className="size-full object-cover rounded-8"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemove(i)}
                          className="
                            absolute top-4 right-4 size-20 rounded-full
                            bg-black/60 text-white text-[10px] cursor-pointer
                          "
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 카운터 + 권장 안내 */}
              <div className="px-16 pb-12">
                <p className="label-s text-gray-700">
                  현재 {files.length}장 (최소 {MIN_PHOTOS}, 권장 {RECOMMENDED_PHOTOS}장 이상,
                  여러 각도에서 촬영)
                </p>
              </div>

              {/* 가구명 */}
              <div className="px-16 pb-16">
                <label className="col gap-6">
                  <span className="label-m text-black">가구명</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="
                      rounded-8 bg-gray-100 px-12 py-10 label-l
                      outline-none focus:bg-gray-200
                    "
                  />
                </label>
              </div>

              {submitError && (
                <p className="px-16 pb-12 label-s text-red-500">
                  {submitError}
                </p>
              )}
            </>
          )}

          {showProgressView && currentRecord && (
            <div className="col gap-12 p-24">
              <p className="body-l text-black">{currentRecord.name}</p>
              <p className="label-m text-gray-700">
                상태: {currentRecord.scan_status}
                {currentRecord.scan_stage
                  ? ` (${currentRecord.scan_stage})`
                  : ''}
              </p>
              <div className="h-8 w-full rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-functional-indigo transition-all"
                  style={{
                    width: `${(currentRecord.scan_progress * 100).toFixed(1)}%`,
                  }}
                />
              </div>
              <p className="label-s text-gray-700">
                {(currentRecord.scan_progress * 100).toFixed(1)}%
              </p>
              {progress.phase === 'completed' && (
                <p className="label-m text-functional-indigo">
                  스캔 완료! 가구 리스트에 추가되었어요.
                </p>
              )}
              {progress.phase === 'failed' && (
                <p className="label-m text-red-500">
                  실패: {currentRecord.error ?? '알 수 없는 오류'}
                </p>
              )}
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
            {progress.phase === 'completed' ? '닫기' : '취소'}
          </button>
          {!showProgressView && (
            <button
              type="button"
              disabled={files.length < MIN_PHOTOS || submitting}
              onClick={handleStart}
              className={[
                'px-16 py-10 rounded-8 label-l',
                files.length < MIN_PHOTOS || submitting
                  ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                  : 'bg-functional-indigo text-white cursor-pointer hover:opacity-80',
              ].join(' ')}
            >
              {submitting ? '시작 중…' : '스캔 시작'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FurnitureScanModal;
