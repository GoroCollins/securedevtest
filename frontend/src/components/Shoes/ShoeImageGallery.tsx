import React, { useState } from 'react';
import './Shoes.css'; // Create this CSS file for styling

interface ShoeImagesGalleryProps {
  images: { image: string }[];
}

const ShoeImagesGallery: React.FC<ShoeImagesGalleryProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="gallery-container">
      <button onClick={handlePrevClick} className="gallery-arrow">←</button>
      <img src={images[currentIndex]?.image} alt={`Shoe ${currentIndex}`} className="gallery-image" />
      <button onClick={handleNextClick} className="gallery-arrow">→</button>
    </div>
  );
};

export default ShoeImagesGallery;
