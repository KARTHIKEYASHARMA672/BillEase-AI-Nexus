import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

try {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <GoogleOAuthProvider clientId={CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </React.StrictMode>,
  )
} catch (error) {
  document.body.innerHTML = `
    <div style="background: #1a1a1a; color: #ff4d4d; padding: 20px; font-family: monospace;">
      <h1>Application Error</h1>
      <pre>${error.stack}</pre>
    </div>
  `;
}
