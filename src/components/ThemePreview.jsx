import React, { useContext } from 'react'
import { ThemeContext } from '../theme/ThemeContext'

export default function ThemePreview() {
  const { state } = useContext(ThemeContext)
  const active = state.manualMode ? state.manualTheme : state.currentExpression
  return (
    <div className="theme-preview" title={`Active: ${active}`}>
      <span className="dot" /> {active}
    </div>
  )
}