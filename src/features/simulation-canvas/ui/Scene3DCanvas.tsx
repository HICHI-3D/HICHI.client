/**
 * Scene3DCanvas — 3D view of the floor-plan editor state.
 *
 * Coordinate mapping:
 *   2D (mm, x→right, y→down)  →  3D (x/1000, 0, y/1000)
 *   Vertical extrusion along three.js +y axis.
 *   1 three.js unit = 1 metre.
 */

/* eslint-disable react/no-unknown-property */
// react-three-fiber extends JSX with THREE-specific props (position, rotation,
// args, castShadow, receiveShadow, intensity, side, …) that eslint-plugin-react
// doesn't know about. This is the standard per-file disable for r3f components.

import { OrbitControls, useTexture } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { Suspense, useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

import type { BackgroundImage, Shape } from '../model/types';
import type { Editor } from '../model/useEditor';

// ─── Constants ──────────────────────────────────────────────────────────────

const WALL_HEIGHT = 2.4; // metres
const WALL_THICKNESS = 0.12; // metres

const COLOR_WALL = '#cfcfcf';
const COLOR_COLUMN = '#6a6a6a';
const COLOR_ROOM = '#e6e0f5';

// ─── Individual shape meshes ─────────────────────────────────────────────────

const WallMesh = ({
  shape,
}: {
  shape: Extract<Shape, { type: 'wall' }>;
}) => {
  const sx = shape.start.x / 1000;
  const sz = shape.start.y / 1000;
  const ex = shape.end.x / 1000;
  const ez = shape.end.y / 1000;

  const dx = ex - sx;
  const dz = ez - sz;
  const length = Math.hypot(dx, dz);

  const midX = (sx + ex) / 2;
  const midZ = (sz + ez) / 2;

  // angle around Y to align box long-side with the segment
  const angle = Math.atan2(dx, dz); // atan2(x,z) gives rotation around Y

  if (length < 0.001) return null;

  return (
    <mesh
      position={[midX, WALL_HEIGHT / 2, midZ]}
      rotation={[0, angle, 0]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[WALL_THICKNESS, WALL_HEIGHT, length]} />
      <meshStandardMaterial color={COLOR_WALL} />
    </mesh>
  );
};

const RectColumnMesh = ({
  shape,
}: {
  shape: Extract<Shape, { type: 'rect-column' }>;
}) => {
  const w = shape.w / 1000;
  const d = shape.h / 1000;
  const cx = shape.x / 1000 + w / 2;
  const cz = shape.y / 1000 + d / 2;

  return (
    <mesh position={[cx, WALL_HEIGHT / 2, cz]} castShadow receiveShadow>
      <boxGeometry args={[w, WALL_HEIGHT, d]} />
      <meshStandardMaterial color={COLOR_COLUMN} />
    </mesh>
  );
};

const CircleColumnMesh = ({
  shape,
}: {
  shape: Extract<Shape, { type: 'circle-column' }>;
}) => {
  const cx = shape.cx / 1000;
  const cz = shape.cy / 1000;
  const r = shape.r / 1000;

  return (
    <mesh position={[cx, WALL_HEIGHT / 2, cz]} castShadow receiveShadow>
      <cylinderGeometry args={[r, r, WALL_HEIGHT, 32]} />
      <meshStandardMaterial color={COLOR_COLUMN} />
    </mesh>
  );
};

const RoomMesh = ({
  shape,
}: {
  shape: Extract<Shape, { type: 'room' }>;
}) => {
  if (shape.points.length < 3) return null;

  // THREE.Shape lives in 2D (x,y). We map 2D (x→x, y_2D→z_3D).
  // Feed 2D points as (x/1000, y/1000) into THREE.Shape — the Shape's
  // local "y" axis will become 3D z after we rotate the mesh.
  const threeShape = new THREE.Shape(
    shape.points.map((p) => new THREE.Vector2(p.x / 1000, p.y / 1000)),
  );

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 0.02, // 2 cm extrusion (floor slab thickness)
    bevelEnabled: false,
  };

  return (
    // Rotate -π/2 around X so the extruded face points up (+Y in world).
    // The shape is centered at z=0 in local space; after rotation it sits
    // in the XZ plane. Shift slightly below y=0 so rooms sit under walls.
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.01, 0]}
      receiveShadow
    >
      <extrudeGeometry args={[threeShape, extrudeSettings]} />
      <meshStandardMaterial color={COLOR_ROOM} side={THREE.DoubleSide} />
    </mesh>
  );
};

// ─── Background floor (uploaded floor-plan image as a textured plane) ───────

