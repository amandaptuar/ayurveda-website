import React from 'react'
import { Helmet } from 'react-helmet-async'
import './Home.css'
import HeroBanner from '../../components/HeroBanner/HeroBanner'
import StatsBar from '../../components/StatsBar/StatsBar'
import TrustBanner from '../../components/TrustBanner/TrustBanner'
import ShopByConcern from '../../components/ShopByConcern/ShopByConcern'
import WatchAndShop from '../../components/WatchAndShop/WatchAndShop'
import Bestsellers from '../../components/Bestsellers/Bestsellers'
import ComboDeals from '../../components/ComboDeals/ComboDeals'
import Testimonials from '../../components/Testimonials/Testimonials'
import Blogs from '../../components/Blogs/Blogs'
import MediaLogos from '../../components/MediaLogos/MediaLogos'
import ConsultationBanner from '../../components/ConsultationBanner/ConsultationBanner'

const Home = () => {
  return (
    <div className="home-page">
      <Helmet>
        <title>FAIR DEAL TRADING AGENCY | Home</title>
        <meta name="description" content="Welcome to FAIR DEAL TRADING AGENCY. Shop the best authentic Ayurvedic products, juices, tablets, and powders for your daily wellness." />
      </Helmet>
      <HeroBanner />
      <StatsBar />
      <TrustBanner />
      <ShopByConcern />
      <WatchAndShop />
      <Bestsellers />
      <ComboDeals />
      <Testimonials />
      <Blogs />
      <MediaLogos />
      <ConsultationBanner />
    </div>
  )
}

export default Home
