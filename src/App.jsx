import React, { Suspense, lazy, useContext } from 'react'
import { Routes, Route, Link } from 'react-router'
import FaceDetector from './components/FaceDetector'
import { ThemeContext } from './theme/ThemeContext'
import ThemePreview from './components/ThemePreview'

const Customize = lazy(() => import('./pages/Customize'))

export default function App() {
  const { state, dispatch } = useContext(ThemeContext)

  return (
    <div className={`app root-theme ${state.currentThemeClass || ''}`}>
      <nav className="nav">
        <div className="brand">Face Theme</div>
        <div className="nav-actions">
          <ThemePreview />
          <Link to="/customize" className="btn link">Customize Theme</Link>
          <button
            className="btn"
            onClick={() => dispatch({ type: 'TOGGLE_MANUAL' })}
            title="Manual theme fallback"
          >
            Manual: {state.manualMode ? 'On' : 'Off'}
          </button>
        </div>
      </nav>

      <main className="main">
        <Suspense fallback={<div className="loader">Loading customize UI...</div>}>
          <Routes>
            <Route path="/" element={<FaceDetector />} />
            <Route path="/customize" element={<Customize />} />
          </Routes>
        </Suspense>
      </main>

      <footer className="footer">Built with face-api.js and React hooks</footer>
    </div>
  )
}