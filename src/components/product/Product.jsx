// // import React, { useEffect, useState } from 'react';
// // import './img.css';
// // import { CONFIGS } from '../../../config';

// // function Product({ addToCart }) {
// //   const [products, setProducts] = useState([]);
// //   const [selectedPacks, setSelectedPacks] = useState({}); // Track selected packs for each product
// //   const [quantities, setQuantities] = useState({}); // Track quantities for each selected pack

// //   const fetchproducts = async () => {
// //     try {
// //       const response = await fetch(`${CONFIGS.API_BASE_URL}/viewproducts`, {
// //         method: 'GET',
// //       });
// //       if (!response.ok) {
// //         console.log('No products');
// //         return;
// //       }
// //       const data = await response.json();
// //       setProducts(data.message);
// //     } catch (error) {
// //       console.log('Error fetching products:', error);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchproducts();
// //   }, []);

// //   const handlePackChange = (productId, packIndex) => {
// //     setSelectedPacks(prevState => ({
// //       ...prevState,
// //       [productId]: packIndex
// //     }));
// //     setQuantities(prevState => ({
// //       ...prevState,
// //       [productId]: 1 // Reset quantity to 1 when a pack is selected
// //     }));
// //   };

// //   const handleQuantityChange = (productId, change) => {
// //     setQuantities(prevState => ({
// //       ...prevState,
// //       [productId]: Math.max(1, (prevState[productId] || 1) + change) // Ensure quantity is at least 1
// //     }));
// //   };

// //   const handleAddToCart = (product) => {
// //     const selectedPackIndex = selectedPacks[product._id];
// //     if (selectedPackIndex === undefined) {
// //       return;
// //     }
// //     const selectedPack = product.packs[selectedPackIndex];
// //     addToCart(product, selectedPack);
// //   };

// //   return (
// //     <div>
// //       <h2>Products</h2>
// //       {products.length > 0 ? (
// //         <div className="product-list">
// //           {products.map((product) => (
// //             <div key={product._id} className="product-item">
// //               <h3>{product.name}</h3>
// //               <p>{product.desc}</p>
// //               {product.discount > 0 && (
// //                 <p>Discount: {product.discount}%</p>
// //               )}
// //               {product.packs.map((pack, index) => (
// //                 <div key={index}>
// //                   <label>
// //                     <input
// //                       type="radio"
// //                       name={`pack-${product._id}`}
// //                       value={index}
// //                       checked={selectedPacks[product._id] === index}
// //                       onChange={() => handlePackChange(product._id, index)}
// //                     />
// //                     {pack.ml}ML * {pack.unit} - RS.{pack.price}
// //                   </label>
// //                 </div>
// //               ))}
// //               {selectedPacks[product._id] !== undefined && (
// //                 <div>
// //                   <button onClick={() => handleQuantityChange(product._id, -1)}>-</button>
// //                   <span>{quantities[product._id]}</span>
// //                   <button onClick={() => handleQuantityChange(product._id, 1)}>+</button>
// //                   <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
// //                 </div>
// //               )}
// //             </div>
// //           ))}
// //         </div>
// //       ) : (
// //         <p>No products available.</p>
// //       )}
// //     </div>
// //   );
// // }

// // export default Product;


// import React, { useEffect, useState } from 'react';
// import './img.css';
// import { CONFIGS } from '../../../config';

// function Product({ addToCart }) {
//   const [products, setProducts] = useState([]);
//   const [quantities, setQuantities] = useState({}); // Track quantities for each pack of each product

//   const fetchproducts = async () => {
//     try {
//       const response = await fetch(`${CONFIGS.API_BASE_URL}/viewproducts`, {
//         method: 'GET',
//       });
//       if (!response.ok) {
//         console.log('No products');
//         return;
//       }
//       const data = await response.json();
//       setProducts(data.message);
//     } catch (error) {
//       console.log('Error fetching products:', error);
//     }
//   };

//   useEffect(() => {
//     fetchproducts();
//   }, []);

//   const handlePackChange = (productId, packIndex) => {
//     setQuantities(prevState => ({
//       ...prevState,
//       [productId]: {
//         ...prevState[productId],
//         [packIndex]: (prevState[productId]?.[packIndex] || 1)
//       }
//     }));
//   };

