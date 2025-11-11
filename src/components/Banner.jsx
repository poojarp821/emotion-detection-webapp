import React from 'react'

export default function Banner({ expression }) {
  if (!expression) return null
  return (
    <div className={`banner banner-${expression}`} role="status">
      <div className="banner-inner">
        Detected: <strong>{expression}</strong>
      </div>
    </div>
  )
}
