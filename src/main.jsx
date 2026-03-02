import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: '#fff5f9',
          color: '#3d1f1d',
          border: '1px solid #f5d5e0',
          borderRadius: '50px',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '0.9rem',
          boxShadow: '0 4px 20px rgba(232, 120, 158, 0.2)',
        },
        success: {
          iconTheme: {
            primary: '#e8789e',
            secondary: '#fff',
          },
        },
      }}
    />
  </StrictMode>
)