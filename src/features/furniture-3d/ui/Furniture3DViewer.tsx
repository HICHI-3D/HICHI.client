/**
 * .glb 모델을 react-three-fiber로 렌더하는 뷰어.
 * - OrbitControls로 회전/줌
 * - 로딩 중 placeholder
 * - 모델은 카메라에 맞춰 자동 정렬
 */

import { OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

type Props = {
  /** 절대 URL 또는 상대 URL */
  modelUrl: string;
  className?: string;
};

const Model = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url);
  const ref = useRef<THREE.Group>(null);

  // 매 url마다 메쉬를 복사 (drei가 캐시하므로 동일 url 재사용 시 중복 회피)
  const cloned = useMemo(() => scene.clone(true), [scene]);

  // 모델을 원점 + 단위크기로 정규화 (Bounding box 기준)
  useLayoutEffect(() => {
    const group = ref.current;
    if (!group) return;
    const box = new THREE.Box3().setFromObject(group);
    if (box.isEmpty()) return;
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = 2 / maxDim;
    group.scale.setScalar(scale);
    group.position.sub(center.multiplyScalar(scale));
  }, [cloned]);

  return (
    <group ref={ref}>
      <primitive object={cloned} />
    </group>
  );
};

const Furniture3DViewer = ({ modelUrl, className }: Props) => {
  return (
    <div
      className={['w-full h-full bg-gray-100 rounded-12', className]
        .filter(Boolean)
        .join(' ')}
    >
      <Canvas
        camera={{ position: [2.5, 2, 2.5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 4]} intensity={0.8} castShadow />
        <directionalLight position={[-3, 2, -3]} intensity={0.3} />
        <Suspense fallback={null}>
          <Model url={modelUrl} />
        </Suspense>
        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          minDistance={0.5}
          maxDistance={10}
        />
        <gridHelper args={[10, 20, '#bbb', '#ddd']} />
      </Canvas>
    </div>
  );
};

export default Furniture3DViewer;
