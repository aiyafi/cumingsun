import React, { useRef, useEffect, useState } from 'react'
import { RGBELoader } from 'three-stdlib'
import { Canvas, useLoader, useFrame } from '@react-three/fiber'
import {
  Center,
  Text3D,
  Instance,
  Instances,
  Environment,
  Lightformer,
  OrbitControls,
  RandomizedLight,
  AccumulativeShadows,
  MeshTransmissionMaterial
} from '@react-three/drei'

export function App() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      setIsMobile(width <= 768 && isTouch)
    }
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  // 1️⃣ grab a ref to the OrbitControls
  const controlsRef = useRef()

  // 2️⃣ update controls each frame so damping actually runs
  useFrame(() => {
    if (controlsRef.current) controlsRef.current.update()
  })

  const cameraZoom = isMobile ? 25 : 40
  const autoRotate = false
  const text = 'Coming Soon'
  const shadow = '#94cbff'
  const config = { /* your MeshTransmissionMaterial config */ }

  return (
    <Canvas
      shadows
      orthographic
      camera={{ position: [10, 20, 20], zoom: cameraZoom }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <color attach="background" args={['#f2f2f5']} />
      <Text rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 2.25]} config={config}>
        {text}
      </Text>

      {/* 3️⃣ enable damping here */}
      <OrbitControls
        ref={controlsRef}
        autoRotate={autoRotate}
        autoRotateSpeed={-0.1}
        zoomSpeed={0.25}
        enableDamping
        dampingFactor={0.1}   // try 0.1–0.2 for nice inertia
        minZoom={30}
        maxZoom={140}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 3}
      />

      <Environment resolution={16}>
        <group rotation={[-Math.PI / 4, -0.3, 0]}>
          <Lightformer intensity={20} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
          <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[10, 2, 1]} />
          <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[10, 2, 1]} />
          <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 2, 1]} />
          <Lightformer type="ring" intensity={2} rotation-y={Math.PI / 2} position={[-0.1, -1, -5]} scale={10} />
        </group>
        </Environment>
      <AccumulativeShadows frames={60} color={shadow} colorBlend={5} toneMapped alphaTest={0.9} opacity={1} scale={30} position={[0, -1.01, 0]}>
        <RandomizedLight amount={4} radius={10} ambient={0.5} intensity={1} position={[0, 10, -10]} size={15} mapSize={1024} bias={0.0001} />
      </AccumulativeShadows>
    </Canvas>
  )
}

// keep your Text + Grid components exactly as before
function Text({ children, config, font = '/Manrope_Regular.json', ...props }) {
  const texture = useLoader(RGBELoader, 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr')
  return (
    <group>
      <Center scale={[0.8, 1, 1]} front top {...props}>
        <Text3D
          castShadow
          bevelEnabled
          font={font}
          scale={5}
          letterSpacing={-0.03}
          height={0.25}
          bevelSize={0.01}
          bevelSegments={5}
          curveSegments={64}
          bevelThickness={0.01}
        >
          {children}
          <MeshTransmissionMaterial {...config} background={texture} />
        </Text3D>
      </Center>
      <Grid />
    </group>
  )
}