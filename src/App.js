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
import { useEffect, useState, useRef } from 'react'

export function App() {
  const [isMobile, setIsMobile] = useState(false)
  const controlsRef = useRef()
  const targetZoom = useRef(40)
  const currentZoom = useRef(40)
  
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      setIsMobile(width <= 768 && isTouchDevice)
    }
    
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  // Smooth zoom implementation
  useEffect(() => {
    const handleWheel = (event) => {
      event.preventDefault()
      
      // Smooth zoom speed
      const zoomSpeed = 0.002
      const delta = event.deltaY * zoomSpeed
      
      // Update target zoom
      targetZoom.current = Math.max(15, Math.min(80, targetZoom.current + delta))
    }

    // Add wheel listener with passive: false to prevent default
    window.addEventListener('wheel', handleWheel, { passive: false })
    
    return () => {
      window.removeEventListener('wheel', handleWheel)
    }
  }, [])

  // Cursor interaction logic
  useEffect(() => {
    let isMouseDown = false
    let hasMouseMoved = false

    const handleMouseDown = (event) => {
      if (event.button === 0) {
        isMouseDown = true
        hasMouseMoved = false
        document.body.classList.add('cursor-grab')
        document.body.classList.remove('cursor-grabbing')
      }
    }

    const handleMouseMove = (event) => {
      if (isMouseDown) {
        if (!hasMouseMoved) {
          hasMouseMoved = true
          document.body.classList.remove('cursor-grab')
          document.body.classList.add('cursor-grabbing')
        }
      }
    }

    const handleMouseUp = (event) => {
      if (event.button === 0) {
        isMouseDown = false
        hasMouseMoved = false
        document.body.classList.remove('cursor-grab', 'cursor-grabbing')
      }
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseleave', handleMouseUp)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseleave', handleMouseUp)
      document.body.classList.remove('cursor-grab', 'cursor-grabbing')
    }
  }, [])

  const autoRotate = false
  const text = 'Coming Soon'
  const shadow = '#94cbff'
  const config = {
    backside: true,
    backsideThickness: 0.15,
    samples: 8,
    resolution: 512,
    transmission: 1,
    clearcoat: 1,
    clearcoatRoughness: 0.0,
    thickness: 0.3,
    chromaticAberration: 0.15,
    anisotropy: 0.25,
    roughness: 0,
    distortion: 0.5,
    distortionScale: 0.1,
    temporalDistortion: 0,
    ior: 1.25,
    color: 'white'
  }

  // Set initial zoom based on device
  const initialZoom = isMobile ? 25 : 40
  if (targetZoom.current === 40 && isMobile) {
    targetZoom.current = 25
    currentZoom.current = 25
  }

  return (
    <Canvas shadows orthographic camera={{ position: [10, 20, 20], zoom: initialZoom }} gl={{ preserveDrawingBuffer: true }}>
      <SmoothZoom controlsRef={controlsRef} targetZoom={targetZoom} currentZoom={currentZoom} />
      <color attach="background" args={['#f2f2f5']} />
      {/** The text and the grid */}
      <Text config={config} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 2.25]}>
        {text}
      </Text>
      {/** Controls with zoom disabled */}
      <OrbitControls
        ref={controlsRef}
        autoRotate={autoRotate}
        autoRotateSpeed={-0.1}
        enableZoom={false}  // Disable default zoom
        enableDamping={true}
        dampingFactor={0.02}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 3}
        screenSpacePanning={false}
      />
      {/** Environment and lighting remain the same */}
      <Environment resolution={16}>
        <group rotation={[-Math.PI / 4, -0.3, 0]}>
          <Lightformer intensity={20} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
          <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[10, 2, 1]} />
          <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[10, 2, 1]} />
          <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 2, 1]} />
          <Lightformer type="ring" intensity={2} rotation-y={Math.PI / 2} position={[-0.1, -1, -5]} scale={10} />
        </group>
      </Environment>
      <AccumulativeShadows frames={60} color={shadow} colorBlend={5} toneMapped={true} alphaTest={0.9} opacity={1} scale={30} position={[0, -1.01, 0]}>
        <RandomizedLight amount={4} radius={10} ambient={0.5} intensity={1} position={[0, 10, -10]} size={15} mapSize={1024} bias={0.0001} />
      </AccumulativeShadows>
    </Canvas>
  )
}

// Smooth zoom component
function SmoothZoom({ controlsRef, targetZoom, currentZoom }) {
  useFrame((state) => {
    if (!controlsRef.current) return
    
    // Smooth interpolation (like Lenis)
    const lerp = (start, end, factor) => start + (end - start) * factor
    const smoothness = 0.08 // Adjust for more/less smoothness
    
    // Smoothly interpolate current zoom towards target
    currentZoom.current = lerp(currentZoom.current, targetZoom.current, smoothness)
    
    // Apply zoom to camera
    state.camera.zoom = currentZoom.current
    state.camera.updateProjectionMatrix()
    
    // Update controls
    controlsRef.current.update()
  })
  
  return null
}

const Grid = ({ number = 15, lineWidth = 0.026, height = 0.5 }) => (
  <Instances position={[0, -1.02, 0]}>
    <planeGeometry args={[lineWidth, height]} />
    <meshBasicMaterial color="#999" />
    {Array.from({ length: number }, (_, y) =>
      Array.from({ length: number }, (_, x) => (
        <group key={x + ':' + y} position={[x * 2 - Math.floor(number / 2) * 2, -0.01, y * 2 - Math.floor(number / 2) * 2]}>
          <Instance rotation={[-Math.PI / 2, 0, 0]} />
          <Instance rotation={[-Math.PI / 2, 0, Math.PI / 2]} />
        </group>
      ))
    )}
    <gridHelper args={[100, 50, '#bbb', '#bbb']} position={[0, -0.01, 0]} />
  </Instances>
)

function Text({ children, config, font = '/Manrope_Regular.json', ...props }) {
  const texture = useLoader(RGBELoader, 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr')
  return (
    <>
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
            bevelThickness={0.01}>
            {children}
            <MeshTransmissionMaterial {...config} background={texture} />
          </Text3D>
        </Center>
        <Grid />
      </group>
    </>
  )
}
