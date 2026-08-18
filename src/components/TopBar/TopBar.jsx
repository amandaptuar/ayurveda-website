import React from 'react'
import './TopBar.css'

const TopBar = () => {
  const message = "Beware of fake calls offering schemes and asking for money. We never request payments on call."

  return (
    <div className="top-bar">
      <div className="marquee-container">
        <div className="marquee-content">
          <span className="top-bar-text">{message}</span>
          <span className="top-bar-text" aria-hidden="true">{message}</span>
          <span className="top-bar-text" aria-hidden="true">{message}</span>
          <span className="top-bar-text" aria-hidden="true">{message}</span>
        </div>
      </div>
    </div>
  )
}

export default TopBar
