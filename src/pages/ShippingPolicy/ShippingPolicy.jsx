import React, { useEffect } from 'react'
import '../TermsAndConditions/TermsAndConditions.css'

const ShippingPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="terms-page">
      <div className="container">
        <h1 className="page-title">Shipping Policy</h1>
        
        <div className="content-box">
          <section className="policy-section">
            <h2>1. Order Processing Time</h2>
            <p>All orders are processed within 1-2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.</p>
          </section>

          <section className="policy-section">
            <h2>2. Domestic Shipping Rates and Estimates</h2>
            <p>Shipping charges for your order will be calculated and displayed at checkout. We offer Free Delivery on all orders above ₹399. For orders below ₹399, a standard delivery fee will apply.</p>
            <p>Estimated delivery time within India is generally 3-7 business days depending on the destination state and pin code.</p>
          </section>

          <section className="policy-section">
            <h2>3. Order Tracking</h2>
            <p>When your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 24 hours for the tracking information to become available.</p>
          </section>

          <section className="policy-section">
            <h2>4. Undeliverable Packages</h2>
            <p>If a package is returned to us because the address provided was incorrect or the package was unclaimed, we will contact you to arrange for reshipment. Additional shipping charges may apply for reshipping orders returned due to incorrect addresses.</p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ShippingPolicy