//   const handleQuantityChange = (productId, packIndex, change) => {
//     setQuantities(prevState => ({
//       ...prevState,
//       [productId]: {
//         ...prevState[productId],
//         [packIndex]: Math.max(1, (prevState[productId]?.[packIndex] || 1) + change)
//       }
//     }));
//   };

//   const handleAddToCart = (product, packIndex) => {
//     const selectedPack = product.packs[packIndex];
//     const quantity = quantities[product._id]?.[packIndex] || 1;
//     addToCart(product, selectedPack, quantity);
//   };

//   return (
//     <div>
//       <h2>Products</h2>
//       {products.length > 0 ? (
//         <div className="product-list">
//           {products.map((product) => (
//             <div key={product._id} className="product-item">
//               <img src={product.image} alt="" height={350} width={200} />
//               <h3>{product.name}</h3>
//               <p>{product.desc}</p>
//               {product.discount > 0 && (
//                 <p>Discount: {product.discount}%</p>
//               )}
//               {product.packs.map((pack, index) => (
//                 <div key={index}>
//                   <label>
//                     <input
//                       type="radio"
//                       name={`pack-${product._id}`}
//                       value={index}
//                       onChange={() => handlePackChange(product._id, index)}
//                     />
//                     {pack.ml}ML * {pack.unit} - RS.{pack.price}
//                   </label>
//                   {quantities[product._id]?.[index] !== undefined && (
//                     <div>
//                       <button onClick={() => handleQuantityChange(product._id, index, -1)}>-</button>
//                       <span>{quantities[product._id][index]}</span>
//                       <button onClick={() => handleQuantityChange(product._id, index, 1)}>+</button>
//                       <button onClick={() => handleAddToCart(product, index)}>Add to Cart</button>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>No products available.</p>
//       )}
//     </div>
//   );
// }

// export default Product;


import React, { useEffect, useState } from 'react';
import './img.css'; // Update this to your CSS file path
import { CONFIGS } from '../../../config';

function Product({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});

  const fetchproducts = async () => {
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
    fetchproducts();
  }, []);

  const handlePackChange = (productId, packIndex) => {
    setQuantities(prevState => ({
      ...prevState,
      [productId]: {
        ...prevState[productId],
        [packIndex]: (prevState[productId]?.[packIndex] || 1)
      }
    }));
  };

  const handleQuantityChange = (productId, packIndex, change) => {
    setQuantities(prevState => ({
      ...prevState,
      [productId]: {
        ...prevState[productId],
        [packIndex]: Math.max(1, (prevState[productId]?.[packIndex] || 1) + change)
      }
    }));
  };

  const handleAddToCart = (product, packIndex) => {
    const selectedPack = product.packs[packIndex];
    const quantity = quantities[product._id]?.[packIndex] || 1;
    addToCart(product, selectedPack, quantity);
  };

  // Add event listener for mobile click
  useEffect(() => {
    const cards = document.querySelectorAll('.card');
    const handleClick = (event) => {
      const content = event.currentTarget.querySelector('.content2');
      if (window.innerWidth < 768) {
        content.style.opacity = content.style.opacity === '1' ? '0' : '1';
      }
    };
    cards.forEach(card => {
      card.addEventListener('click', handleClick);
    });
    return () => {
      cards.forEach(card => {
        card.removeEventListener('click', handleClick);
      });
    };
  }, []);

  return (
    <div id="products">
      <h2 className="text-center">Products</h2>
      {products.length > 0 ? (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card card">
              <div className="imgbox">
                <img src={product.image} alt="" className="img2" />
              </div>
              <div className="content2">
                <h3>{product.name}</h3>
                <p>{product.desc}</p>
                {product.discount > 0 && (
                  <p>Discount: {product.discount}%</p>
                )}
                {product.packs.map((pack, index) => (
                  <div key={index}>
                    <label>
                      <input
                        type="radio"
                        name={`pack-${product._id}`}
                        value={index}
                        onChange={() => handlePackChange(product._id, index)}
                      />
                      {pack.ml}ML * {pack.unit} - RS.{pack.price}
                    </label>
                    {quantities[product._id]?.[index] !== undefined && (
                      <div>
                        <button onClick={() => handleQuantityChange(product._id, index, -1)}>-</button>
                        <span>{quantities[product._id][index]}</span>
                        <button onClick={() => handleQuantityChange(product._id, index, 1)}>+</button>
                        <button onClick={() => handleAddToCart(product, index)}>Add to Cart</button>
                      </div>
                    )}
                  </div>
                ))}
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
