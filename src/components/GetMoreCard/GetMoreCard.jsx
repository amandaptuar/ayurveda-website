import React from 'react'
import { Link } from 'react-router-dom'
import './GetMoreCard.css'

const GetMoreCard = ({ linkTo = '/collections/all', label = 'Get More' }) => {
  return (
    <Link to={linkTo} className="get-more-card">
      <div className="get-more-content">
        <div className="get-more-icon-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="get-more-arrow">
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </div>
        <span className="get-more-label">{label}</span>
        <span className="get-more-sublabel">View All Products</span>
      </div>
    </Link>
  )
}

export default GetMoreCard
