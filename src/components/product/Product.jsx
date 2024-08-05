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


// import React, { useEffect, useState } from 'react';
// import './img.css'; // Update this to your CSS file path
// import { CONFIGS } from '../../../config';

// function Product({ addToCart }) {
//   const [products, setProducts] = useState([]);
//   const [quantities, setQuantities] = useState({});

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

//   // Add event listener for mobile click
//   useEffect(() => {
//     const cards = document.querySelectorAll('.card');
//     const handleClick = (event) => {
//       const content = event.currentTarget.querySelector('.content2');
//       if (window.innerWidth < 768) {
//         content.style.opacity = content.style.opacity === '1' ? '0' : '1';
//       }
//     };
//     cards.forEach(card => {
//       card.addEventListener('click', handleClick);
//     });
//     return () => {
//       cards.forEach(card => {
//         card.removeEventListener('click', handleClick);
//       });
//     };
//   }, []);

//   return (
//     <div id="products">
//       <h2 className="text-center">Products</h2>
//       {products.length > 0 ? (
//         <div className="product-grid">
//           {products.map((product) => (
//             <div key={product._id} className="product-card card">
//               <div className="imgbox">
//                 <img src={product.image} alt="" className="img2" />
//               </div>
//               <div className="content2">
//                 <h3>{product.name}</h3>
//                 <p>{product.desc}</p>
//                 {product.discount > 0 && (
//                   <p>Discount: {product.discount}%</p>
//                 )}
//                 {product.packs.map((pack, index) => (
//                   <div key={index}>
//                     <label>
//                       <input
//                         type="radio"
//                         name={`pack-${product._id}`}
//                         value={index}
//                         onChange={() => handlePackChange(product._id, index)}
//                       />
//                       {pack.ml}ML * {pack.unit} - RS.{pack.price}
//                     </label>
//                     {quantities[product._id]?.[index] !== undefined && (
//                       <div>
//                         <button onClick={() => handleQuantityChange(product._id, index, -1)}>-</button>
//                         <span>{quantities[product._id][index]}</span>
//                         <button onClick={() => handleQuantityChange(product._id, index, 1)}>+</button>
//                         <button onClick={() => handleAddToCart(product, index)}>Add to Cart</button>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
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


// import React, { useEffect, useState } from 'react';
// import './product.css';
// import { CONFIGS } from '../../../config';

// function Product({ addToCart }) {
//   const [products, setProducts] = useState([]);
//   const [quantities, setQuantities] = useState({});

//   const fetchProducts = async () => {
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
//     fetchProducts();
//   }, []);

//   const handlePackChange = (productId, packIndex) => {
//     setQuantities(prevState => ({
//       ...prevState,
//       [productId]: {
//         ...prevState[productId],
//         [packIndex]: 1
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
//     const quantity = quantities[product._id]?.[packIndex] || 1;
//     addToCart(product, packIndex, quantity);
//   };

//   return (
//     <div id='products'>
//       <h1>Products</h1>
//       {products.length > 0 ? (
//         <div className="product-list">
//           {products.map((product) => (
//             <div key={product._id} className="product-item">
//               <img src={product.image} alt={product.name} />
//               <div className="content">
//                 <h3>{product.name}</h3>
//                 <p>{product.desc}</p>
//                 {product.discount > 0 && <p>Discount: {product.discount}%</p>}
//                 <div className="radio-group">
//                   {product.packs.map((pack, index) => (
//                     <div key={index}>
//                       <label>
//                         <input
//                           type="radio"
//                           name={`pack-${product._id}`}
//                           value={index}
//                           onChange={() => handlePackChange(product._id, index)}
//                         />
//                         {pack.ml}ML * {pack.unit} - RS.{pack.price}
//                       </label>
//                       {quantities[product._id]?.[index] !== undefined && (
//                         <div className="quantity-controls">
//                           <button className='btn btn-dark m-3' onClick={() => handleQuantityChange(product._id, index, -1)}>-</button>
//                           <span>{quantities[product._id][index]}</span>
//                           <button className='btn btn-dark m-3' onClick={() => handleQuantityChange(product._id, index, 1)}>+</button>
//                           <br />
//                           <button className='btn btn-dark' onClick={() => handleAddToCart(product, index)}>Add to Cart</button>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
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