const BackgroundFloor = ({ bg }: { bg: BackgroundImage }) => {
  const texture = useTexture(bg.url);
  const widthM = bg.widthMm / 1000;
  const depthM = bg.heightMm / 1000;
  // Position the plane so its top-left corner is at world (0, 0)
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[widthM / 2, -0.005, depthM / 2]}
      receiveShadow
    >
      <planeGeometry args={[widthM, depthM]} />
      <meshStandardMaterial
        map={texture}
        transparent
        opacity={bg.opacity}
      />
    </mesh>
  );
};

// ─── Auto-fit camera ──────────────────────────────────────────────────────────

type FitCameraProps = {
  shapes: Shape[];
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
};

const FitCamera = ({ shapes, controlsRef }: FitCameraProps) => {
  const { camera } = useThree();
  const fittedRef = useRef(false);

  useLayoutEffect(() => {
    // Only fit once when shapes first become non-empty
    if (fittedRef.current) return;

    const meaningful = shapes.filter(
      (s) => s.type !== 'aux-line' && s.type !== 'measurement',
    );
    if (meaningful.length === 0) return;

    fittedRef.current = true;

    // Compute 2D bounding box in 3D world coords (xz-plane)
    let minX = Infinity;
    let minZ = Infinity;
    let maxX = -Infinity;
    let maxZ = -Infinity;

    const expand = (x: number, z: number) => {
      if (x < minX) minX = x;
      if (z < minZ) minZ = z;
      if (x > maxX) maxX = x;
      if (z > maxZ) maxZ = z;
    };

    for (const s of meaningful) {
      if (s.type === 'wall') {
        expand(s.start.x / 1000, s.start.y / 1000);
        expand(s.end.x / 1000, s.end.y / 1000);
      } else if (s.type === 'room') {
        for (const p of s.points) expand(p.x / 1000, p.y / 1000);
      } else if (s.type === 'rect-column') {
        expand(s.x / 1000, s.y / 1000);
        expand((s.x + s.w) / 1000, (s.y + s.h) / 1000);
      } else if (s.type === 'circle-column') {
        expand((s.cx - s.r) / 1000, (s.cy - s.r) / 1000);
        expand((s.cx + s.r) / 1000, (s.cy + s.r) / 1000);
      }
    }

    const cx = (minX + maxX) / 2;
    const cz = (minZ + maxZ) / 2;
    const spanX = maxX - minX;
    const spanZ = maxZ - minZ;
    const span = Math.max(spanX, spanZ, 1); // at least 1m

    // Position camera at an isometric-ish angle above the centre
    const dist = span * 1.5 + WALL_HEIGHT;
    camera.position.set(cx + dist * 0.7, dist * 0.8, cz + dist * 0.7);
    camera.lookAt(cx, 0, cz);

    if (controlsRef.current) {
      controlsRef.current.target.set(cx, 0, cz);
      controlsRef.current.update();
    }
  }, [shapes, camera, controlsRef]);

  return null;
};

// ─── Scene (inner) ───────────────────────────────────────────────────────────

type SceneProps = {
  shapes: Shape[];
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  backgroundImage: BackgroundImage | null;
};

const Scene = ({ shapes, controlsRef, backgroundImage }: SceneProps) => {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[10, 12, 8]}
        intensity={0.9}
        castShadow
      />
      <directionalLight position={[-6, 4, -4]} intensity={0.25} />

      <gridHelper args={[40, 40, '#c9c6c1', '#e5e3df']} />

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.08}
      />

      {backgroundImage && (
        <Suspense fallback={null}>
          <BackgroundFloor bg={backgroundImage} />
        </Suspense>
      )}

      <FitCamera shapes={shapes} controlsRef={controlsRef} />

      {shapes.map((s) => {
        switch (s.type) {
          case 'wall':
            return <WallMesh key={s.id} shape={s} />;
          case 'rect-column':
            return <RectColumnMesh key={s.id} shape={s} />;
          case 'circle-column':
            return <CircleColumnMesh key={s.id} shape={s} />;
          case 'room':
            return <RoomMesh key={s.id} shape={s} />;
          case 'aux-line':
          case 'measurement':
            return null;
        }
      })}
    </>
  );
};

// ─── Public component ────────────────────────────────────────────────────────

type Props = { editor: Editor };

const Scene3DCanvas = ({ editor }: Props) => {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  return (
    <div className="block size-full" style={{ background: '#f7f5f1' }}>
      <Canvas
        camera={{ position: [8, 8, 8], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <Scene
          shapes={editor.shapes}
          controlsRef={controlsRef}
          backgroundImage={editor.backgroundImage}
        />
      </Canvas>
    </div>
  );
};

export default Scene3DCanvas;
