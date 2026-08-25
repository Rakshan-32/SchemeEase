import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { PrintProvider } from './PrintContext'
import ErrorBoundary from './ErrorBoundary'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <PrintProvider>
          <App />
        </PrintProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>,
)