// import React, { useEffect, useState } from 'react';
// import './product.css';
// import { CONFIGS } from '../../../config';

// function Product({ addToCart }) {
//   const [products, setProducts] = useState([]);
//   const [quantities, setQuantities] = useState({});
//   const [selectedPacks, setSelectedPacks] = useState({});
//   const [dynamicInventory, setDynamicInventory] = useState({});

//   const fetchProducts = async () => {
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
      
//       // Initialize dynamic inventory
//       const initialInventory = {};
//       data.message.forEach(product => {
//         initialInventory[product._id] = {};
//         product.packs.forEach((pack, index) => {
//           initialInventory[product._id][index] = pack.inventory;
//         });
//       });
//       setDynamicInventory(initialInventory);
//     } catch (error) {
//       console.log('Error fetching products:', error);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const handlePackChange = (productId, packIndex) => {
//     setSelectedPacks(prevState => ({
//       ...prevState,
//       [productId]: packIndex
//     }));
//     setQuantities(prevState => ({
//       ...prevState,
//       [productId]: {
//         ...prevState[productId],
//         [packIndex]: 1
//       }
//     }));
//   };

//   const handleQuantityChange = (productId, packIndex, change) => {
//     const currentInventory = dynamicInventory[productId][packIndex];
//     setQuantities(prevState => {
//       const currentQuantity = prevState[productId]?.[packIndex] || 0;
//       const newQuantity = Math.max(1, Math.min(currentQuantity + change, currentInventory));
//       return {
//         ...prevState,
//         [productId]: {
//           ...prevState[productId],
//           [packIndex]: newQuantity
//         }
//       };
//     });
//   };

//   const handleAddToCart = (product, packIndex) => {
//     const quantity = quantities[product._id]?.[packIndex] || 0;
//     if (quantity > 0) {
//       addToCart(product, packIndex, quantity);
      
//       // Update dynamic inventory
//       setDynamicInventory(prevState => ({
//         ...prevState,
//         [product._id]: {
//           ...prevState[product._id],
//           [packIndex]: prevState[product._id][packIndex] - quantity
//         }
//       }));

//       // Reset quantity to 1 after adding to cart
//       setQuantities(prevState => ({
//         ...prevState,
//         [product._id]: {
//           ...prevState[product._id],
//           [packIndex]: 1
//         }
//       }));
//     }
//   };

//   return (
//     <div id='products'>
//       <h1>Products</h1>
//       {products.length > 0 ? (
//         <div className="product-list">
//           {products.map((product) => (
//             <div key={product._id} className="product-item">
//               <img src={product.image} alt={product.name} />
//               <div className="content">
//                 <h3>{product.name}</h3>
//                 <p>{product.desc}</p>
//                 {product.discount > 0 && <p>Discount: {product.discount}%</p>}
               
//                 <div className="radio-group">
//                   {product.packs.map((pack, index) => (
//                     <div key={index}>
//                       <label>
//                         <input
//                           type="radio"
//                           name={`pack-${product._id}`}
//                           value={index}
//                           onChange={() => handlePackChange(product._id, index)}
//                         />
//                         {pack.ml}ML * {pack.unit} - RS.{pack.price}
//                       </label>

//                       {selectedPacks[product._id] === index && (
//                         <>
//                           <p className="stock-info">
//                             {dynamicInventory[product._id][index] > 0 
//                               ? `Hurry up! Only ${dynamicInventory[product._id][index]} left${dynamicInventory[product._id][index] < 10 ? ' - Hurry up!' : ''}`
//                               : 'Out of Stock'}
//                           </p>

//                           {dynamicInventory[product._id][index] > 0 && (
//                             <div className="quantity-controls">
//                               <button 
//                                 className='btn btn-dark m-3' 
//                                 onClick={() => handleQuantityChange(product._id, index, -1)}
//                                 disabled={quantities[product._id]?.[index] <= 1}
//                               >
//                                 -
//                               </button>
//                               <span>{quantities[product._id]?.[index] || 1}</span>
//                               <button 
//                                 className='btn btn-dark m-3' 
//                                 onClick={() => handleQuantityChange(product._id, index, 1)}
//                                 disabled={quantities[product._id]?.[index] >= dynamicInventory[product._id][index]}
//                               >
//                                 +
//                               </button>
//                               <br />
//                               <button 
//                                 className='btn btn-dark' 
//                                 onClick={() => handleAddToCart(product, index)}
//                                 disabled={dynamicInventory[product._id][index] === 0}
//                               >
//                                 Add to Cart
//                               </button>
//                             </div>
//                           )}
//                         </>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
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



