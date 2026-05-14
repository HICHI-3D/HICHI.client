/**
 * 가구 패널 썸네일 — 각 가구 타입별로 실물과 유사한 SVG 일러스트레이션.
 * 나중에 스캔 3D 모델이 들어오면 WebGL 미리보기로 교체 가능.
 */

type Props = {
  type: string;
  size?: number;
};

const SofaThumbnail = ({ s }: { s: number }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
    {/* 쿠션 백 */}
    <rect x="10" y="18" width="80" height="18" rx="6" fill="#6366f1" />
    {/* 좌석 */}
    <rect x="10" y="34" width="80" height="36" rx="6" fill="#818cf8" />
    {/* 쿠션 분리선 */}
    <line x1="36" y1="38" x2="36" y2="66" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="64" y1="38" x2="64" y2="66" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
    {/* 팔걸이 */}
    <rect x="6" y="28" width="10" height="44" rx="5" fill="#4f46e5" />
    <rect x="84" y="28" width="10" height="44" rx="5" fill="#4f46e5" />
    {/* 다리 */}
    <circle cx="18" cy="78" r="3.5" fill="#3730a3" />
    <circle cx="82" cy="78" r="3.5" fill="#3730a3" />
    {/* 베개 */}
    <ellipse cx="28" cy="30" rx="8" ry="5" fill="#a5b4fc" opacity="0.7" />
    <ellipse cx="72" cy="30" rx="8" ry="5" fill="#a5b4fc" opacity="0.7" />
  </svg>
);

const TableThumbnail = ({ s }: { s: number }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
    {/* 테이블 상판 그림자 */}
    <rect x="14" y="32" width="72" height="38" rx="4" fill="#78350f" opacity="0.3" />
    {/* 테이블 상판 */}
    <rect x="12" y="28" width="76" height="38" rx="5" fill="#92400e" />
    {/* 나무결 */}
    <line x1="20" y1="36" x2="84" y2="36" stroke="#a16207" strokeWidth="0.8" opacity="0.4" />
    <line x1="16" y1="44" x2="86" y2="44" stroke="#a16207" strokeWidth="0.8" opacity="0.3" />
    <line x1="18" y1="52" x2="82" y2="52" stroke="#a16207" strokeWidth="0.8" opacity="0.4" />
    <line x1="16" y1="60" x2="86" y2="60" stroke="#a16207" strokeWidth="0.8" opacity="0.3" />
    {/* 다리 */}
    <rect x="18" y="66" width="6" height="16" rx="2" fill="#78350f" />
    <rect x="76" y="66" width="6" height="16" rx="2" fill="#78350f" />
    <rect x="18" y="20" width="6" height="10" rx="2" fill="#78350f" />
    <rect x="76" y="20" width="6" height="10" rx="2" fill="#78350f" />
  </svg>
);

const ChairThumbnail = ({ s }: { s: number }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
    {/* 등받이 */}
    <rect x="25" y="12" width="50" height="30" rx="8" fill="#64748b" />
    <rect x="30" y="16" width="40" height="22" rx="5" fill="#94a3b8" opacity="0.5" />
    {/* 좌석 */}
    <rect x="22" y="42" width="56" height="22" rx="6" fill="#475569" />
    {/* 앞 다리 */}
    <rect x="26" y="64" width="5" height="22" rx="2" fill="#334155" />
    <rect x="69" y="64" width="5" height="22" rx="2" fill="#334155" />
    {/* 뒷 다리 */}
    <rect x="30" y="40" width="4" height="6" rx="1" fill="#334155" />
    <rect x="66" y="40" width="4" height="6" rx="1" fill="#334155" />
  </svg>
);

