/**
 * 웹캠으로 사진을 캡처하는 컴포넌트.
 * MediaDevices API + Canvas blob 추출.
 */

import { useEffect, useRef, useState } from 'react';

type Props = {
  onCapture: (file: File) => void;
};

const WebcamCapture = ({ onCapture }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [streaming, setStreaming] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;

    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
          setStreaming(true);
        }
      } catch (e) {
        setError(
          e instanceof Error
            ? `카메라 접근 실패: ${e.message}`
            : '카메라 접근 실패',
        );
      }
    };

    void start();

    return () => {
      cancelled = true;
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const filename = `webcam_${Date.now()}.jpg`;
        const file = new File([blob], filename, { type: 'image/jpeg' });
        onCapture(file);
      },
      'image/jpeg',
      0.9,
    );
  };

  if (error) {
    return (
      <div className="col gap-8 p-16">
        <p className="label-m text-red-500">{error}</p>
        <p className="label-s text-gray-700">
          파일 업로드 탭을 사용해주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="col gap-12 p-12">
      <video
        ref={videoRef}
        playsInline
        muted
        className="w-full rounded-12 bg-black"
        style={{ aspectRatio: '4/3', objectFit: 'cover' }}
      />
      <button
        type="button"
        disabled={!streaming}
        onClick={handleCapture}
        className={[
          'flex-center w-full py-12 rounded-12 label-l transition-colors',
          streaming
            ? 'bg-functional-indigo text-white cursor-pointer hover:opacity-80'
            : 'bg-gray-200 text-gray-700 cursor-wait',
        ].join(' ')}
      >
        {streaming ? '사진 찍기' : '카메라 준비 중…'}
      </button>
    </div>
  );
};

export default WebcamCapture;