// import React, { useEffect, useState } from 'react';
// import './product.css';
// import { CONFIGS } from '../../../config';

// function Product({ addToCart, cart = [] }) {
//   const [products, setProducts] = useState([]);
//   const [quantities, setQuantities] = useState({});
//   const [selectedPacks, setSelectedPacks] = useState({});
//   const [inventory, setInventory] = useState({});

//   const fetchProducts = async () => {
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
      
//       // Initialize inventory
//       const initialInventory = {};
//       data.message.forEach(product => {
//         initialInventory[product._id] = {};
//         product.packs.forEach((pack, index) => {
//           initialInventory[product._id][index] = pack.inventory;
//         });
//       });
//       setInventory(initialInventory);
//     } catch (error) {
//       console.log('Error fetching products:', error);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const getAvailableQuantity = (productId, packIndex) => {
//     return inventory[productId]?.[packIndex] || 0;
//   };

//   const handlePackChange = (productId, packIndex) => {
//     setSelectedPacks(prevState => ({
//       ...prevState,
//       [productId]: packIndex
//     }));
//     setQuantities(prevState => ({
//       ...prevState,
//       [productId]: {
//         ...prevState[productId],
//         [packIndex]: 1
//       }
//     }));
//   };

//   const handleQuantityChange = (productId, packIndex, change) => {
//     setQuantities(prevState => {
//       const currentQuantity = prevState[productId]?.[packIndex] || 1;
//       const availableQuantity = getAvailableQuantity(productId, packIndex);
//       const newQuantity = Math.max(1, Math.min(currentQuantity + change, availableQuantity));
//       return {
//         ...prevState,
//         [productId]: {
//           ...prevState[productId],
//           [packIndex]: newQuantity
//         }
//       };
//     });
//   };

//   const handleAddToCart = (product, packIndex) => {
//     const quantity = quantities[product._id]?.[packIndex] || 1;
//     if (quantity > 0) {
//       addToCart(product, packIndex, quantity);
      
//       // Update inventory
//       setInventory(prevState => ({
//         ...prevState,
//         [product._id]: {
//           ...prevState[product._id],
//           [packIndex]: prevState[product._id][packIndex] - quantity
//         }
//       }));
      
//       // Reset quantity to 1 after adding to cart
//       setQuantities(prevState => ({
//         ...prevState,
//         [product._id]: {
//           ...prevState[product._id],
//           [packIndex]: 1
//         }
//       }));
//     }
//   };

//   return (
//     <div id='products'>
//       <h1>Products</h1>
//       {products.length > 0 ? (
//         <div className="product-list">
//           {products.map((product) => (
//             <div key={product._id} className="product-item">
//               <img src={product.image} alt={product.name} />
//               <div className="content">
//                 <h3>{product.name}</h3>
//                 <p>{product.desc}</p>
//                 {product.discount > 0 && <p>Discount: {product.discount}%</p>}
                
//                 <div className="radio-group">
//                   {product.packs.map((pack, index) => (
//                     <div key={index}>
//                       <label>
//                         <input
//                           type="radio"
//                           name={`pack-${product._id}`}
//                           value={index}
//                           onChange={() => handlePackChange(product._id, index)}
//                         />
//                         {pack.ml}ML * {pack.unit} - RS.{pack.price}
//                       </label>

//                       {selectedPacks[product._id] === index && (
//                         <>
//                           <p className="stock-info">
//                             {getAvailableQuantity(product._id, index) > 0 
//                               ? `Hurry up! Only ${getAvailableQuantity(product._id, index)} left${getAvailableQuantity(product._id, index) < 10 ? ' - Hurry up!' : ''}`
//                               : 'Out of Stock'}
//                           </p>

