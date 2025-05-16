import React, { useEffect, useState } from "react";
import "./CSS/product.css";
import "./CSS/slideshow.css";
import { Header, Footer } from "./header_footer";
import products from "./Product_List";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {setCurrentSlide((prev) => (prev + 1) % 5);}, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const uniqueCategories = [...new Set(products.map((product) => product.category)),];
    setCategories(uniqueCategories);
  }, []);

  const handlePrev = () => {setCurrentSlide((prev) => (prev - 1 + 5) % 5);};
  const handleNext = () => {setCurrentSlide((prev) => (prev + 1) % 5);};

  return (
    <div>
      <Header />

      <div className="slideshow-container">
        {[1, 2, 3, 4, 5].map((num, index) => (
          <div key={num} className="mySlides fade" style={{ display: currentSlide === index ? "block" : "none" }}> <img src={`/assets/Discounts/Discount${num}.jpeg`} alt={`Slide ${num}`} /> </div>
        ))}
        <button className="prev" onClick={handlePrev}> &#10094; </button>
        <button className="next" onClick={handleNext}> &#10095; </button>
      </div>

      <div id="category" className="section slideShowSection">
        <h1>Our Categories</h1>
        <div id="category-list" className="product-container">
          {categories.map((category) => (
            <div className="product-card slideShowCard" key={category} onClick={() => navigate(`/Products?category=${encodeURIComponent(category)}`)}> 
              <img src={`/assets/Categories/${category}.jpeg`} alt={category} />
              <div className="category-content">
                <h3>{category}</h3>
                <p>Explore our wide range of {category} products.</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
