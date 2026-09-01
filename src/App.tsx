import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraRig, type CameraRigHandle } from './components/canvas/CameraRig';
import { SortingScene } from './components/canvas/SortingScene';
import { usePlayerStore } from './store/playerStore';
import { bubbleSort } from './algorithms/sorting/bubbleSort';

const DEMO_ARRAY = [5, 3, 8, 1, 9, 2, 7, 6, 4];

function App() {
  const cameraRigRef = useRef<CameraRigHandle>(null);

  useEffect(() => {
    usePlayerStore.getState().loadSteps(bubbleSort(DEMO_ARRAY));
    usePlayerStore.getState().play();
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 4, 10], fov: 50 }}>
        <color attach="background" args={['#0f1115']} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} />
        <CameraRig ref={cameraRigRef} />
        <SortingScene />
      </Canvas>
      <button
        type="button"
        onClick={() => cameraRigRef.current?.reset()}
        style={{ position: 'absolute', top: 12, left: 12 }}
      >
        Reset View
      </button>
    </div>
  );
}

export default App;
