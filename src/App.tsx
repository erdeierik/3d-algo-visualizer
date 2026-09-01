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
import { useSessionStore, useCurrentDefinition } from './store/sessionStore';

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
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 4, 10], fov: 50 }}>
        <color attach="background" args={['#0f1115']} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} />
        <CameraRig ref={cameraRigRef} fitKey={selectedId} />
        <Scene />
      </Canvas>

      <div style={{ position: 'absolute', top: 12, left: 12 }}>
        <AlgorithmSelector />
        <DataControls />
        <ComplexityPanel />
      </div>
      <div style={{ position: 'absolute', top: 12, right: 12, maxWidth: 320 }}>
        <PseudocodePanel />
        <StatsPanel />
      </div>
      <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)' }}>
        <PlaybackControls />
      </div>
      <button
        type="button"
        onClick={() => cameraRigRef.current?.reset()}
        style={{ position: 'absolute', bottom: 12, right: 12 }}
      >
        Reset View
      </button>
    </div>
  );
}

export default App;
