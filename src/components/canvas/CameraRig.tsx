import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Vector3, type PerspectiveCamera } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { ContentBounds } from '../../themes/types';

const VIEW_DIRECTION = new Vector3(0, 0.35, 1).normalize();
const FIT_PADDING = 1.15;

export interface CameraRigHandle {
  reset: () => void;
}

interface CameraRigProps {
  bounds: ContentBounds;
  offsetY: number;
}

export const CameraRig = forwardRef<CameraRigHandle, CameraRigProps>(function CameraRig(
  { bounds, offsetY },
  ref,
) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const camera = useThree((s) => s.camera);
  const resetting = useRef(false);
  const pendingFit = useRef(false);
  const targetPosition = useRef(new Vector3());
  const targetLookAt = useRef(new Vector3());

  useImperativeHandle(ref, () => ({
    reset: () => {
      pendingFit.current = true;
    },
  }));

  // a bounds identitása minden loadSteps-re változik (useMemo a steps-en);
  // az offsetY szám, tehát azonos eltolású témák között nem indít újrakeretezést (terv 7.2)
  useEffect(() => {
    pendingFit.current = true;
  }, [bounds, offsetY]);

  useFrame((_, delta) => {
    if ((pendingFit.current || resetting.current) && bounds.count > 0) {
      const size = new Vector3().subVectors(bounds.max, bounds.min);
      const center = new Vector3().addVectors(bounds.min, bounds.max).multiplyScalar(0.5);
      center.y += offsetY; // a bounds nyers koordinátákban van, a tartalom viszont el van tolva

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
