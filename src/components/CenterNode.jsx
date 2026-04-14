import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

export default function CenterNode({ pulseRef }) {
  const groupRef = useRef()
  const coreWireframeRef = useRef()
  const coreWireframeInnerRef = useRef()

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    const pulse = pulseRef?.current || 0

    // Core breathing
    const breathe = 1 + Math.sin(t * 1.5) * 0.02 + pulse * 0.1
    groupRef.current.scale.setScalar(breathe)

    // Spin wireframes in opposite directions for dynamic density
    if (coreWireframeRef.current) {
      coreWireframeRef.current.rotation.y = t * 0.15
      coreWireframeRef.current.rotation.x = t * 0.08
    }
    if (coreWireframeInnerRef.current) {
      coreWireframeInnerRef.current.rotation.y = -t * 0.1
      coreWireframeInnerRef.current.rotation.z = t * 0.05
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Background solid black sphere to hide lines behind the text and prevent visual clutter */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Dense white wireframe shell 1 */}
      <mesh ref={coreWireframeRef}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshBasicMaterial color="#898989" wireframe={true} transparent opacity={0.6} toneMapped={false} />
      </mesh>

      {/* Dense white wireframe shell 2 (Creates the super-dense moiré pattern seen in image) */}
      <mesh ref={coreWireframeInnerRef}>
        <sphereGeometry args={[0.52, 24, 24]} />
        <meshBasicMaterial color="#898989" wireframe={true} transparent opacity={0.4} toneMapped={false} />
      </mesh>

      {/* Faint orbital rings */}
      <mesh rotation={[Math.PI / 2.2, 0.1, 0]}>
        <torusGeometry args={[1.2, 0.002, 16, 128]} />
        <meshBasicMaterial color="#898989" transparent opacity={0.2} toneMapped={false} />
      </mesh>
      
      <mesh rotation={[1.2, 1.5, 0]}>
        <torusGeometry args={[1.8, 0.001, 16, 128]} />
        <meshBasicMaterial color="#898989" transparent opacity={0.1} toneMapped={false} />
      </mesh>

      <mesh rotation={[0.4, 2.5, 0]}>
        <torusGeometry args={[2.5, 0.001, 16, 128]} />
        <meshBasicMaterial color="#ff6b2b" transparent opacity={0.15} toneMapped={false} />
      </mesh>

      {/* Central Identity Text */}
      <Text
        position={[0, 0, 0.58]}
        fontSize={0.08}
        color="#ffffff"
        font="/fonts/SFProText-Medium.ttf"
        characters="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890x"
        anchorX="center"
        anchorY="middle"
      >
        0x0101A9FC22E4BBD21FA32
      </Text>
    </group>
  )
}
