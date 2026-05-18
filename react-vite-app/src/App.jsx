import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', color: 'white', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
        <img src={viteLogo} alt="Vite logo" style={{ height: '80px' }} />
        <img src={reactLogo} alt="React logo" style={{ height: '80px', animation: 'spin 4s linear infinite' }} />
      </div>
      <h1 style={{ fontSize: '3rem', margin: '0.5rem 0' }}>Hello World!</h1>
      <p style={{ fontSize: '1.4rem', opacity: 0.8, margin: '0.5rem 0' }}>SWEN 661 - React + Vite App</p>
      <p style={{ fontSize: '1.1rem', opacity: 0.6, margin: '0.5rem 0' }}>Team 3</p>
      <button
        type="button"
        onClick={() => setCount((count) => count + 1)}
        style={{ marginTop: '2rem', padding: '0.8rem 2rem', fontSize: '1.1rem', borderRadius: '8px', border: 'none', background: '#646cff', color: 'white', cursor: 'pointer' }}
      >
        Count is {count}
      </button>
    </div>
  )
}

export default App
