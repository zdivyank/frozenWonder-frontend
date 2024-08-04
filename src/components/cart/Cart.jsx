// import React, { useState } from 'react';
// import OrderModal from './OrderModal';
// import { toast } from 'react-toastify';  // Make sure to install and import react-toastify

// function Cart({ cartItems, setCartItems }) {
//   const [showModal, setShowModal] = useState(false);

//   const calculateTotal = () => {
//     return cartItems.reduce((total, item) => {
//       const packDetails = item.product.packs[item.packIndex];
//       if (packDetails) {
//         const price = packDetails.price;
//         const discount = packDetails.discount || 0;
//         const finalPrice = price - (price * discount) / 100;
//         return total + finalPrice * item.quantity;
//       }
//       return total;
//     }, 0);
//   };

//   const removeFromCart = (productId, packIndex) => {
//     setCartItems(prevItems =>
//       prevItems.filter(item =>
//         !(item.product._id === productId && item.packIndex === packIndex)
//       )
//     );
//   };

//   // Group cart items by product
//   const groupedItems = cartItems.reduce((acc, item) => {
//     if (!acc[item.product._id]) {
//       acc[item.product._id] = {
//         product: item.product,
//         packs: []
//       };
//     }
//     acc[item.product._id].packs.push({
//       packIndex: item.packIndex,
//       quantity: item.quantity
//     });
//     return acc;
//   }, {});

//   const checkStock = () => {
//     let isValid = true;
//     let errorMessage = '';

//     cartItems.forEach(item => {
//       const packDetails = item.product.packs[item.packIndex];
//       if (packDetails && item.quantity > packDetails.inventory) {
//         isValid = false;
//         errorMessage += `Not enough stock for ${item.product.name} (${packDetails.ml}ML* ${packDetails.unit}).<br / >`;
//       }
//     });

//     return { isValid, errorMessage };
//   };

//   const handleProceed = () => {
//     const { isValid, errorMessage } = checkStock();

//     if (isValid) {
//       setShowModal(true);
//     } else {
//       toast.error(errorMessage, {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
//     }
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//   };

//   return (
//     <div>
//       {Object.keys(groupedItems).length === 0 ? (
//         <p>Your cart is empty.</p>
//       ) : (
//         <div>
//           {Object.values(groupedItems).map((group, index) => (
//             <div key={index} className="cart-item-group">
//               <h3>{group.product.name}</h3>
//               {group.packs.map((pack, packIndex) => {
//                 const packDetails = group.product.packs[pack.packIndex];
//                 if (packDetails) {
//                   return (
//                     <div key={packIndex} className="cart-item-pack">
//                       <p>
//                         {packDetails.ml}ML * {packDetails.unit} - RS. {packDetails.price}
//                         <br />
//                         Discount: {packDetails.discount}%
//                       </p>
//                       <p>Quantity: {pack.quantity}</p>
//                       <p>
//                         Total: RS.
//                         {(packDetails.price - (packDetails.price * packDetails.discount) / 100) * pack.quantity}
//                       </p>
//                       {/* <p>Available Stock: {packDetails.inventory}</p> */}
//                       <button
//                         className="btn btn-danger btn-sm"
//                         onClick={() => removeFromCart(group.product._id, pack.packIndex)}
//                       >
//                         Remove
//                       </button>
//                       <hr />
//                     </div>
//                   );
//                 } else {
//                   return (
//                     <div key={packIndex} className="cart-item-pack">
//                       <p>Pack details not available.</p>
//                       <button
//                         className="btn btn-danger btn-sm"
//                         onClick={() => removeFromCart(group.product._id, pack.packIndex)}
//                       >
//                         Remove
//                       </button>
//                       <hr />
//                     </div>
//                   );
//                 }
//               })}
//             </div>
//           ))}
//           <h3>Total: RS.{calculateTotal()}</h3>
//           <button className="btn btn-primary mt-3" onClick={handleProceed}>
//             Save & Proceed
//           </button>
//         </div>
//       )}
//       {showModal && (
//         <OrderModal
//           cartItems={cartItems}
//           total={calculateTotal()}
//           onClose={handleCloseModal}
//           setCartItems={setCartItems}
//         />
//       )}
//     </div>
//   );
// }

// export default Cart;import React, { useRef, useEffect, useState } from 'react';
import { MdDelete } from 'react-icons/md';
import emptyCartGif from '/img/cart.jpg';
import './cart.css';
import OrderModal from './OrderModal';
import { useEffect, useRef, useState } from 'react';

function Cart({ cartItems, setCartItems, onClose }) {
  const cartRef = useRef(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const removeFromCart = (productId, packIndex) => {
    setCartItems(prevItems =>
      prevItems.filter(item =>
        !(item.product._id === productId && item.packIndex === packIndex)
      )
    );
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const packDetails = item.product.packs[item.packIndex];
      if (packDetails) {
        const price = packDetails.price;
        const discount = packDetails.discount || 0;
        const finalPrice = price - (price * discount) / 100;
        return total + finalPrice * item.quantity;
      }
      return total;
    }, 0);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const subtotal = calculateSubtotal();
  const shipping = 8.00;
  const total = subtotal + shipping;

  const handlePlaceOrder = () => {
    setShowOrderModal(true);
  };

  const handleCloseOrderModal = () => {
    setShowOrderModal(false);
  };

  return (
    <div className="cart-card" ref={cartRef}>
      <h2 className="cart-header">Your Cart</h2>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <img src={emptyCartGif} height={150} alt="Empty Cart" className="empty-cart-gif" />
          <p>Your cart is empty.</p>
        </div>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th className='cart_head m-3'>Product</th>
                <th className='cart_head m-3'>Pack Size</th>
                <th className='cart_head m-3'>Quantity</th>
                <th className='cart_head m-3'>Price</th>
                <th className='cart_head m-3'>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr className='cart_tr' key={`${item.product._id}-${item.packIndex}`}>
                  <td className="product-cell">
                    <img src={item.product.image} height={50} alt={item.product.name} className="cart-item-image" />
                    <span>{item.product.name}</span>
                  </td>
                  <td>{item.product.packs[item.packIndex].ml}ML * {item.product.packs[item.packIndex].unit}</td>
                  <td>{item.quantity}</td>
                  <td>${item.product.packs[item.packIndex].price.toFixed(2)}</td>
                  <td>
                    <MdDelete onClick={() => removeFromCart(item.product._id, item.packIndex)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
              
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-line">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-line">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="summary-line total">
              <span>Total</span>
              <span>USD {total.toFixed(2)}</span>
            </div>
          </div>
          <button className="place-order-btn" onClick={handlePlaceOrder}>Place Order →</button>
        </>
      )}
      {showOrderModal && (
        <OrderModal
          cartItems={cartItems}
          total={total}
          onClose={handleCloseOrderModal}
          setCartItems={setCartItems}
        />
      )}
    </div>
  );
}

export default Cart;