import React from 'react'
import './ComboDeals.css'

const ComboDeals = () => {
  const combos = [
    {
      title: 'Acidity Care Juice 1000 ml | Amla Juice 1000 ml',
      desc: '',
      save: '4%',
      price: 663,
      originalPrice: 693,
    },
    {
      title: 'Acidity Care Juice 1000 ml | Bael Juice 1000 ml',
      desc: 'Provides Relief from Acidity & Bloating | Sugar Free Bael Juice for improve gut health & digestion',
      save: '3%',
      price: 869,
      originalPrice: 899,
    },
    {
      title: 'Acidity Care Juice 1000 ml | Diabic Care Juice 1000 ml',
      desc: 'Relief for acidity, bloating | Manage Blood sugar levels',
      save: '3%',
      price: 907,
      originalPrice: 937,
    },
    {
      title: 'Aloe Vera Juice 1000 ml | Amla Juice 1000 ml | Aloe Vera Gel 250 gm',
      desc: 'Skin Wellness Combo | Enriched of Amla and Aloe Vera',
      save: '5%',
      price: 629,
      originalPrice: 659,
    },
  ]

  return (
    <section className="combo-deals">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              Combo <span>Deals</span>
            </h2>
            <p className="section-subtitle">Better together — save more</p>
          </div>
          <button className="view-all-btn">View All →</button>
        </div>

        <div className="combo-grid">
          {combos.map((combo, index) => (
            <div key={index} className="combo-card">
              <div className="combo-image placeholder-image" style={{ width: 80, height: 80, borderRadius: 8, flexShrink: 0 }}>
                <div className="placeholder-text" style={{ fontSize: '0.5rem' }}>📦</div>
              </div>
              <div className="combo-info">
                <span className="combo-save">SAVE {combo.save}</span>
                <h3 className="combo-title">{combo.title}</h3>
                {combo.desc && <p className="combo-desc">{combo.desc}</p>}
                <div className="price-group" style={{ marginTop: 8 }}>
                  <span className="price-current">₹{combo.price}</span>
                  <span className="price-original">₹{combo.originalPrice}</span>
                </div>
              </div>
              <button className="combo-shop-btn">Shop combo →</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ComboDeals
