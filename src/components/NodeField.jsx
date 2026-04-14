import { useRef, useMemo, useLayoutEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

const NODE_COUNT = 300 // Match edge count
const SPHERE_RADIUS = 7 // Radial explosion size

export default function NodeField({ pulseRef }) {
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const { positions, speeds, phases, isAccent } = useMemo(() => {
    const positions = []
    const speeds = []
    const phases = []
    const isAccent = []

    for (let i = 0; i < NODE_COUNT; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / NODE_COUNT)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i

      // Vary the depths for the explosion starburst effect
      const r = SPHERE_RADIUS * (0.3 + Math.random() * 0.8)
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)

      positions.push(new THREE.Vector3(x, y, z))
      speeds.push(0.1 + Math.random() * 0.2)
      phases.push(Math.random() * Math.PI * 2)
      isAccent.push(Math.random() > 0.85) // 15% are accent colored
    }

    return { positions, speeds, phases, isAccent }
  }, [])

  const colorArray = useMemo(() => {
    const arr = new Float32Array(NODE_COUNT * 3)
    for (let i = 0; i < NODE_COUNT; i++) {
      if (isAccent[i]) {
        arr[i * 3 + 0] = 1.0
        arr[i * 3 + 1] = 0.42
        arr[i * 3 + 2] = 0.17
      } else {
        const brightness = 0.4 + Math.random() * 0.6
        arr[i * 3 + 0] = brightness
        arr[i * 3 + 1] = brightness
        arr[i * 3 + 2] = brightness
      }
    }
    return arr
  }, [isAccent])

  // Secure Geometry
  const nodeGeometry = useMemo(() => {
    return new THREE.BoxGeometry(1, 1, 0.1)
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    const pulseAmount = pulseRef?.current || 0

    for (let i = 0; i < NODE_COUNT; i++) {
      const pos = positions[i]
      const speed = speeds[i]
      const phase = phases[i]

      const floatOffset = Math.sin(t * speed + phase) * 0.1
      const pulseScale = 1 + pulseAmount * 0.3

      dummy.position.set(
        pos.x + floatOffset * 0.2,
        pos.y + floatOffset,
        pos.z + floatOffset * 0.1
      )

      dummy.lookAt(0, 0, 0)

      const baseScale = isAccent[i] ? 0.05 : 0.02 + Math.random() * 0.02
      const s = baseScale * pulseScale
      dummy.scale.set(s, s, s)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  // Determine a tiny subset of nodes for HTML labels
  const labeledIndices = [10, 42, 88, 150, 210, 275]

  return (
    <group>
      {/* Block dynamically recreated geometries, map statically built geometry */}
      <instancedMesh ref={meshRef} args={[nodeGeometry, null, NODE_COUNT]}>
        <instancedBufferAttribute attach="instanceColor" args={[colorArray, 3]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      {/* Floating HTML Labels */}
      {labeledIndices.map((idx, arrayIdx) => (
        <HTMLTag key={idx} pos={positions[idx]} phase={phases[idx]} speed={speeds[idx]} pulseRef={pulseRef} labelIndex={arrayIdx} />
      ))}
    </group>
  )
}

function HTMLTag({ pos, phase, speed, pulseRef, labelIndex }) {
  const ref = useRef()
  const labels = [
    "0x1102B457TD",
    "VOLATILITY: HIGH",
    "88.792",
    "AXI: 1633.393",
    "0x010BFTDD",
    "69.A02"
  ]

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    const floatOffset = Math.sin(t * speed + phase) * 0.1
    ref.current.position.set(
      pos.x + floatOffset * 0.2,
      pos.y + floatOffset,
      pos.z + floatOffset * 0.1
    )
  })

  return (
    <group ref={ref}>
      <Html distanceFactor={8} center>
        <div style={{
          background: 'rgba(255, 107, 43, 0.15)',
          border: '1px solid rgba(255, 107, 43, 0.4)',
          color: 'rgba(255, 255, 255, 0.8)',
          padding: '2px 6px',
          fontSize: '10px',
          fontFamily: 'monospace',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
          backdropFilter: 'blur(4px)'
        }}>
          {labels[labelIndex % labels.length]}
        </div>
      </Html>
    </group>
  )
}
