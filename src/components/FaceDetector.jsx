import React, { useEffect, useRef, useContext, useCallback, useMemo } from 'react'
import * as faceapi from 'face-api.js'
import { ThemeContext } from '../theme/ThemeContext'
import Banner from './Banner'

// small throttle helper
function throttle(fn, wait) {
  let last = 0
  return (...args) => {
    const now = Date.now()
    if (now - last >= wait) {
      last = now
      fn(...args)
    }
  }
}

export default function FaceDetector() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const { state, dispatch } = useContext(ThemeContext)

  // load models once
  useEffect(() => {
    let cancelled = false
    async function load() {
      const modelPath = '/models'
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(modelPath),
        faceapi.nets.faceExpressionNet.loadFromUri(modelPath)
      ])
      if (!cancelled) startVideo()
    }
    load()
    return () => (cancelled = true)
  }, [])

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      if (videoRef.current) videoRef.current.srcObject = stream
    }).catch((err) => {
      // silent fail; user can use manual fallback
      console.log(err);
      
    })
  }

  // detection loop
  const detect = useCallback(async () => {
    if (!videoRef.current || videoRef.current.readyState < 2) return
    const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 160, scoreThreshold: 0.5 })
    const result = await faceapi.detectSingleFace(videoRef.current, options).withFaceExpressions()
    const ctx = canvasRef.current?.getContext('2d')
    if (canvasRef.current && videoRef.current) {
      canvasRef.current.width = videoRef.current.videoWidth
      canvasRef.current.height = videoRef.current.videoHeight
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }
    if (result) {
      const expressions = result.expressions
      let top = 'neutral'
      let topVal = 0
      Object.entries(expressions).forEach(([k, v]) => { if (v > topVal) { top = k; topVal = v } })
      // dispatch expression
      dispatch({ type: 'SET_EXPRESSION', payload: top })
      // draw box
      const resized = result.forSize(canvasRef.current.width, canvasRef.current.height)
      faceapi.draw.drawDetections(canvasRef.current, resized)
      faceapi.draw.drawFaceExpressions(canvasRef.current, resized)
    }
  }, [dispatch])

  // memoized throttled detect
  const throttledDetect = useMemo(() => throttle(detect, 300), [detect])

  useEffect(() => {
    let rafId = null
    function loop() {
      throttledDetect()
      rafId = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(rafId)
  }, [throttledDetect])

  return (
    <section className="face-section">
      <Banner expression={state.currentExpression} />

      <div className="detector">
        <div className="video-wrap" aria-live="polite">
          {!state.cameraReady && <div className="loader">Starting camera...</div>}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`video ${state.cameraReady ? 'visible' : 'hidden'}`}
        />
          <canvas ref={canvasRef} className="overlay" />
        </div>

        <aside className="controls">
          <h3>Current: <span className="expr">{state.currentExpression}</span></h3>
          <div className="history">
            <h4>History</h4>
            <ul>
              {state.history.slice(0, 10).map((h, i) => (
                <li key={h.ts}>{new Date(h.ts).toLocaleTimeString()} — {h.expression}</li>
              ))}
            </ul>
            <div className="control-row">
              <button className="btn" onClick={() => dispatch({ type: 'CLEAR_HISTORY' })}>Clear</button>
              <button
                className="btn"
                onClick={() => dispatch({ type: 'SET_MANUAL', payload: !state.manualMode })}
              >Toggle Manual</button>
            </div>

            <div className="manual-switcher">
              <label>Manual Theme</label>
              <select value={state.manualTheme} onChange={e => dispatch({ type: 'SET_MANUAL_THEME', payload: e.target.value })}>
                {Object.keys(state.themes).map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}