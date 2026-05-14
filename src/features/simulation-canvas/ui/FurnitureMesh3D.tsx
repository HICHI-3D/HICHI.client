/* eslint-disable react/no-unknown-property */
/**
 * 3D 캔버스에서 가구를 실물처럼 렌더하는 컴포넌트.
 * boxGeometry 대신 소파(쿠션+등받이), 테이블(상판+다리) 등 세부 구조.
 * 나중에 스캔 3D 모델(.glb)로 교체 예정.
 */

import type { FurnitureInstance } from '../model/types';

type Props = {
  furniture: FurnitureInstance;
};

const SofaMesh = ({ w, h, d }: { w: number; d: number; h: number }) => {
  const armW = w * 0.08;
  const backD = d * 0.2;
  const backH = h * 0.55;
  const seatH = h * 0.35;
  const legH = h * 0.1;
  const cushionCount = 3;
  const innerW = w - armW * 2;
  const cushionW = innerW / cushionCount;
  const gap = 0.005;

  return (
    <group>
      {/* 등받이 */}
      <mesh position={[0, legH + seatH + backH / 2, -d / 2 + backD / 2]} castShadow receiveShadow>
        <boxGeometry args={[w, backH, backD]} />
        <meshStandardMaterial color="#4f46e5" roughness={0.7} />
      </mesh>

      {/* 쿠션들 */}
      {Array.from({ length: cushionCount }).map((_, i) => (
        <mesh
          key={i}
          position={[
            -innerW / 2 + cushionW / 2 + i * cushionW,
            legH + seatH / 2,
            backD / 2 - d * 0.02,
          ]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[cushionW - gap, seatH, d - backD - gap * 2]} />
          <meshStandardMaterial color="#818cf8" roughness={0.6} />
        </mesh>
      ))}

      {/* 좌 팔걸이 */}
      <mesh position={[-w / 2 + armW / 2, legH + seatH * 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[armW, seatH * 1.4, d * 0.85]} />
        <meshStandardMaterial color="#4338ca" roughness={0.65} />
      </mesh>

      {/* 우 팔걸이 */}
      <mesh position={[w / 2 - armW / 2, legH + seatH * 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[armW, seatH * 1.4, d * 0.85]} />
        <meshStandardMaterial color="#4338ca" roughness={0.65} />
      </mesh>

      {/* 다리 */}
      {[
        [-w / 2 + armW * 0.7, 0, -d / 2 + d * 0.15],
        [w / 2 - armW * 0.7, 0, -d / 2 + d * 0.15],
        [-w / 2 + armW * 0.7, 0, d / 2 - d * 0.15],
        [w / 2 - armW * 0.7, 0, d / 2 - d * 0.15],
      ].map(([lx, _, lz], i) => (
        <mesh key={`leg${i}`} position={[lx, legH / 2, lz]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, legH, 8]} />
          <meshStandardMaterial color="#1e1b4b" roughness={0.5} metalness={0.3} />
        </mesh>
      ))}
    </group>
  );
};

const TableMesh = ({ w, h, d }: { w: number; d: number; h: number }) => {
  const topH = h * 0.08;
  const legH = h - topH;
  const legR = Math.min(w, d) * 0.03;
  const inset = Math.min(w, d) * 0.1;

  return (
    <group>
      {/* 상판 */}
      <mesh position={[0, legH + topH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, topH, d]} />
        <meshStandardMaterial color="#92400e" roughness={0.6} />
      </mesh>

      {/* 다리 */}
      {[
        [-w / 2 + inset, legH / 2, -d / 2 + inset],
        [w / 2 - inset, legH / 2, -d / 2 + inset],
        [-w / 2 + inset, legH / 2, d / 2 - inset],
        [w / 2 - inset, legH / 2, d / 2 - inset],
      ].map(([lx, ly, lz], i) => (
        <mesh key={`leg${i}`} position={[lx, ly, lz]} castShadow>
          <boxGeometry args={[legR * 2, legH, legR * 2]} />
          <meshStandardMaterial color="#78350f" roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
};

const ChairMesh = ({ w, h, d }: { w: number; d: number; h: number }) => {
  const seatH = h * 0.06;
  const legH = h * 0.45;
  const backH = h * 0.49;
  const legR = Math.min(w, d) * 0.025;
  const inset = Math.min(w, d) * 0.12;

  return (
    <group>
      {/* 등받이 */}
      <mesh position={[0, legH + seatH + backH / 2, -d / 2 + d * 0.08]} castShadow receiveShadow>
        <boxGeometry args={[w * 0.9, backH, d * 0.08]} />
        <meshStandardMaterial color="#475569" roughness={0.6} />
      </mesh>

      {/* 좌석 */}
      <mesh position={[0, legH + seatH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w * 0.95, seatH, d * 0.9]} />
        <meshStandardMaterial color="#64748b" roughness={0.55} />
      </mesh>

      {/* 다리 */}
      {[
        [-w / 2 + inset, legH / 2, -d / 2 + inset],
        [w / 2 - inset, legH / 2, -d / 2 + inset],
        [-w / 2 + inset, legH / 2, d / 2 - inset],
        [w / 2 - inset, legH / 2, d / 2 - inset],
      ].map(([lx, ly, lz], i) => (
        <mesh key={`leg${i}`} position={[lx, ly, lz]} castShadow>
          <cylinderGeometry args={[legR, legR, legH, 8]} />
          <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.4} />
        </mesh>
      ))}
    </group>
  );
};

const BedMesh = ({ w, h, d }: { w: number; d: number; h: number }) => {
  const frameH = h * 0.3;
  const mattressH = h * 0.35;
  const headboardH = h * 0.35;
  const pad = 0.02;

  return (
    <group>
      {/* 프레임 */}
      <mesh position={[0, frameH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, frameH, d]} />
        <meshStandardMaterial color="#b45309" roughness={0.6} />
      </mesh>

      {/* 매트리스 */}
      <mesh position={[0, frameH + mattressH / 2, pad]} castShadow receiveShadow>
        <boxGeometry args={[w - pad * 2, mattressH, d - pad * 2]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.8} />
      </mesh>

      {/* 헤드보드 */}
      <mesh position={[0, frameH + mattressH + headboardH / 2, -d / 2 + 0.03]} castShadow receiveShadow>
        <boxGeometry args={[w, headboardH, 0.06]} />
        <meshStandardMaterial color="#92400e" roughness={0.55} />
      </mesh>

      {/* 베개 */}
      {[-w * 0.22, w * 0.22].map((px, i) => (
        <mesh key={`pillow${i}`} position={[px, frameH + mattressH + 0.04, -d * 0.35]} castShadow>
          <boxGeometry args={[w * 0.3, 0.06, d * 0.15]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
};

const BookshelfMesh = ({ w, h, d }: { w: number; d: number; h: number }) => {
  const shelfCount = 4;
  const shelfThick = h * 0.03;
  const sideThick = w * 0.04;
  const gap = (h - shelfThick * (shelfCount + 1)) / shelfCount;

  return (
    <group>
      {/* 좌우 옆판 */}
      {[-1, 1].map((side) => (
        <mesh key={`side${side}`} position={[side * (w / 2 - sideThick / 2), h / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[sideThick, h, d]} />
          <meshStandardMaterial color="#78716c" roughness={0.6} />
        </mesh>
      ))}

      {/* 뒷판 */}
      <mesh position={[0, h / 2, -d / 2 + 0.01]} receiveShadow>
        <boxGeometry args={[w - sideThick * 2, h, 0.02]} />
        <meshStandardMaterial color="#57534e" roughness={0.7} />
      </mesh>

      {/* 선반들 */}
      {Array.from({ length: shelfCount + 1 }).map((_, i) => (
        <mesh key={`shelf${i}`} position={[0, shelfThick / 2 + i * (gap + shelfThick), 0]} receiveShadow>
          <boxGeometry args={[w - sideThick * 2, shelfThick, d]} />
          <meshStandardMaterial color="#a8a29e" roughness={0.6} />
        </mesh>
      ))}

      {/* 책 (첫 번째 칸) */}
      {['#ef4444', '#3b82f6', '#22c55e', '#f59e0b'].map((c, i) => (
        <mesh key={`book${i}`} position={[-w * 0.3 + i * w * 0.15, shelfThick + gap * 0.4, -d * 0.1]} castShadow>
          <boxGeometry args={[w * 0.08, gap * 0.7, d * 0.7]} />
          <meshStandardMaterial color={c} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
};

const TvStandMesh = ({ w, h, d }: { w: number; d: number; h: number }) => (
  <group>
    {/* 캐비닛 */}
    <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial color="#44403c" roughness={0.6} />
    </mesh>

    {/* 손잡이 */}
    {[-1, 1].map((s) => (
      <mesh key={`knob${s}`} position={[s * w * 0.15, h * 0.5, d / 2 + 0.008]}>
        <sphereGeometry args={[Math.min(w, d) * 0.03, 12, 12]} />
        <meshStandardMaterial color="#a8a29e" metalness={0.6} roughness={0.3} />
      </mesh>
    ))}
  </group>
);

/** 기본 박스 */
const DefaultMesh = ({ w, h, d, color }: { w: number; d: number; h: number; color: string }) => (
  <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
    <boxGeometry args={[w, h, d]} />
    <meshStandardMaterial color={color} />
  </mesh>
);

const meshRenderers: Record<string, React.FC<{ w: number; d: number; h: number }>> = {
  sofa: SofaMesh,
  table: TableMesh,
  chair: ChairMesh,
  bed: BedMesh,
  bookshelf: BookshelfMesh,
  'tv-stand': TvStandMesh,
};

const FurnitureMesh3D = ({ furniture }: Props) => {
  const w = furniture.width / 1000;
  const h = furniture.height / 1000;
  const d = furniture.depth / 1000;
  const Renderer = meshRenderers[furniture.type];

  return (
    <group
      position={[furniture.position.x / 1000, 0, furniture.position.y / 1000]}
      rotation={[0, -(furniture.rotation * Math.PI) / 180, 0]}
    >
      {Renderer ? (
        <Renderer w={w} d={d} h={h} />
      ) : (
        <DefaultMesh w={w} d={d} h={h} color={furniture.color} />
      )}
    </group>
  );
};

export default FurnitureMesh3D;
