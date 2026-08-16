import React, { useState, useEffect } from 'react'
import './HeroBanner.css'

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: 'FEEL LIGHT',
      subtitle: 'STAY ACTIVE',
      description: "Powered by Nature's Blend",
      cta: 'ORDER NOW',
      trustedBy: 'YASMIN KARACHIWALA',
      trustedTitle: 'Celebrity Fitness Expert',
      badge: '5 लाख+ लोगों का विश्वास और भरोसा',
      image: '/home-page-img/1adc7066-b8aa-4a6b-9ca5-2ee48b6b97c8.jpg'
    },
    {
      title: 'PURE HERBS',
      subtitle: 'REAL RESULTS',
      description: 'Authentic Ayurvedic Wellness',
      cta: 'SHOP NOW',
      trustedBy: 'DR. ARUN KUMAR',
      trustedTitle: 'Ayurvedic Expert',
      badge: '200+ Herbal Products',
      image: '/home-page-img/004ee39d-f838-4cc9-8c4e-a6d8aaba44dc.jpg'
    },
    {
      title: 'NATURAL CARE',
      subtitle: 'DAILY WELLNESS',
      description: 'Trusted by 1 Crore+ Customers',
      cta: 'EXPLORE',
      trustedBy: 'FAIR DEAL TRADING AGENCY',
      trustedTitle: 'Since 1932',
      badge: '4.9★ Average Rating',
      image: '/home-page-img/18bd9185-df73-4a3a-b309-34e6e47f28d3.jpg'
    },
    {
      title: 'HOLISTIC HEALTH',
      subtitle: 'FOR EVERYONE',
      description: 'Your Partner in Natural Healing',
      cta: 'DISCOVER',
      trustedBy: 'AYUSH CERTIFIED',
      trustedTitle: 'Premium Quality',
      badge: '100% Organic',
      image: '/home-page-img/00993d27-94d5-4499-83aa-c650da60507c.jpg'
    },
    {
      title: 'REVITALIZE',
      subtitle: 'YOUR BODY',
      description: 'Ancient Wisdom for Modern Lives',
      cta: 'GET STARTED',
      trustedBy: 'VEDIC EXPERTS',
      trustedTitle: 'Time-Tested Formulas',
      badge: 'Zero Side Effects',
      image: '/home-page-img/305705f2-4e5d-4795-916e-c686d47651af.jpg'
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section className="hero-banner">
      <div className="hero-slider">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
          >
            <div className="hero-slide-inner">
              <img src={slide.image} alt={slide.title} className="hero-full-image" />
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="container hero-dots-container">
        <div className="hero-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroBanner
