import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import './WatchAndShop.css'

const WatchAndShop = () => {
  const scrollRef = useRef(null)

  const videos = [
    { name: 'She Care Juice', price: 541, originalPrice: 543, views: '16.3K', image: '/home-page-img/004ee39d-f838-4cc9-8c4e-a6d8aaba44dc.jpg' },
    { name: 'Diabic Care Juice', price: 457, originalPrice: 459, views: '13.8K', image: '/home-page-img/00993d27-94d5-4499-83aa-c650da60507c.jpg' },
    { name: 'Diabic Care Juice', price: 457, originalPrice: 459, views: '47.5K', image: '/home-page-img/07e8bc1a-f318-4943-842e-0db0bb4c80f2.jpg' },
    { name: 'Diabic Care Juice', price: 457, originalPrice: 459, views: '4.3K', image: '/home-page-img/18bd9185-df73-4a3a-b309-34e6e47f28d3.jpg' },
    { name: 'Diabic Care Juice', price: 457, originalPrice: 459, views: '34.9K', image: '/home-page-img/1adc7066-b8aa-4a6b-9ca5-2ee48b6b97c8.jpg' },
    { name: 'She Care Juice', price: 541, originalPrice: 543, views: '18.0K', image: '/home-page-img/2677ab69-59a4-4ce9-812b-3c9bc6426636.jpg' },
  ]

  return (
    <section className="watch-shop">
      <div className="container">
        <h2 className="watch-shop-title">Watch & Shop</h2>

          <div className="watch-shop-scroll" ref={scrollRef}>
            {videos.map((video, index) => (
              <Link to="/collections/all" key={index} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="watch-card">
                  <div className="watch-video">
                    <img src={video.image} alt="Video thumbnail" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
    </section>
  )
}

export default WatchAndShop
