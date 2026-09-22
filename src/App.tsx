import { useEffect, useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraRig, type CameraRigHandle } from './components/canvas/CameraRig';
import { computeContentBounds } from './components/canvas/contentBounds';
import { SortingScene } from './components/canvas/SortingScene';
import { TreeScene } from './components/canvas/TreeScene';
import { AlgorithmSelector } from './components/ui/AlgorithmSelector';
import { DataControls } from './components/ui/DataControls';
import { PlaybackControls } from './components/ui/PlaybackControls';
import { PseudocodePanel } from './components/ui/PseudocodePanel';
import { StatsPanel } from './components/ui/StatsPanel';
import { ComplexityPanel } from './components/ui/ComplexityPanel';
import { TabPanel } from './components/ui/TabPanel';
import { useSessionStore, useCurrentDefinition } from './store/sessionStore';
import { usePlayerStore } from './store/playerStore';
import { useSettingsStore } from './store/settingsStore';
import { useTheme } from './themes/registry';
import { useStepSound } from './audio/useStepSound';
import panel from './styles/panel.module.css';
import styles from './App.module.css';

function App() {
  const cameraRigRef = useRef<CameraRigHandle>(null);
  // a loadSteps mindig új tömböt tesz be, így minden adatgenerálásra újrakeretezünk
  const steps = usePlayerStore((s) => s.steps);
  const { category } = useCurrentDefinition();
  const theme = useTheme();
  const quality = useSettingsStore((s) => s.quality);

  useStepSound();

  useEffect(() => {
    useSessionStore.getState().generateData();
  }, []);

  const bounds = useMemo(() => computeContentBounds(steps, category), [steps, category]);
  const offsetY = theme.contentOffsetY(bounds);

  return (
    <div className={styles.stage}>
      <Canvas camera={{ position: [0, 4, 10], fov: 50 }}>
        <theme.Environment quality={quality} bounds={bounds} category={category} />
        <CameraRig ref={cameraRigRef} bounds={bounds} offsetY={offsetY} />
        <group name="algo-content" position={[0, offsetY, 0]}>
          {category === 'tree' ? <TreeScene /> : <SortingScene />}
        </group>
      </Canvas>

      <div className={styles.zoneTopLeft}>
        <AlgorithmSelector />
        <DataControls />
        <ComplexityPanel />
      </div>

      <div className={`${styles.zoneTopRight} ${panel.panel}`}>
        <PseudocodePanel />
        <StatsPanel />
      </div>

      <div className={styles.zoneBottomLeft}>
        <TabPanel />
      </div>

      <div className={styles.zoneBottomCenter}>
        <PlaybackControls />
      </div>

      <button
        type="button"
        className={`${styles.zoneBottomRight} ${styles.resetView}`}
        onClick={() => cameraRigRef.current?.reset()}
      >
        ◇ Reset View
      </button>
    </div>
  );
}

export default App;
