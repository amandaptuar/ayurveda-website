import React from 'react'
import './StatsBar.css'

const StatsBar = () => {
  const stats = [
    { value: '50,000+', label: 'HAPPY CUSTOMERS' },
    { value: '200+', label: 'HERBAL PRODUCTS' },
    { value: '4.9★', label: 'AVG. RATING' },
  ]

  return (
    <section className="stats-bar">
      <div className="container stats-container">
        {stats.map((stat, index) => (
          <div key={index} className="stat-item">
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default StatsBar
