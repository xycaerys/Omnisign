import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { defaultPose } from '../animations/defaultPose';

const BONE_MAPPING = {
  right_upper_arm: 'mixamorigRightArm',
  right_forearm: 'mixamorigRightForeArm',
  right_hand: 'mixamorigRightHand',
  left_upper_arm: 'mixamorigLeftArm',
  left_forearm: 'mixamorigLeftForeArm',
  left_hand: 'mixamorigLeftHand',
  head: 'mixamorigHead'
};

const AVATAR_MODEL_URL = '/drive-ybot.glb';

const DEFAULT_ROTATIONS = [
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

const DEFAULT_ROTATION_TARGETS = DEFAULT_ROTATIONS.reduce((targets, [boneName, axis, value]) => {
  targets[`${boneName}:${axis}`] = value;
  return targets;
}, {});

const Avatar = ({ avatarData }) => {
  const containerRef = useRef(null);
  const componentRef = useRef({});
  const [activeWord, setActiveWord] = useState("READY");
  const [isLoaded, setIsLoaded] = useState(false);
  const initRef = useRef(false);

  // Initialize Three.js scene
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const ref = componentRef.current;
    ref.flag = false;
    ref.pending = false;
    ref.animations = [];
    ref.characters = [];
    ref.initialPositions = new Map();

    // Scene — light background for high contrast
    ref.scene = new THREE.Scene();
    ref.scene.background = new THREE.Color(0xe8eaed);

    // Lighting — bright and even
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    ref.scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 3);
    spotLight.position.set(0, 5, 5);
    ref.scene.add(spotLight);

    const frontFill = new THREE.DirectionalLight(0xffffff, 2);
    frontFill.position.set(0, 2, 4);
    ref.scene.add(frontFill);

    const rimLight = new THREE.PointLight(0x93c5fd, 1.5, 10);
    rimLight.position.set(-3, 3, -2);
    ref.scene.add(rimLight);

    // Renderer
    ref.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    ref.renderer.setPixelRatio(window.devicePixelRatio);

    // Camera
    ref.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000);
    ref.camera.position.z = 2.4;
    ref.camera.position.y = 1.3;

    const container = containerRef.current;
    if (!container) return;

    const w = container.clientWidth;
    const h = container.clientHeight || 400;
    ref.renderer.setSize(w, h);
    ref.camera.aspect = w / h;
    ref.camera.updateProjectionMatrix();

    container.innerHTML = "";
    container.appendChild(ref.renderer.domElement);

    // Animation speed
    ref.speed = 0.06;

    // Load the avatar model copied from drive-download/public/ybot.glb.
    const loader = new GLTFLoader();
    loader.load(
      AVATAR_MODEL_URL,
      (gltf) => {
        console.info(`Loaded avatar model: ${AVATAR_MODEL_URL}`);
        gltf.scene.traverse((child) => {
          if (child.type === 'SkinnedMesh') {
            child.frustumCulled = false;
            // Override material to a vivid color for visibility
            child.material = new THREE.MeshStandardMaterial({
              color: 0x1d4ed8,      // vibrant blue body
              metalness: 0.3,
              roughness: 0.5,
            });
          }
        });
        ref.avatar = gltf.scene;
        ref.scene.add(ref.avatar);

        ref.avatar.traverse((child) => {
          if (child.isBone) {
            ref.initialPositions.set(child.name, child.position.clone());
          }
        });

        defaultPose(ref);
        setIsLoaded(true);
      },
      undefined,
      (error) => {
        console.error(`GLB load error for ${AVATAR_MODEL_URL}:`, error);
      }
    );

    // Animation loop (Sign-Kit compatible)
    ref.animate = () => {
      if (ref.animations.length === 0) {
        ref.pending = false;
        setActiveWord("READY");
        return;
      }
      requestAnimationFrame(ref.animate);

      if (ref.animations[0].length) {
        if (!ref.flag) {
          if (ref.animations[0][0] === 'add-text') {
            ref.animations.shift();
          } else {
            for (let i = 0; i < ref.animations[0].length;) {
              let [boneName, action, axis, limit, sign] = ref.animations[0][i];
              const boneObj = ref.avatar.getObjectByName(boneName);
              if (!boneObj) {
                ref.animations[0].splice(i, 1);
                continue;
              }

              const current = boneObj[action][axis];
              const step = action === 'position' ? ref.speed * 0.35 : ref.speed;

              if (sign === "+" && current < limit) {
                boneObj[action][axis] += step;
                boneObj[action][axis] = Math.min(boneObj[action][axis], limit);
                i++;
              } else if (sign === "-" && current > limit) {
                boneObj[action][axis] -= step;
                boneObj[action][axis] = Math.max(boneObj[action][axis], limit);
                i++;
              } else {
                ref.animations[0].splice(i, 1);
              }
            }
          }
        }
      } else {
        ref.flag = true;
        setTimeout(() => {
          ref.flag = false;
        }, 600);
        ref.animations.shift();
      }

      ref.renderer.render(ref.scene, ref.camera);
    };

    // Idle render loop (when no animation is playing)
    const idleRender = () => {
      if (!ref.pending && ref.renderer && ref.scene && ref.camera) {
        ref.renderer.render(ref.scene, ref.camera);
      }
      requestAnimationFrame(idleRender);
    };
    idleRender();

    // Resize handler
    const handleResize = () => {
      if (!container || !ref.renderer || !ref.camera) return;
      const w2 = container.clientWidth;
      const h2 = container.clientHeight || 400;
      ref.renderer.setSize(w2, h2);
      ref.camera.aspect = w2 / h2;
      ref.camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Watch for new token sequences
  useEffect(() => {
    const ref = componentRef.current;
    if (!isLoaded || !ref.avatar) return;

    const frames = avatarData?.animation || [];
    if (!frames.length) return;

    setActiveWord(avatarData.tokens?.join(' ') || 'SIGNING...');
    ref.animations = [];

    const addMove = (moves, boneName, action, axis, target) => {
      const boneObj = ref.avatar.getObjectByName(boneName);
      if (!boneObj || Number.isNaN(target)) return;

      const current = boneObj[action][axis];
      if (Math.abs(target - current) > 0.01) {
        moves.push([boneName, action, axis, target, target > current ? '+' : '-']);
      }
    };

    const groupedFrames = [...frames]
      .sort((a, b) => Number(a.time || 0) - Number(b.time || 0))
      .reduce((groups, frame) => {
        const time = Number(frame.time || 0).toFixed(2);
        if (!groups.has(time)) groups.set(time, []);
        groups.get(time).push(frame);
        return groups;
      }, new Map());

    groupedFrames.forEach((group) => {
      const moves = [];
      group.forEach((frame) => {
        const boneName = BONE_MAPPING[frame.bone] || frame.bone;
        const boneObj = ref.avatar.getObjectByName(boneName);
        if (!boneObj) return;

        if (frame.rotation) {
          ['x', 'y', 'z'].forEach((axis, idx) => {
            addMove(moves, boneName, 'rotation', axis, Number(frame.rotation[idx]));
          });
        }

        if (frame.position && frame.bone.endsWith('_hand')) {
          const basePosition = ref.initialPositions.get(boneName) || new THREE.Vector3();
          const positionScale = 0.18;
          ['x', 'y', 'z'].forEach((axis, idx) => {
            const offset = Number(frame.position[idx] || 0) * positionScale;
            addMove(moves, boneName, 'position', axis, basePosition[axis] + offset);
          });
        }
      });

      if (moves.length > 0) {
        ref.animations.push(moves);
      }
    });

    const touchedBones = new Set(
      frames.map((frame) => BONE_MAPPING[frame.bone] || frame.bone)
    );
    DEFAULT_ROTATIONS.forEach(([boneName]) => touchedBones.add(boneName));

    const reset = [];
    touchedBones.forEach((boneName) => {
      const boneObj = ref.avatar.getObjectByName(boneName);
      if (!boneObj) return;

      ['x', 'y', 'z'].forEach((axis) => {
        const target = DEFAULT_ROTATION_TARGETS[`${boneName}:${axis}`] ?? 0;
        addMove(reset, boneName, 'rotation', axis, target);
      });

      if (boneName.includes('Hand')) {
        const basePosition = ref.initialPositions.get(boneName);
        if (basePosition) {
          ['x', 'y', 'z'].forEach((axis) => {
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
    <div style={{ position: 'relative', width: '100%', height: '400px' }}>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '12px',
          overflow: 'hidden',
          background: '#e8eaed'
        }}
      />
      
      <div style={{
        position: 'absolute',
        bottom: '1rem',
        left: '1.5rem',
        color: activeWord === 'READY' ? '#94a3b8' : '#10b981',
        fontWeight: 'bold',
        fontSize: '0.85rem',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        textShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
      }}>
        {!isLoaded ? 'LOADING MODEL...' : activeWord}
      </div>
    </div>
  );
};

export default Avatar;
