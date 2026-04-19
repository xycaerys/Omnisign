'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface AvatarFrame {
  bone: string;
  rotation?: number[];
  position?: number[];
  time: number;
}

interface AvatarProps {
  avatarData: {
    tokens: string[];
    animation: AvatarFrame[];
    expressions: { raised_eyebrows: boolean; headshake: boolean };
  } | null;
}

type AnimFrame = [string, 'rotation' | 'position', 'x' | 'y' | 'z', number, '+' | '-'];

const BONE_MAP: Record<string, string> = {
  right_upper_arm: 'mixamorigRightArm',
  left_upper_arm: 'mixamorigLeftArm',
  right_forearm: 'mixamorigRightForeArm',
  left_forearm: 'mixamorigLeftForeArm',
  right_hand: 'mixamorigRightHand',
  left_hand: 'mixamorigLeftHand',
  head: 'mixamorigHead',
};

const DEFAULT_ROTATIONS: Array<[string, 'x' | 'y' | 'z', number]> = [
  ['mixamorigLeftShoulder', 'z', -Math.PI / 8],
  ['mixamorigRightShoulder', 'z', Math.PI / 8],
  ['mixamorigNeck', 'x', Math.PI / 12],
  
  // Upper Arms slightly forward and down
  ['mixamorigLeftArm', 'x', -0.5],
  ['mixamorigLeftArm', 'z', -1.2],
  ['mixamorigRightArm', 'x', -0.5],
  ['mixamorigRightArm', 'z', 1.2],
  
  // Forearms bent UP/FORWARD 90 degrees (1.5 radians)
  ['mixamorigLeftForeArm', 'x', 1.5],
  ['mixamorigRightForeArm', 'x', 1.5],
  
  // Relax the hands gently
  ['mixamorigRightHand', 'x', -0.2],
  ['mixamorigLeftHand', 'x', -0.2],
  
  // Curl fingers naturally inward using X axis
  ['mixamorigRightHandIndex1', 'x', 0.4],
  ['mixamorigRightHandMiddle1', 'x', 0.4],
  ['mixamorigRightHandRing1', 'x', 0.4],
  ['mixamorigRightHandPinky1', 'x', 0.4],
  ['mixamorigRightHandThumb1', 'x', 0.2],
  ['mixamorigLeftHandIndex1', 'x', 0.4],
  ['mixamorigLeftHandMiddle1', 'x', 0.4],
  ['mixamorigLeftHandRing1', 'x', 0.4],
  ['mixamorigLeftHandPinky1', 'x', 0.4],
  ['mixamorigLeftHandThumb1', 'x', 0.2],
];

const DEFAULT_ROTATION_TARGETS = DEFAULT_ROTATIONS.reduce<Record<string, number>>(
  (targets, [boneName, axis, value]) => {
    targets[`${boneName}:${axis}`] = value;
    return targets;
  },
  {},
);

function applyDefaultPose(ref: any) {
  const animations: AnimFrame[] = [];

  DEFAULT_ROTATIONS.forEach(([boneName, axis, target]) => {
    const bone = ref.avatar?.getObjectByName(boneName);
    const current = bone?.rotation?.[axis] ?? 0;
    animations.push([boneName, 'rotation', axis, target, target > current ? '+' : '-']);
  });

  ref.animations.push(animations);
  if (ref.pending === false) {
    ref.pending = true;
    ref.animate();
  }
}

