import { useRef, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
// Three.js and React Three Fiber
import GraphScene from './components/GraphScene'
import ScrollSections from './components/ScrollSections'
import HUDOverlay from './components/HUDOverlay'

function Loader() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black">
      <div
        className="w-3 h-3 rounded-full mb-6"
        style={{
          background: '#ff6b2b',
          boxShadow: '0 0 20px rgba(255, 107, 43, 0.5)',
          animation: 'pulse-glow 1.5s ease-in-out infinite',
        }}
      />
      <span
        className="text-xs uppercase tracking-[0.5em] font-mono"
        style={{ color: 'rgba(255,255,255,0.3)' }}
      >
        INITIALIZING
      </span>
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}

export default function App() {
  const triggerPulseRef = useRef(null)
  const scrollProgressRef = useRef(0)

  const handleScroll = (e) => {
    const target = e.target
    const maxScroll = target.scrollHeight - target.clientHeight
    scrollProgressRef.current = maxScroll > 0 ? target.scrollTop / maxScroll : 0
  }

  return (
    <div className="w-full h-full bg-black overflow-hidden relative">
      <HUDOverlay />

      {/* WebGL Background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<Loader />}>
          <Canvas
            camera={{ position: [0, 0, 6], fov: 60 }}
            gl={{
              antialias: true,
              alpha: false,
            }}
            dpr={[1, 1.5]}
            style={{ position: 'absolute', inset: 0 }}
          >
            <color attach="background" args={['#000000']} />
            <ambientLight intensity={0.1} />
            <GraphScene onPulse={triggerPulseRef} scrollProgressRef={scrollProgressRef} />
          </Canvas>
        </Suspense>
      </div>

      {/* Native Scroll Container (Foreground) */}
      <div
        className="absolute inset-0 z-10 overflow-x-hidden overflow-y-auto"
        style={{ scrollSnapType: 'y mandatory', scrollBehavior: 'smooth' }}
        onScroll={handleScroll}
      >
        <ScrollSections triggerPulseRef={triggerPulseRef} />
      </div>
    </div>
  )
}