//                           {getAvailableQuantity(product._id, index) > 0 && (
//                             <div className="quantity-controls">
//                               <button 
//                                 className='btn btn-dark m-3' 
//                                 onClick={() => handleQuantityChange(product._id, index, -1)}
//                                 disabled={quantities[product._id]?.[index] <= 1}
//                               >
//                                 -
//                               </button>
//                               <span>{quantities[product._id]?.[index] || 1}</span>
//                               <button 
//                                 className='btn btn-dark m-3' 
//                                 onClick={() => handleQuantityChange(product._id, index, 1)}
//                                 disabled={quantities[product._id]?.[index] >= getAvailableQuantity(product._id, index)}
//                               >
//                                 +
//                               </button>
//                               <br />
//                               <button 
//                                 className='btn btn-dark' 
//                                 onClick={() => handleAddToCart(product, index)}
//                                 disabled={getAvailableQuantity(product._id, index) === 0}
//                               >
//                                 Add to Cart
//                               </button>
//                             </div>
//                           )}
//                         </>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
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
import './product.css';
import { CONFIGS } from '../../../config';
import { MdCardTravel } from 'react-icons/md';
import { IoMdCart } from 'react-icons/io';

function Product({ addToCart, cart = [] }) {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [selectedPacks, setSelectedPacks] = useState({});

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

  const getAvailableQuantity = (product, packIndex) => {
    return product.packs[packIndex].inventory;
  };

  const handlePackChange = (productId, packIndex) => {
    setSelectedPacks(prevState => ({
      ...prevState,
      [productId]: packIndex
    }));
    setQuantities(prevState => ({
      ...prevState,
      [productId]: {
        ...prevState[productId],
        [packIndex]: 1
      }
    }));
  };

  const handleQuantityChange = (productId, packIndex, change) => {
    setQuantities(prevState => {
      const currentQuantity = prevState[productId]?.[packIndex] || 1;
      const product = products.find(p => p._id === productId);
      const availableQuantity = getAvailableQuantity(product, packIndex);
      const newQuantity = Math.max(1, Math.min(currentQuantity + change, availableQuantity));
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
    const quantity = quantities[product._id]?.[packIndex] || 1;
    if (quantity > 0) {
      addToCart(product, packIndex, quantity);
      
      // Reset quantity to 1 after adding to cart
      setQuantities(prevState => ({
        ...prevState,
        [product._id]: {
          ...prevState[product._id],
          [packIndex]: 1
        }
      }));
    }
  };

  return (
    <div id='products'>
      <h1>Products</h1>
      {products.length > 0 ? (
        <div className="product-list">
          {products.map((product) => (
            <div key={product._id} className="product-item">
              <img src={product.image} alt={product.name} />
              <div className="content">
                <h3>{product.name}</h3>
                <p>{product.desc}</p>
                {product.discount > 0 && <p>Discount: {product.discount}%</p>}
                
                <div className="radio-group">
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

                      {selectedPacks[product._id] === index && (
                        <>
                          <p className="stock-info">
                            {getAvailableQuantity(product, index) === 0 
                              ? 'Out of Stock'
                              : getAvailableQuantity(product, index) <= 10
                                ? `Hurry up! Only ${getAvailableQuantity(product, index)} left in stock!`
                                : null}
                          </p>

                          {getAvailableQuantity(product, index) > 0 && (
                            <div className="quantity-controls">
                              <button 
                                className='btn btn-dark m-3' 
                                onClick={() => handleQuantityChange(product._id, index, -1)}
                                disabled={quantities[product._id]?.[index] <= 1}
                              >
                                -
                              </button>
                              <span>{quantities[product._id]?.[index] || 1}</span>
                              <button 
                                className='btn btn-dark m-3' 
                                onClick={() => handleQuantityChange(product._id, index, 1)}
                                disabled={quantities[product._id]?.[index] >= getAvailableQuantity(product, index)}
                              >
                                +
                              </button>
                              <br />
                              <button 
                                className='btn btn-dark' 
                                onClick={() => handleAddToCart(product, index)}
                                disabled={getAvailableQuantity(product, index) === 0}
                              >
                                <IoMdCart />

                                Add to Cart
                              </button>
                            </div>
                          )}
                        </>
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