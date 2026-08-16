import React from 'react'
import './Blogs.css'

const Blogs = () => {
  const blogs = [
    {
      category: 'Immunity Wellness',
      title: 'What are the Benefits of Freshoeaze Powder',
      excerpt: 'Have you ever grabbed a spoonful of sugar-coated fennel seeds and cardamom while walking out of a restaurant?',
      trending: true,
      image: '/blog-img/blog1.jpg'
    },
    {
      category: 'Immunity Wellness',
      title: 'Catch It Early: 9 Signs You Might Have Type 2 Diabetes',
      excerpt: 'Diabetes is a lifelong condition that requires regular monitoring of blood glucose levels to make sure they are stable..',
      trending: false,
      image: '/blog-img/blog2.jpg'
    },
    {
      category: 'Immunity Wellness',
      title: 'Seasonal Immunity: Ayurvedic Rules to Stay Strong All Year',
      excerpt: 'Have you noticed how you feel perfectly fine one week... and the next week, as soon as the season shifts...',
      trending: false,
      image: '/blog-img/blog3.jpg'
    },
  ]

  return (
    <section className="blogs">
      <div className="container">
        <h2 className="blogs-title">Blogs</h2>

        <div className="blogs-grid">
          {blogs.map((blog, index) => (
            <div key={index} className="blog-card">
              <div className="blog-image">
                <img src={blog.image} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {blog.trending && <span className="blog-trending-badge">Trending</span>}
              </div>
              <div className="blog-content">
                <span className="blog-category">{blog.category}</span>
                <h3 className="blog-title">{blog.title}</h3>
                <p className="blog-excerpt">{blog.excerpt}</p>
                <div className="blog-footer">
                  <a href="#" className="read-more">Read Full Article <span className="arrow">→</span></a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Blogs
