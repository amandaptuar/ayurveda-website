import React, { useEffect } from 'react'
import '../TermsAndConditions/TermsAndConditions.css' // Reusing the same CSS

const Disclaimer = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="terms-page">
      <div className="container">
        <h1 className="page-title">Disclaimer</h1>
        
        <div className="content-box">
          <section className="policy-section">
            <h2>1. General Information</h2>
            <p>The information provided by FAIR DEAL TRADING AGENCY on our website is for general informational purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.</p>
          </section>

          <section className="policy-section">
            <h2>2. Medical Disclaimer</h2>
            <p>The content of our website, including text, graphics, images, and other materials, is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
            <p>Never disregard professional medical advice or delay in seeking it because of something you have read on this website. Our Ayurvedic and herbal products are designed to support general wellness and should not be used to treat, cure, or prevent any severe medical conditions without consulting a healthcare professional.</p>
          </section>

          <section className="policy-section">
            <h2>3. Product Results</h2>
            <p>Individual results from using our products may vary. Testimonials or reviews found on our site are unverified results that have been forwarded to us by users of our products, and may not reflect the typical purchaser's experience, may not apply to the average person, and are not intended to represent or guarantee that anyone will achieve the same or similar results.</p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Disclaimer
