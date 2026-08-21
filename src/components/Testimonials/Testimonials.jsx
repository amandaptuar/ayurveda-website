import React, { useState, useEffect } from 'react'
import profile1 from '../../assets/profile1.jpg'
import profile2 from '../../assets/profile2.jpg'
import profile3 from '../../assets/profile3.jpg'
import profile4 from '../../assets/profile4.jpg'
import profile5 from '../../assets/profile5.jpg'
import './Testimonials.css'

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(2)

  const testimonials = [
    {
      name: 'Priya Sharma',
      text: '"I have been using Fair Deal\'s Live Kare DS Syrup for over a year now. The quality is outstanding and I can feel the difference in my health. It is pure and effective."',
      image: profile1,
      rating: 5,
    },
    {
      name: 'Rahul Kumar',
      text: '"Very authentic FT. Dhatu Paushtic Churn. The shipping was fast and the packaging was excellent. Highly recommend to anyone looking for genuine Ayurveda."',
      image: profile2,
      rating: 5,
    },
    {
      name: 'Vikram Singh',
      text: '"I started using Live Kare DS Syrup a few months ago and have noticed a positive difference in my overall well-being. It has become a part of my daily routine, and I feel more active and comfortable than before."',
      image: profile3,
      rating: 5,
    },
    {
      name: 'Deepti Sharma',
      text: '"I have ordered Cyst O Zero Syrup and Capsule for me, too much satisfied with this product and now I use it regularly..thank you Fair Deal Trading Agency for giving us such a nice product..."',
      image: profile4,
      rating: 5,
    },
    {
      name: 'Deepak Singhania',
      text: '"The FT. Dhatu Paushtic Churn has helped me maintain healthy body function. It tastes natural and has no artificial additives. Very satisfied with the results."',
      image: profile5,
      rating: 5,
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  return (
    <section className="testimonials">
      <div className="container">
        <h2 className="testimonials-heading">Over 50,000+ People Uses</h2>
        <p className="testimonials-subtext">
          Empowering healthier lives through authentic Ayurvedic care, thoughtfully<br />
          crafted to support your daily wellness journey.
        </p>

        {/* Avatar Row */}
        <div className="testimonial-avatars-container">
          <div 
            className="testimonial-avatars"
            style={{ '--active-index': activeIndex }}
          >
            {testimonials.map((t, index) => (
              <button
                key={index}
                className={`testimonial-avatar ${index === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`View testimonial from ${t.name}`}
              >
                <div className="avatar-circle">
                  <img src={t.image} alt={t.name} className="avatar-img" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Active Testimonial */}
        <div className="testimonial-content">
          <p className="testimonial-text">{testimonials[activeIndex].text}</p>
          <span className="testimonial-name">{testimonials[activeIndex].name}</span>
        </div>

        {/* Indicators */}
        <div className="testimonial-indicators">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`testimonial-indicator ${index === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
