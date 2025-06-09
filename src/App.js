import { RGBELoader } from 'three-stdlib'
import { Canvas, useLoader } from '@react-three/fiber'
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
import { useEffect, useState } from 'react'

export function App() {
  const [isMobile, setIsMobile] = useState(false)
  
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

  // Cursor interaction logic
  useEffect(() => {
    let isMouseDown = false
    let hasMouseMoved = false

    const handleMouseDown = (event) => {
      // Only handle left mouse button
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

    // Add event listeners
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    
    // Also handle mouse leave to reset cursor
    document.addEventListener('mouseleave', handleMouseUp)

    // Cleanup
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

  // Adjust zoom for mobile devices
  const cameraZoom = isMobile ? 25 : 40

  return (
    <Canvas shadows orthographic camera={{ position: [10, 20, 20], zoom: cameraZoom }} gl={{ preserveDrawingBuffer: true }}>
      <color attach="background" args={['#f2f2f5']} />
      {/** The text and the grid */}
      <Text config={config} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 2.25]}>
        {text}
      </Text>
      {/** Controls */}
      <OrbitControls
        autoRotate={autoRotate}
        autoRotateSpeed={-0.1}
        zoomSpeed={0.25}
        minZoom={30}
        maxZoom={140}
        enablePan={false}
        dampingFactor={0.05}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 3}
      />
      {/** The environment is just a bunch of shapes emitting light. This is needed for the clear-coat */}
      <Environment resolution={16}>
        <group rotation={[-Math.PI / 4, -0.3, 0]}>
          <Lightformer intensity={20} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
          <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[10, 2, 1]} />
          <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[10, 2, 1]} />
          <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 2, 1]} />
          <Lightformer type="ring" intensity={2} rotation-y={Math.PI / 2} position={[-0.1, -1, -5]} scale={10} />
        </group>
      </Environment>
      {/** Soft shadows */}
      <AccumulativeShadows frames={60} color={shadow} colorBlend={5} toneMapped={true} alphaTest={0.9} opacity={1} scale={30} position={[0, -1.01, 0]}>
        <RandomizedLight amount={4} radius={10} ambient={0.5} intensity={1} position={[0, 10, -10]} size={15} mapSize={1024} bias={0.0001} />
      </AccumulativeShadows>
    </Canvas>
  )
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
