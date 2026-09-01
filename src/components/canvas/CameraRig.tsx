import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Vector3 } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

const INITIAL_POSITION = new Vector3(0, 4, 10);
const INITIAL_TARGET = new Vector3(0, 0, 0);

export interface CameraRigHandle {
  reset: () => void;
}

export const CameraRig = forwardRef<CameraRigHandle>(function CameraRig(_props, ref) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const resetting = useRef(false);

  useImperativeHandle(ref, () => ({
    reset: () => {
      resetting.current = true;
    },
  }));

  useFrame((_, delta) => {
    if (!resetting.current || !controlsRef.current) return;

    const factor = Math.min(delta * 4, 1);
    camera.position.lerp(INITIAL_POSITION, factor);
    controlsRef.current.target.lerp(INITIAL_TARGET, factor);
    controlsRef.current.update();

    if (camera.position.distanceTo(INITIAL_POSITION) < 0.01) {
      resetting.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      onStart={() => {
        resetting.current = false;
      }}
    />
  );
});
