// src/themes/living-tree/Environment.tsx
import { useLayoutEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { Fog } from 'three';
import { Decor } from '../shared/Decor';
import { useDecorProfile } from '../shared/decorProfile';
import { scatter } from '../shared/scatter';
import { InstancedScatter } from './InstancedScatter';
import { Pollen } from './Pollen';
import { ContactShadows, Ground, SkyDome } from './Terrain';
import { FLOWER_COLORS, HORIZON } from './palette';
import type { EnvironmentProps, Quality } from '../types';

/** A quality-kapcsoló érzékelhető különbsége (temak-poc.md 5.2). */
const DENSITY: Record<Quality, Record<'trees' | 'grass' | 'ferns' | 'flowers' | 'pollen', number>> =
  {
    high: { trees: 130, grass: 300, ferns: 90, flowers: 30, pollen: 90 },
    low: { trees: 48, grass: 80, ferns: 26, flowers: 9, pollen: 28 },
  };

/** A kis/közepes adatméreteken már bevált értékek — ezek maradnak az alsó korlát. */
const FOG_NEAR_FLOOR = 34;
const FOG_FAR_FLOOR = 105;

/** A fasor legkülső gyűrűjének sugár-szorzója — ugyanez kell a talaj méretezéséhez is,
 * különben nagy radius-nál a legtávolabbi fák a talaj szélén túl lógnak (semmi sincs alattuk). */
const TREELINE_R_MAX = 2.6;
const GROUND_MARGIN = 1.15; // a CameraRig FIT_PADDING mintájára: kis ráhagyás a szélen

export function LivingTreeEnvironment({ quality, bounds, category }: EnvironmentProps) {
  const scene = useThree((s) => s.scene);
  const { radius, quality: level } = useDecorProfile(bounds, quality);
  const density = DENSITY[level];

  // a CameraRig a tartalomhoz illeszti a kamerát, tehát a köd-mélység (~radius-szal arányos)
  // NAGY adatméretnél messze meghaladja a kis jeleneteken bevált fix távolságokat — a
  // fasor/talajszél elmosásához a radius-szal kell skálázni, mint a Cosmos csillaghéjánál
  // (fazis-11-2-cosmos.md 9., Starfield innerRadius), különben 100 elemnél az egész tartalom
  // a ködsávba esik (a bársor MINDEN eleme kb. egyforma mélységben van a kamerától, mert a
  // CameraRig mindig a tartalom közepére néz — nincs "közeli" és "távoli" bár, csak egyszerre
  // ködös vagy tiszta az egész sor)
  const fogNear = Math.max(FOG_NEAR_FLOOR, radius * 2);
  const fogFar = Math.max(FOG_FAR_FLOOR, radius * 3.5);

  // a simple/cosmos Environment scene.fog = null-jának párja: a köd a témával jön és megy
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    scene.fog = new Fog(HORIZON, fogNear, fogFar);
    return () => {
      scene.fog = null;
    };
  }, [scene, fogNear, fogFar]);

  // a bársor x = 0-tól indul, NEM középre igazított (terv 7.1) — a szórt dekor a tartalom
  // közepére kerül, különben 100 elemnél a jobb szélső bárok a mezőn kívülre esnének
  const centerX = (bounds.min.x + bounds.max.x) / 2;

  const treeline = useMemo(
    () => scatter({ count: density.trees, rMin: radius * 1.9, rMax: radius * TREELINE_R_MAX, seed: 311 }),
    [density, radius],
  );
  const grass = useMemo(
    () => scatter({ count: density.grass, rMin: radius * 0.4, rMax: radius * 1.4, seed: 907 }),
    [density, radius],
  );
  const ferns = useMemo(
    () => scatter({ count: density.ferns, rMin: radius * 0.5, rMax: radius * 1.4, seed: 1201 }),
    [density, radius],
  );
  const flowers = useMemo(
    () =>
      FLOWER_COLORS.map((color, i) => ({
        color,
        items: scatter({ count: density.flowers, rMin: radius * 0.4, rMax: radius * 1.3, seed: 1400 + i }),
      })),
    [density, radius],
  );

  return (
    <>
      <color attach="background" args={[HORIZON]} />
      <hemisphereLight color="#f1f7ea" groundColor="#5f5233" intensity={1} />
      <directionalLight color="#fff2d0" intensity={1.05} position={[-6, 10, 5]} />

      <Decor>
        <ContactShadows bounds={bounds} category={category} />

        <group position={[centerX, 0, 0]}>
          <SkyDome />
          <Ground size={Math.max(200, radius * TREELINE_R_MAX * 2 * GROUND_MARGIN)} />

          <InstancedScatter items={treeline} sway={false} liftY={3.75}>
            <coneGeometry args={[2.1, 7.5, 6]} />
            <meshLambertMaterial color="#54683b" />
          </InstancedScatter>

          <InstancedScatter items={grass} sway liftY={0.275}>
            <coneGeometry args={[0.08, 0.55, 4]} />
            <meshLambertMaterial color="#869c52" />
          </InstancedScatter>

          <InstancedScatter items={ferns} sway liftY={0.6}>
            <coneGeometry args={[0.13, 1.2, 5]} />
            <meshLambertMaterial color="#5c7539" />
          </InstancedScatter>

          {flowers.map(({ color, items }) => (
            <InstancedScatter key={color} items={items} sway liftY={0.055}>
              <sphereGeometry args={[0.055, 8, 6]} />
              <meshLambertMaterial color={color} />
            </InstancedScatter>
          ))}

          <Pollen radius={radius} count={density.pollen} />
        </group>
      </Decor>
    </>
  );
}
