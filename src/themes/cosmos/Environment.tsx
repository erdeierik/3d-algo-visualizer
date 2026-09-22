// src/themes/cosmos/Environment.tsx
import { useLayoutEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { FogExp2 } from 'three';
import { Decor } from '../shared/Decor';
import { useDecorProfile } from '../shared/decorProfile';
import { Starfield } from './Starfield';
import { BACKGROUND, FOG_DENSITY } from './palette';
import type { EnvironmentProps } from '../types';

const MIN_SHELL_RADIUS = 26; // a PoC héja; 100 bárnál a bounds.radius × 1.6 veszi át (terv 6.1)

export function CosmosEnvironment({ quality, bounds }: EnvironmentProps) {
  const scene = useThree((s) => s.scene);

  // a simple Environment scene.fog = null-jának párja: a köd a témával jön és megy
  useLayoutEffect(() => {
    // a three.js Scene objektum direkt mutálása a bevett R3F-minta, a useThree nem "birtokolt" React-állapotot ad vissza
    // eslint-disable-next-line react-hooks/immutability
    scene.fog = new FogExp2(BACKGROUND, FOG_DENSITY);
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  const profile = useDecorProfile(bounds, quality);
  const innerRadius = Math.max(MIN_SHELL_RADIUS, profile.radius * 1.6);

  // a bársor x = 0-tól indul, NEM középre igazított (terv 7.1) — a héjat a tartalom közepére
  // toljuk, különben 100 elemnél a jobb szélső bárok a csillagok KÖZÉ kerülnének
  const centerX = (bounds.min.x + bounds.max.x) / 2;

  return (
    <>
      <color attach="background" args={[BACKGROUND]} />
      <ambientLight color="#36508c" intensity={0.75} />
      <directionalLight color="#cfe0ff" intensity={0.85} position={[4, 9, 6]} />
      <pointLight color="#63b3ed" intensity={0.7} distance={60} position={[-9, 4, -6]} />
      <Decor>
        <group position={[centerX, 0, 0]}>
          <Starfield innerRadius={innerRadius} quality={profile.quality} />
        </group>
      </Decor>
    </>
  );
}
