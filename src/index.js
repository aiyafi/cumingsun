import { createRoot } from 'react-dom/client'
import { useState, useEffect } from 'react'
import './styles.css'
import { App } from './App'

function Overlay() {
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    })
  )
  
  const [locationText, setLocationText] = useState(' ')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit'
        })
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Fetch location data
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/')
        const data = await response.json()
        
        if (data.city && data.country_name) {
          setLocationText(`Last visit from ${data.city}, ${data.country_name}`)
        } else {
          setLocationText('Last visit from Unknown location')
        }
      } catch (error) {
        console.error('Failed to fetch location:', error)
        setLocationText('Last visit from Unknown location')
      }
    }

    fetchLocation()
  }, [])

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 40,
          fontSize: '16px'
        }}>
        {currentTime}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 25,
          left: 25
        }}>
        <img
          src="/GadjahDuduk.svg"
          alt="Logo"
          style={{
            width: '50px',
            height: '50px'
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          right: 40,
          fontSize: '16px'
        }}>
        {locationText}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 40,
          right: 40,
          fontSize: '16px'
        }}>
        UGD
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <>
    <App />
    <Overlay />
  </>
)
