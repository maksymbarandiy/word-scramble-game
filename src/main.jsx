import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import posthog from 'posthog-js'
import * as Sentry from '@sentry/react'

// Ініціалізація PostHog
posthog.init('phc_boiNRUrhO7eoMHMH5XhISyXZg17fbCnL7mk7ioFETsj', {
  api_host: 'https://eu.i.posthog.com',
  person_profiles: 'identified_only' // або 'always' для всіх користувачів
})

// Ініціалізація Sentry
Sentry.init({
  dsn: "https://5993f427a497e0693f5d1de731e70cf2@o4511098926399488.ingest.de.sentry.io/4511098940227664",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  environment: 'development',
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
