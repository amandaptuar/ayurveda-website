import React, { useEffect } from 'react'
import './TermsAndConditions.css'

const TermsAndConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="terms-page">
      <div className="container">
        <h1 className="page-title">Terms & Conditions</h1>
        
        <div className="content-box">
          <section className="policy-section">
            <h2>1. Introduction</h2>
            <p>Welcome to FAIR DEAL TRADING AGENCY. By accessing this website and purchasing our products, you agree to be bound by these Terms and Conditions and our Privacy Policy.</p>
          </section>

          <section className="policy-section">
            <h2>2. Products and Services</h2>
            <p>We sell Ayurvedic and herbal products. All products are subject to availability, and we reserve the right to limit the quantities of any products that we offer. Product descriptions and pricing are subject to change without notice.</p>
          </section>

          <section className="policy-section">
            <h2>3. Orders and Payments</h2>
            <p>By placing an order, you agree to provide current, complete, and accurate purchase and account information. We accept various forms of payment as indicated on the checkout page.</p>
          </section>

          <section className="policy-section">
            <h2>4. Shipping and Delivery</h2>
            <p>We aim to process and ship orders promptly. Delivery times may vary depending on your location and other factors beyond our control. We are not responsible for delays caused by the shipping carrier.</p>
          </section>

          <section className="policy-section">
            <h2>5. Returns and Refunds</h2>
            <p>Our return and refund policy is outlined separately. Please refer to our return policy page for detailed information on how to return products and request refunds.</p>
          </section>

          <section className="policy-section">
            <h2>6. User Conduct</h2>
            <p>You agree not to use the website for any unlawful purpose or any purpose prohibited under this clause. You agree not to use the website in any way that could damage the website, the services, or the general business of FAIR DEAL TRADING AGENCY.</p>
          </section>

          <section className="policy-section">
            <h2>7. Changes to Terms</h2>
            <p>We reserve the right to update or modify these Terms and Conditions at any time without prior notice. Your continued use of the website following any changes constitutes your acceptance of the new Terms and Conditions.</p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default TermsAndConditions