export default function SignAvatar({ avatarData }: AvatarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const componentRef = useRef<any>({});
  const [activeWord, setActiveWord] = useState('READY');
  const [isLoaded, setIsLoaded] = useState(false);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const ref = componentRef.current;
    ref.flag = false;
    ref.pending = false;
    ref.animations = [];
    ref.initialPositions = new Map<string, THREE.Vector3>();

    ref.scene = new THREE.Scene();
    ref.scene.background = new THREE.Color(0x0c0a1a);

    const ambient = new THREE.AmbientLight(0xffffff, 1.5);
    ref.scene.add(ambient);

    const spot = new THREE.SpotLight(0xffffff, 3);
    spot.position.set(0, 5, 5);
    ref.scene.add(spot);

    const frontFill = new THREE.DirectionalLight(0xffffff, 2);
    frontFill.position.set(0, 2, 4);
    ref.scene.add(frontFill);

    const rim = new THREE.PointLight(0x8b5cf6, 2, 10);
    rim.position.set(-3, 3, -2);
    ref.scene.add(rim);

    ref.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    ref.renderer.setPixelRatio(window.devicePixelRatio);

    ref.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000);
    ref.camera.position.z = 2.4;
    ref.camera.position.y = 1.3;

    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 400;
    ref.renderer.setSize(width, height);
    ref.camera.aspect = width / height;
    ref.camera.updateProjectionMatrix();

    container.innerHTML = '';
    container.appendChild(ref.renderer.domElement);
    ref.speed = 0.06;

    const loader = new GLTFLoader();
    loader.load(
      '/ybot.glb',
      (gltf) => {
        gltf.scene.traverse((child: any) => {
          if (child.isBone) {
            ref.initialPositions.set(child.name, child.position.clone());
          }

          if (child.type === 'SkinnedMesh') {
            child.frustumCulled = false;
            child.material = new THREE.MeshStandardMaterial({
              color: 0x6366f1,
              metalness: 0.3,
              roughness: 0.5,
            });
          }
        });

        ref.avatar = gltf.scene;
        ref.scene.add(ref.avatar);
        window.avatarRef = ref; // EXPOSED FOR DEBUGGING
        applyDefaultPose(ref);
        setIsLoaded(true);
      },
      undefined,
      (error) => {
        console.error('GLB load error:', error);
      },
    );

    ref.animate = () => {
      if (ref.animations.length === 0) {
        ref.pending = false;
        setActiveWord('READY');
        return;
      }

      requestAnimationFrame(ref.animate);

      if (ref.animations[0].length) {
        if (!ref.flag) {
          for (let i = 0; i < ref.animations[0].length; ) {
            const [boneName, action, axis, limit, sign] = ref.animations[0][i] as AnimFrame;
            const boneObj = ref.avatar.getObjectByName(boneName);

            if (!boneObj) {
              ref.animations[0].splice(i, 1);
              continue;
            }

            const current = boneObj[action][axis];
            const step = action === 'position' ? ref.speed * 0.35 : ref.speed;

            if (sign === '+' && current < limit) {
              boneObj[action][axis] += step;
              boneObj[action][axis] = Math.min(boneObj[action][axis], limit);
              i++;
            } else if (sign === '-' && current > limit) {
              boneObj[action][axis] -= step;
              boneObj[action][axis] = Math.max(boneObj[action][axis], limit);
              i++;
            } else {
              ref.animations[0].splice(i, 1);
            }
          }
        }
      } else {
        ref.flag = true;
        window.setTimeout(() => {
          ref.flag = false;
        }, 320);
        ref.animations.shift();
      }

      ref.renderer.render(ref.scene, ref.camera);
    };

    const idleRender = () => {
      if (!ref.pending && ref.renderer && ref.scene && ref.camera) {
        ref.renderer.render(ref.scene, ref.camera);
      }
      requestAnimationFrame(idleRender);
    };
    idleRender();

    const handleResize = () => {
      if (!container || !ref.renderer || !ref.camera) return;
      const nextWidth = container.clientWidth;
      const nextHeight = container.clientHeight || 400;
      ref.renderer.setSize(nextWidth, nextHeight);
      ref.camera.aspect = nextWidth / nextHeight;
      ref.camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ref.renderer?.dispose?.();
    };
  }, []);

  useEffect(() => {
    const ref = componentRef.current;
    if (!isLoaded || !ref.avatar || !avatarData?.animation?.length) return;

    setActiveWord(avatarData.tokens?.join(' ') || 'SIGNING...');
    ref.animations = [];

    const addMove = (
      moves: AnimFrame[],
      boneName: string,
      action: 'rotation' | 'position',
      axis: 'x' | 'y' | 'z',
      target: number,
    ) => {
      const boneObj = ref.avatar.getObjectByName(boneName);
      if (!boneObj || Number.isNaN(target)) return;

      const current = boneObj[action][axis];
      if (Math.abs(target - current) > 0.01) {
        moves.push([boneName, action, axis, target, target > current ? '+' : '-']);
      }
    };

    const groupedFrames = [...avatarData.animation]
      .sort((a, b) => Number(a.time || 0) - Number(b.time || 0))
      .reduce<Map<string, AvatarFrame[]>>((groups, frame) => {
        const time = Number(frame.time || 0).toFixed(2);
        if (!groups.has(time)) groups.set(time, []);
        groups.get(time)?.push(frame);
        return groups;
      }, new Map());

    groupedFrames.forEach((group) => {
      const moves: AnimFrame[] = [];

      group.forEach((frame) => {
        const boneName = BONE_MAP[frame.bone] || frame.bone;
        const boneObj = ref.avatar.getObjectByName(boneName);
        if (!boneObj) return;

        if (frame.rotation) {
          (['x', 'y', 'z'] as const).forEach((axis, idx) => {
            const target = Number(frame.rotation?.[idx] ?? 0);
            addMove(moves, boneName, 'rotation', axis, target);
          });
        }

        if (frame.position && frame.bone.endsWith('_hand')) {
          const basePosition = ref.initialPositions.get(boneName) || new THREE.Vector3();
          const positionScale = 0.42;
          (['x', 'y', 'z'] as const).forEach((axis, idx) => {
            const offset = Number(frame.position?.[idx] || 0) * positionScale;
            addMove(moves, boneName, 'position', axis, basePosition[axis] + offset);
          });
        }
      });

      if (moves.length > 0) {
        ref.animations.push(moves);
      }
    });

    const touchedBones = new Set<string>(
      avatarData.animation.map((frame) => BONE_MAP[frame.bone] || frame.bone),
    );
    DEFAULT_ROTATIONS.forEach(([boneName]) => touchedBones.add(boneName));

    const reset: AnimFrame[] = [];
    touchedBones.forEach((boneName) => {
      const boneObj = ref.avatar.getObjectByName(boneName);
      if (!boneObj) return;

      (['x', 'y', 'z'] as const).forEach((axis) => {
        const target = DEFAULT_ROTATION_TARGETS[`${boneName}:${axis}`] ?? 0;
        addMove(reset, boneName, 'rotation', axis, target);
      });

      if (boneName.includes('Hand')) {
        const basePosition = ref.initialPositions.get(boneName);
        if (basePosition) {
          (['x', 'y', 'z'] as const).forEach((axis) => {
            addMove(reset, boneName, 'position', axis, basePosition[axis]);
          });
        }
      }
    });

    if (reset.length > 0) {
      ref.animations.push(reset);
    }

    if (ref.pending === false) {
      ref.pending = true;
      ref.animate();
    }
  }, [avatarData, isLoaded]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full overflow-hidden rounded-[22px]" />
      <div
        className={`absolute bottom-3 left-4 text-xs font-bold uppercase tracking-[2px] ${
          activeWord === 'READY' ? 'text-white/40' : 'text-emerald-400'
        }`}
        style={{
          textShadow: activeWord !== 'READY' ? '0 0 10px rgba(16,185,129,0.5)' : 'none',
        }}
      >
        {!isLoaded ? 'LOADING MODEL...' : activeWord}
      </div>
    </div>
  );
}
