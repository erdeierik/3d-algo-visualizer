import { useLayoutEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { BACKGROUND } from './palette';

export function SimpleEnvironment() {
  const scene = useThree((s) => s.scene);

  // Explicit „nincs fog": a Cosmos FogExp2 / Living Tree Fog témaváltáskor így biztosan eltűnik,
  // nem az R3F attach-cleanup hallgatólagos viselkedésére hagyatkozunk (06-review-v2.md 5.3.d).
  useLayoutEffect(() => {
    // a three.js Scene objektum direkt mutálása a bevett R3F-minta, a useThree nem "birtokolt" React-állapotot ad vissza
    // eslint-disable-next-line react-hooks/immutability
    scene.fog = null;
  }, [scene]);

  return (
    <>
      <color attach="background" args={[BACKGROUND]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
    </>
  );
}
