import React from 'react'
import './VideoSection.css'

const VideoSection = () => {
  return (
    <section className="video-section">
      <div className="container">
        <div className="video-wrapper">
          <div className="video-placeholder placeholder-image">
            <div className="placeholder-text">
              <span className="placeholder-icon">🎥</span>
              Brand Video
            </div>
            <button className="video-play-btn" aria-label="Play video">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="24" fill="rgba(255,255,255,0.8)"/>
                <path d="M19 14l16 10-16 10V14z" fill="#2d5a27"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VideoSection
