import React from 'react';
import { Link } from 'react-router-dom';
import './Item.css';

// Define prop types
interface ItemProps {
  id: string | number;  // Assuming id can be a string or number
  image: string;
  name: string;
  new_price: number;
  old_price: number;
}

export const Item: React.FC<ItemProps> = ({ id, image, name, new_price, old_price }) => {
  // Scroll to top when the image is clicked
  const handleImageClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div className="item">
      <Link to={`/product/${id}`}>
        <img 
          onClick={handleImageClick} 
          src={image} 
          alt={name} 
        />
      </Link>
      <p>{name}</p>
      <div className="item-prices">
        <div className="item-price-new">
          ₹{new_price}
        </div>
        <div className="item-price-old">
          ₹{old_price}
        </div>
      </div>
    </div>
  );
};
