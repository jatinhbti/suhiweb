import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const EDGE_COUNT = 300

export default function Edges({ pulseRef }) {
  const groupRef = useRef()
  const linesRef = useRef()

  const { endpoints, positionsArray, colorsArray } = useMemo(() => {
    const pts = []
    const pos = new Float32Array(EDGE_COUNT * 2 * 3) // 2 vertices per line, 3 coords per vertex
    const col = new Float32Array(EDGE_COUNT * 2 * 3)
    
    // Create base colors
    const colorWhite = new THREE.Color('#0a0a0a')
    const colorOrange = new THREE.Color('#ff6b2b')

    for (let i = 0; i < EDGE_COUNT; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / EDGE_COUNT)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const r = 3 + Math.random() * 8

      const target = new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      )

      pts.push({
        target,
        speed: 0.1 + Math.random() * 0.2,
        phase: Math.random() * Math.PI * 2,
        opacity: 0.1 + Math.random() * 0.4,
      })

      // Origin vertex
      pos[i * 6 + 0] = 0
      pos[i * 6 + 1] = 0
      pos[i * 6 + 2] = 0
      // Target vertex
      pos[i * 6 + 3] = target.x
      pos[i * 6 + 4] = target.y
      pos[i * 6 + 5] = target.z

      // Set Colors
      const isOrange = Math.random() > 0.95
      const c = isOrange ? colorOrange : colorWhite
      
      // Color for vertex 1 (dimmer near core)
      col[i * 6 + 0] = c.r * 0.5
      col[i * 6 + 1] = c.g * 0.5
      col[i * 6 + 2] = c.b * 0.5
      
      // Color for vertex 2 (brighter near target)
      col[i * 6 + 3] = c.r
      col[i * 6 + 4] = c.g
      col[i * 6 + 5] = c.b
    }
    return { endpoints: pts, positionsArray: pos, colorsArray: col }
  }, [])

  // Construct geometry securely once to avoid any R3F declarative reconciliation bugs dropping Context
  const edgeGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positionsArray, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3))
    return geo
  }, [positionsArray, colorsArray])

  useFrame((state) => {
    if (!linesRef.current) return
    const t = state.clock.elapsedTime
    
    const positions = linesRef.current.geometry.attributes.position.array
    
    for(let i = 0; i < EDGE_COUNT; i++) {
      const ep = endpoints[i]
      const float = Math.sin(t * ep.speed + ep.phase) * 0.1

      positions[i * 6 + 3] = ep.target.x + float * 0.2
      positions[i * 6 + 4] = ep.target.y + float
      positions[i * 6 + 5] = ep.target.z + float * 0.1
    }
    
    linesRef.current.geometry.attributes.position.needsUpdate = true
  })

  useFrame((state) => {
     if(groupRef.current) {
        groupRef.current.rotation.y = state.clock.elapsedTime * 0.02
        groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1
     }
  })

  return (
    <group ref={groupRef}>
      <lineSegments ref={linesRef} geometry={edgeGeometry}>
        <lineBasicMaterial
          vertexColors={true}
          transparent={true}
          opacity={0.5}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  )
}

