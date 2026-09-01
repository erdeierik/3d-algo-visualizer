import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Box3, Vector3, type PerspectiveCamera } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

const VIEW_DIRECTION = new Vector3(0, 0.35, 1).normalize();
const FIT_PADDING = 1.15;

export interface CameraRigHandle {
  reset: () => void;
}

interface CameraRigProps {
  fitKey?: unknown;
}

export const CameraRig = forwardRef<CameraRigHandle, CameraRigProps>(function CameraRig(
  { fitKey },
  ref,
) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera, scene } = useThree();
  const resetting = useRef(false);
  const pendingFit = useRef(false);
  const targetPosition = useRef(new Vector3());
  const targetLookAt = useRef(new Vector3());

  useImperativeHandle(ref, () => ({
    reset: () => {
      pendingFit.current = true;
    },
  }));

  useEffect(() => {
    pendingFit.current = true;
  }, [fitKey]);

  useFrame((_, delta) => {
    if (pendingFit.current || resetting.current) {
      const box = new Box3().setFromObject(scene);
      if (!box.isEmpty()) {
        const size = box.getSize(new Vector3());
        const center = box.getCenter(new Vector3());
        const persp = camera as PerspectiveCamera;
        const vFov = (persp.fov * Math.PI) / 180;
        const distance =
          Math.max(
            size.y / 2 / Math.tan(vFov / 2),
            size.x / 2 / (Math.tan(vFov / 2) * persp.aspect),
          ) * FIT_PADDING;

        targetPosition.current.copy(center).addScaledVector(VIEW_DIRECTION, distance);
        targetLookAt.current.copy(center);
        pendingFit.current = false;
        resetting.current = true;
      }
    }

    if (!resetting.current || !controlsRef.current) return;

    const factor = Math.min(delta * 4, 1);
    camera.position.lerp(targetPosition.current, factor);
    controlsRef.current.target.lerp(targetLookAt.current, factor);
    controlsRef.current.update();

    if (camera.position.distanceTo(targetPosition.current) < 0.01) {
      resetting.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      onStart={() => {
        resetting.current = false;
        pendingFit.current = false;
      }}
    />
  );
});
