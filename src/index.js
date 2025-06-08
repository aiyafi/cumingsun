import { createRoot } from 'react-dom/client'
import { Suspense, useState, useEffect } from 'react'
import './styles.css'
import { App } from './App'
import { Loader } from './Loader'

function Overlay() {
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    })
  )

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

  const currentDate = new Date().toLocaleDateString('en-GB')

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
        {currentDate}
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
    <Suspense fallback={<Loader />}>
      <App />
      <Overlay />
    </Suspense>
  </>
)