const BedThumbnail = ({ s }: { s: number }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
    {/* 프레임 */}
    <rect x="8" y="20" width="84" height="60" rx="6" fill="#b45309" />
    {/* 매트리스 */}
    <rect x="12" y="28" width="76" height="48" rx="4" fill="#fef3c7" />
    {/* 시트 */}
    <rect x="14" y="30" width="72" height="44" rx="3" fill="#fde68a" />
    {/* 이불 접힌 부분 */}
    <path d="M14 48 Q50 42 86 48 L86 74 Q50 68 14 74 Z" fill="#fbbf24" opacity="0.5" />
    {/* 베개 */}
    <ellipse cx="32" cy="36" rx="14" ry="6" fill="#fff" opacity="0.9" />
    <ellipse cx="68" cy="36" rx="14" ry="6" fill="#fff" opacity="0.9" />
    {/* 헤드보드 */}
    <rect x="8" y="14" width="84" height="12" rx="4" fill="#92400e" />
  </svg>
);

const BookshelfThumbnail = ({ s }: { s: number }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
    {/* 프레임 */}
    <rect x="15" y="10" width="70" height="80" rx="3" fill="#78716c" />
    {/* 선반칸 */}
    <rect x="19" y="14" width="62" height="16" rx="2" fill="#a8a29e" />
    <rect x="19" y="34" width="62" height="16" rx="2" fill="#a8a29e" />
    <rect x="19" y="54" width="62" height="16" rx="2" fill="#a8a29e" />
    <rect x="19" y="74" width="62" height="12" rx="2" fill="#a8a29e" />
    {/* 책들 */}
    <rect x="22" y="16" width="6" height="12" rx="1" fill="#ef4444" />
    <rect x="29" y="18" width="5" height="10" rx="1" fill="#3b82f6" />
    <rect x="35" y="15" width="7" height="13" rx="1" fill="#22c55e" />
    <rect x="43" y="17" width="4" height="11" rx="1" fill="#f59e0b" />
    <rect x="22" y="36" width="8" height="12" rx="1" fill="#8b5cf6" />
    <rect x="31" y="38" width="5" height="10" rx="1" fill="#ec4899" />
    <rect x="37" y="35" width="6" height="13" rx="1" fill="#14b8a6" />
    <rect x="22" y="56" width="7" height="12" rx="1" fill="#f97316" />
    <rect x="30" y="58" width="5" height="10" rx="1" fill="#6366f1" />
  </svg>
);

const TvStandThumbnail = ({ s }: { s: number }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
    {/* 캐비닛 */}
    <rect x="10" y="38" width="80" height="36" rx="4" fill="#44403c" />
    {/* 문 분리 */}
    <line x1="50" y1="42" x2="50" y2="70" stroke="#57534e" strokeWidth="1.5" />
    {/* 손잡이 */}
    <circle cx="44" cy="56" r="2" fill="#a8a29e" />
    <circle cx="56" cy="56" r="2" fill="#a8a29e" />
    {/* TV */}
    <rect x="16" y="10" width="68" height="26" rx="3" fill="#1c1917" />
    <rect x="19" y="13" width="62" height="20" rx="2" fill="#292524" />
    {/* 화면 반사 */}
    <rect x="22" y="16" width="56" height="14" rx="1" fill="#3f3f46" opacity="0.3" />
    {/* 다리 */}
    <rect x="18" y="74" width="6" height="12" rx="2" fill="#292524" />
    <rect x="76" y="74" width="6" height="12" rx="2" fill="#292524" />
  </svg>
);

const thumbnailMap: Record<string, React.FC<{ s: number }>> = {
  sofa: SofaThumbnail,
  table: TableThumbnail,
  chair: ChairThumbnail,
  bed: BedThumbnail,
  bookshelf: BookshelfThumbnail,
  'tv-stand': TvStandThumbnail,
};

const FurnitureThumbnail = ({ type, size = 108 }: Props) => {
  const Component = thumbnailMap[type];
  if (!Component) {
    return (
      <div
        className="flex-center size-full rounded-8 bg-gray-100"
        style={{ width: size, height: size }}
      >
        <span className="label-s text-gray-500">?</span>
      </div>
    );
  }
  return <Component s={size} />;
};

export default FurnitureThumbnail;
