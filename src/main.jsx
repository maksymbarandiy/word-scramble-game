import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import posthog from 'posthog-js'

// Ініціалізація PostHog
posthog.init('phc_boiNRUrhO7eoMHMH5XhISyXZg17fbCnL7mk7ioFETsj', {
  api_host: 'https://eu.i.posthog.com',
  person_profiles: 'identified_only' // або 'always' для всіх користувачів
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
