import { useRef, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import CenterNode from './CenterNode'
import NodeField from './NodeField'
import Edges from './Edges'

export default function GraphScene({ onPulse, scrollProgressRef }) {
  const groupRef = useRef()
  const pulseRef = useRef(0)

  // Expose triggerPulse
  const triggerPulse = useCallback(() => {
    pulseRef.current = 1
  }, [])

  // Attach trigger to the parent callback
  if (onPulse) {
    onPulse.current = triggerPulse
  }

  useFrame((state, delta) => {
    // Decay pulse
    if (pulseRef.current > 0) {
      pulseRef.current = Math.max(0, pulseRef.current - delta * 1.2)
    }

    if (!groupRef.current) return

    // Subtle auto-rotation based on scroll
    const scrollOffset = scrollProgressRef?.current || 0
    groupRef.current.rotation.y = scrollOffset * Math.PI * 0.5 + state.clock.elapsedTime * 0.03
    groupRef.current.rotation.x = Math.sin(scrollOffset * Math.PI) * 0.15

    // Subtle zoom based on scroll position
    const scale = 1 - scrollOffset * 0.15
    groupRef.current.scale.setScalar(Math.max(0.7, scale))
  })

  return (
    <group ref={groupRef}>
      <CenterNode pulseRef={pulseRef} />
      <NodeField pulseRef={pulseRef} />
      <Edges pulseRef={pulseRef} />
    </group>
  )
}
