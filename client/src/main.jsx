import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const fallbackShot = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&h=675&q=70'
window.addEventListener('error', (event) => {
  const img = event.target
  if (!(img instanceof HTMLImageElement) || img.dataset.fallback) return
  img.dataset.fallback = '1'
  img.referrerPolicy = 'no-referrer'
  img.src = fallbackShot
}, true)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
