import React, { useEffect } from 'react'
import '../TermsAndConditions/TermsAndConditions.css'

const RefundPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="terms-page">
      <div className="container">
        <h1 className="page-title">Return & Refund Policy</h1>
        
        <div className="content-box">
          <section className="policy-section">
            <h2>1. No Return Policy</h2>
            <p>Due to the nature of our products (Ayurvedic and herbal supplements) and for strict hygiene and safety standards, <strong>all items purchased from our website are strictly non-returnable and non-refundable</strong>.</p>
            <p>Please ensure you review your order carefully before completing the purchase.</p>
          </section>

          <section className="policy-section">
            <h2>2. Exchange of Wrong Product</h2>
            <p>We only accept requests for an exchange in the rare event that you receive an incorrect product that does not match your order invoice.</p>
            <p>If you receive the wrong product, please contact our customer support team within <strong>48 hours of delivery</strong>. You must provide clear photographic evidence of the incorrect item received along with your order details.</p>
          </section>

          <section className="policy-section">
            <h2>3. Damaged or Defective Items</h2>
            <p>If you receive a defective or damaged product during transit, please contact us within 48 hours of delivery with photographic evidence of the damage. We will investigate the issue and arrange for a replacement of the exact same item at no additional cost to you.</p>
          </section>

          <section className="policy-section">
            <h2>4. Exchange Process</h2>
            <p>Once your exchange request for a wrong or damaged item is approved, we will provide instructions on how to return the incorrect item. The item must be unused, sealed, and in its original packaging. Once we receive and verify the item, we will dispatch the correct replacement product.</p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default RefundPolicy
