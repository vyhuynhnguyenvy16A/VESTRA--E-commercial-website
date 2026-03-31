// src/pages/HomePage.jsx

import React from 'react';

// import Header from '../../components/Header.jsx'; 
import Hero from '../../components/HomePage/Hero.jsx';
import CategoryList from '../../components/HomePage/CategoryList.jsx'; // <-- Component mới
import FeaturedProductList from '../../components/HomePage/FeaturedProductList.jsx';
import Footer from '../../components/Footer.jsx'

function HomePage() {
  return (
    <div>
      <main>
        <Hero />   
        <CategoryList />    
        <FeaturedProductList />
        {/* <Footer /> */}
      </main>
    </div>
  );
}

export default HomePage;