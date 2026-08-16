import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import TopBar from './components/TopBar/TopBar'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import Product from './pages/Product/Product'
import Collections from './pages/Collections/Collections'
import Contact from './pages/Contact/Contact'
import Cart from './pages/Cart/Cart'

function App() {
  return (
    <div className="app">
      <TopBar />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id" element={<Product />} />
          <Route path="/collections/all" element={<Collections />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>
      <Footer />

      {/* WhatsApp Floating Button */}
      <a href="https://wa.me/917088711540" className="whatsapp-float" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
        <svg viewBox="0 0 24 24" className="whatsapp-icon" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 001.333 4.993L2 22l5.233-1.371a9.993 9.993 0 004.779 1.216h.004c5.502 0 9.985-4.48 9.985-9.984C21.996 6.478 17.513 2 12.012 2z" fill="#25D366"/>
          <path d="M17.472 14.38c-.274-.137-1.623-.8-1.874-.892-.251-.091-.434-.137-.617.137-.183.274-.71 .891-.87 1.074-.16.183-.321.205-.595.068-.274-.137-1.157-.426-2.203-1.358-.813-.726-1.36-1.624-1.52-1.898-.16-.274-.017-.423.12-.56.124-.124.274-.32.41-.48.138-.16.184-.274.276-.456.091-.183.045-.343-.023-.48-.069-.137-.617-1.486-.845-2.033-.222-.533-.448-.46-.617-.468-.16-.008-.342-.01-.525-.01-.183 0-.48.069-.731.343-.251.274-.96 .937-.96 2.285 0 1.348.983 2.651 1.12 2.834.137.183 1.933 2.949 4.678 4.133.652.282 1.162.451 1.558.577.654.208 1.25.178 1.718.108.528-.079 1.623-.663 1.851-1.303.228-.641.228-1.19.16-1.304-.069-.115-.251-.183-.525-.32z" fill="#FFF"/>
        </svg>
      </a>
    </div>
  )
}

export default App
