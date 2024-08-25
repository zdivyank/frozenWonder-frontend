import React, { useEffect, useState } from 'react';
import './product.css';
import { CONFIGS } from '../../../config';
import { IoMdCart } from 'react-icons/io';
import { motion } from 'framer-motion';

function Product({ addToCart, cart = [] }) {
  const [products, setProducts] = useState([]);
  const [productColors, setProductColors] = useState({});
  const [openProductId, setOpenProductId] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/viewproducts`, {
        method: 'GET',
      });
      if (!response.ok) {
        console.log('No products');
        return;
      }
      const data = await response.json();
      setProducts(data.message);
    } catch (error) {
      console.log('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    products.forEach(product => {
      getColorFromImageCenter(product.image, product._id);
    });
  }, [products]);

  const getColorFromImageCenter = (imageUrl, productId) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      const centerX = Math.floor(img.width / 2);
      const centerY = Math.floor(img.height / 2);
      const pixelData = ctx.getImageData(centerX, centerY, 1, 1).data;

      const color = `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
      setProductColors(prev => ({
        ...prev,
        [productId]: color
      }));
    };
  };

  const getAvailableQuantity = (product, packIndex) => {
    return product.packs[packIndex].inventory;
  };

  const isProductInCart = (productId) => {
    return cart.some(item => item.product._id === productId);
  };

  const handleAddToCart = (product, packIndex) => {
    if (isProductInCart(product._id)) {
      return; // Do nothing if the product is already in the cart
    }
    const quantity = 1; // Set quantity to 1 by default
    addToCart(product, packIndex, quantity);
  };

  const toggleProductCard = (productId) => {
    setOpenProductId(prevId => (prevId === productId ? null : productId));
  };

  return (
  <>

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#F4E869" fill-opacity="1" d="M0,32L40,48C80,64,160,96,240,133.3C320,171,400,213,480,197.3C560,181,640,107,720,80C800,53,880,75,960,96C1040,117,1120,139,1200,133.3C1280,128,1360,96,1400,80L1440,64L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path></svg>
    <div className='product_container' id='products'>
      <h1 className='text-center'>Claim Yor gift</h1>
      {products.length > 0 ? (
        <div className="product-list">
          {products.map((product) => (
            <div 
            key={product._id} 
            className={`product-item ${openProductId === product._id ? '' : 'open'}`}
            style={{"--product-color": productColors[product._id] || 'transparent'}}
              onClick={() => toggleProductCard(product._id)}
            >
              <motion.div
                whileTap={{
                  scale: 1.1,
                  rotate: 2,
                }}
                transition={{ duration: 0.1 }}
                >
                <img src={product.image} alt={product.name} />
              </motion.div>
              <div className={`content ${openProductId === product._id ? 'show' : 'hide'}`}>
                <h3>{product.name}</h3>
                <p>{product.desc}</p>
                {product.discount > 0 && <p>Discount: {product.discount}%</p>}

                <div className="pack-group">
                  {product.packs.map((pack, index) => (
                    <div key={index} className="pack-item">
                      
                      
                      {
                        /*
                        <p>{pack.ml}ML * {pack.unit} - RS.{pack.price}</p>
*/
                      }
                      <p className="stock-info text-danger">
                        {getAvailableQuantity(product, index) === 0 
                          ? 'Out of Stock'
                          : getAvailableQuantity(product, index) <= 10
                            ? `Hurry up! Only ${getAvailableQuantity(product, index)} left in stock!`
                            : null}
                      </p>
                      {getAvailableQuantity(product, index) > 0 && (
                        <div className="quantity-controls">
                          {/* Commented out quantity selection controls */}
                          {/* <button 
                            className='btn btn-dark me-3' 
                            onClick={() => handleQuantityChange(product._id, index, -1)}
                            disabled={!quantities[product._id]?.[index]}
                            >
                            -
                            </button>
                            <span>{quantities[product._id]?.[index] || 0}</span>
                            <button 
                            className='btn btn-dark m-3' 
                            onClick={() => handleQuantityChange(product._id, index, 1)}
                            disabled={quantities[product._id]?.[index] >= getAvailableQuantity(product, index)}
                          >
                          +
                          </button> */}
                          <button 
                            className='btn btn-dark mb-3' 
                            onClick={() => handleAddToCart(product, index)}
                            disabled={isProductInCart(product._id)}
                            >
                            <IoMdCart />
                            {isProductInCart(product._id) ? 'Added to Cart' : 'Add to Cart'}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No products available.</p>
      )}
    </div>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#f4e869" fill-opacity="1" d="M0,160L48,181.3C96,203,192,245,288,229.3C384,213,480,139,576,117.3C672,96,768,128,864,133.3C960,139,1056,117,1152,122.7C1248,128,1344,160,1392,176L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path></svg>
      {/* <hr /> */}
      </>
  );
}

export default Product;
