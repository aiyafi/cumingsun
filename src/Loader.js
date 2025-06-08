import { useProgress } from '@react-three/drei'
import { useState, useEffect } from 'react'

export function Loader() {
  const { progress } = useProgress()
  const [isVisible, setIsVisible] = useState(true)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (progress === 100) {
      setIsComplete(true)
      setTimeout(() => {
        setIsVisible(false)
      }, 600) // Slightly longer for the transform effect
    }
  }, [progress])

  if (!isVisible) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#f2f2f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        fontSize: '70px',
        color: '#333',
        fontWeight: '300',
        fontFamily: 'Manrope, sans-serif',
        opacity: isComplete ? 0 : 1,
        transform: isComplete ? 'scale(0.9)' : 'scale(1)',
        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
        pointerEvents: isComplete ? 'none' : 'auto'
      }}>
      {Math.round(progress)}%
    </div>
  )
}