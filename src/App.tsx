import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraRig, type CameraRigHandle } from './components/canvas/CameraRig';
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
import panel from './styles/panel.module.css';
import styles from './App.module.css';

function Scene() {
  return useCurrentDefinition().category === 'tree' ? <TreeScene /> : <SortingScene />;
}

function App() {
  const cameraRigRef = useRef<CameraRigHandle>(null);
  const selectedId = useSessionStore((s) => s.selectedId);

  useEffect(() => {
    useSessionStore.getState().generateData();
  }, []);

  return (
    <div className={styles.stage}>
      <Canvas camera={{ position: [0, 4, 10], fov: 50 }}>
        <color attach="background" args={['#0f1115']} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} />
        <CameraRig ref={cameraRigRef} fitKey={selectedId} />
        <Scene />
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
