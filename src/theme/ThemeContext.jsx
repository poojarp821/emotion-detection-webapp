import React, { createContext, useEffect, useReducer, useCallback } from 'react'

const STORAGE_KEY = 'face-theme-state-v1'

const defaultThemes = {
  neutral: { '--bg': '#f7f7f7', '--fg': '#111', '--accent': '#4b5563' },
  happy: { '--bg': '#fff8e1', '--fg': '#3b3b00', '--accent': '#f59e0b' },
  sad: { '--bg': '#eef2ff', '--fg': '#03102b', '--accent': '#3b82f6' },
  angry: { '--bg': '#fff1f2', '--fg': '#3b0000', '--accent': '#ef4444' },
  surprised: { '--bg': '#f0fdf4', '--fg': '#053e25', '--accent': '#10b981' },
  disgusted: { '--bg': '#f7fff0', '--fg': '#12310a', '--accent': '#84cc16' },
  fearful: { '--bg': '#f8fafc', '--fg': '#0b1020', '--accent': '#7c3aed' }
}

const initialState = {
  themes: JSON.parse(localStorage.getItem(STORAGE_KEY))?.themes || defaultThemes,
  currentExpression: 'neutral',
  manualMode: false,
  manualTheme: 'neutral',
  history: [] // expression history managed by reducer
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_EXPRESSION': {
      const entry = { expression: action.payload, ts: Date.now() }
      const history = [entry, ...state.history].slice(0, 200)
      return { ...state, currentExpression: action.payload, history }
    }
    case 'UPDATE_THEME': {
      const { expression, values } = action.payload
      return { ...state, themes: { ...state.themes, [expression]: { ...state.themes[expression], ...values } } }
    }
    case 'SET_MANUAL':
      return { ...state, manualMode: action.payload }
    case 'SET_MANUAL_THEME':
      return { ...state, manualTheme: action.payload }
    case 'TOGGLE_MANUAL':
      return { ...state, manualMode: !state.manualMode }
    case 'LOAD_STATE':
      return { ...state, ...action.payload }
    case 'CLEAR_HISTORY':
      return { ...state, history: [] }
    default:
      return state
  }
}

export const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // persist
  useEffect(() => {
    const toStore = { themes: state.themes, manualMode: state.manualMode, manualTheme: state.manualTheme }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore))
  }, [state.themes, state.manualMode, state.manualTheme])

  // apply CSS vars
  const applyTheme = useCallback(() => {
    const active = state.manualMode ? state.manualTheme : state.currentExpression || 'neutral'
    const theme = state.themes[active] || state.themes.neutral
    if (!theme) return
    Object.entries(theme).forEach(([k, v]) => document.documentElement.style.setProperty(k, v))
    // set class for transitions and optional icons
    document.documentElement.dataset.activeTheme = active
  }, [state.manualMode, state.manualTheme, state.currentExpression, state.themes])

  useEffect(() => applyTheme(), [applyTheme])

  return (
    <ThemeContext.Provider value={{ state, dispatch }}>
      {children}
    </ThemeContext.Provider>
  )
}