import React, { useEffect, useState } from 'react';
import './product.css';
import { CONFIGS } from '../../../config';
import { IoMdCart } from 'react-icons/io';
import { motion } from 'framer-motion';

function Product({ addToCart, cart = [] }) {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
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

  const handleQuantityChange = (productId, packIndex, change) => {
    setQuantities(prevState => {
      const currentQuantity = prevState[productId]?.[packIndex] || 0;
      const product = products.find(p => p._id === productId);
      const availableQuantity = getAvailableQuantity(product, packIndex);
      const newQuantity = Math.max(0, Math.min(currentQuantity + change, availableQuantity));
      return {
        ...prevState,
        [productId]: {
          ...prevState[productId],
          [packIndex]: newQuantity
        }
      };
    });
  };

  const handleAddToCart = (product, packIndex) => {
    const quantity = quantities[product._id]?.[packIndex] || 0;
    if (quantity > 0) {
      addToCart(product, packIndex, quantity);

      // Reset quantity to 0 after adding to cart
      setQuantities(prevState => ({
        ...prevState,
        [product._id]: {
          ...prevState[product._id],
          [packIndex]: 0
        }
      }));
    }
  };

  const toggleProductCard = (productId) => {
    setOpenProductId(prevId => (prevId === productId ? null : productId));
  };

  return (
    <div className='product_container' id='products'>
      <h1 className='text-center'>Products</h1>
      {products.length > 0 ? (
        <div className="product-list">
          {products.map((product) => (
            <div 
              key={product._id} 
              className={`product-item ${openProductId === product._id ? 'open' : ''}`}
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
                      <p>{pack.ml}ML * {pack.unit} - RS.{pack.price}</p>
                      <p className="stock-info text-danger">
                        {getAvailableQuantity(product, index) === 0 
                          ? 'Out of Stock'
                          : getAvailableQuantity(product, index) <= 10
                            ? `Hurry up! Only ${getAvailableQuantity(product, index)} left in stock!`
                            : null}
                      </p>
                      {getAvailableQuantity(product, index) > 0 && (
                        <div className="quantity-controls">
                          <button 
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
                          </button>
                          <button 
                            className='btn btn-dark mb-3' 
                            onClick={() => handleAddToCart(product, index)}
                            disabled={!quantities[product._id]?.[index]}
                          >
                            <IoMdCart />
                            Add to Cart
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
  );
}

export default Product;
