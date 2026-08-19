import React, { useEffect } from 'react'
import './PrivacyPolicy.css'

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="privacy-page">
      <div className="container">
        <h1 className="page-title">Privacy Policy</h1>
        
        <div className="content-box">
          <section className="policy-section">
            <h2>1. Information We Collect</h2>
            <p>We collect personal information that you provide to us, such as name, address, contact information, passwords and security data, payment information, and social media login data. We also automatically collect certain information when you visit, use or navigate the site.</p>
          </section>

          <section className="policy-section">
            <h2>2. How We Use Your Information</h2>
            <p>We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
          </section>

          <section className="policy-section">
            <h2>3. Will Your Information Be Shared?</h2>
            <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may process or share your data that we hold based on the legal basis of legitimate interests.</p>
          </section>

          <section className="policy-section">
            <h2>4. Cookies and Tracking Technologies</h2>
            <p>We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Policy.</p>
          </section>

          <section className="policy-section">
            <h2>5. How Long Do We Keep Your Information?</h2>
            <p>We keep your information for as long as necessary to fulfill the purposes outlined in this privacy notice unless otherwise required by law. When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information.</p>
          </section>

          <section className="policy-section">
            <h2>6. How Do We Keep Your Information Safe?</h2>
            <p>We aim to protect your personal information through a system of organizational and technical security measures. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.</p>
          </section>

          <section className="policy-section">
            <h2>7. Contact Us</h2>
            <p>If you have questions or comments about this notice, you may email us or contact us by post at the address provided in our contact page.</p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
