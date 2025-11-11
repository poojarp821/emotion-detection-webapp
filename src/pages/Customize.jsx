import React, { useContext, useState } from 'react'
import { ThemeContext } from '../theme/ThemeContext'

export default function Customize() {
  const { state, dispatch } = useContext(ThemeContext)
  const [expr, setExpr] = useState(Object.keys(state.themes)[0])
  const theme = state.themes[expr]

  function setVar(name, val) {
    dispatch({ type: 'UPDATE_THEME', payload: { expression: expr, values: { [name]: val } } })
  }

  return (
    <div className="customize">
      <h2>Customize Theme</h2>
      <div className="customize-grid">
        <div className="left">
          <label>Expression</label>
          <select value={expr} onChange={e => setExpr(e.target.value)}>
            {Object.keys(state.themes).map(k => <option key={k} value={k}>{k}</option>)}
          </select>

          <div className="field">
            <label>Background</label>
            <input type="color" value={rgbToHex(theme['--bg'])} onChange={e => setVar('--bg', e.target.value)} />
          </div>

          <div className="field">
            <label>Foreground</label>
            <input type="color" value={rgbToHex(theme['--fg'])} onChange={e => setVar('--fg', e.target.value)} />
          </div>

          <div className="field">
            <label>Accent</label>
            <input type="color" value={rgbToHex(theme['--accent'])} onChange={e => setVar('--accent', e.target.value)} />
          </div>

          <div className="control-row">
            <button className="btn" onClick={() => dispatch({ type: 'LOAD_STATE', payload: { themes: state.themes } })}>Apply</button>
          </div>
        </div>

        <div className="preview-card">
          <h3>Preview</h3>
          <div className="preview-box">
            <p>Expression: {expr}</p>
            <button className="btn">Sample Button</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function rgbToHex(value) {
  if (!value) return '#000000'
  // assume already hex
  if (value.startsWith('#')) return value
  return '#000000'
}