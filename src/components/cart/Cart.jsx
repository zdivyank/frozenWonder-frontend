// import React, { useState } from 'react';
// import { Offcanvas, OffcanvasHeader, OffcanvasBody, Modal } from 'react-bootstrap';
// import { BsCart2 } from 'react-icons/bs';
// import './cart.css';
// import CheckoutForm from './CheckoutForm';

// function Cart({ cart, updateQuantity, calculateTotal, closeCart, showCart }) {
//   const [showCheckoutForm, setShowCheckoutForm] = useState(false);

//   const handleSaveAndProceed = () => {
//     setShowCheckoutForm(true);
//   };

//   const handleCloseCheckoutForm = () => {
//     setShowCheckoutForm(false);
//   };

//   return (
//     <>
//       <Offcanvas show={showCart} onHide={closeCart} placement="end">
//         <OffcanvasHeader closeButton>
//           <Offcanvas.Title>
//             <BsCart2 /> Your Cart
//           </Offcanvas.Title>
//         </OffcanvasHeader>
//         <OffcanvasBody>
//           {cart.length === 0 ? (
//             <div>Your cart is empty.</div>
//           ) : (
//             <>
//               {cart.map((item) => (
//                 <div key={item._id} className="cart-item">
//                   <img src={item.image} alt={item.name} height={75} className='m-3' />
//                   <h3>{item.name}</h3>
//                   <p>{item.size}</p>
//                   <p>Price: RS.{item.price}</p>
//                   <div className="quantity-control text-center">
//                     <button onClick={() => updateQuantity(item._id, -1)} className='m-3'>-</button>
//                     <span>{item.quantity}</span>
//                     <button onClick={() => updateQuantity(item._id, 1)} className='m-3'>+</button>
//                   </div>
//                 </div>
//               ))}
//               <div className="cart-total">
//                 <h3>Total: RS.{calculateTotal()}</h3>
//               </div>
//               <div className="cart-total">
//                 <button className='btn btn-warning' onClick={handleSaveAndProceed}>
//                   Save & Proceed
//                 </button>
//               </div>
//             </>
//           )}
//         </OffcanvasBody>
//       </Offcanvas>

//       <Modal show={showCheckoutForm} onHide={handleCloseCheckoutForm}>
//         <Modal.Header closeButton>
//           <Modal.Title>Checkout</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <CheckoutForm 
//             cart={cart} 
//             total={calculateTotal()} 
//             onClose={handleCloseCheckoutForm} 
//           />
//         </Modal.Body>
//       </Modal>
//     </>
//   );
// }

// export default Cart;

// Cart.jsx



// import React from 'react';

// function Cart({ cartItems, setCartItems }) {
//   const updateQuantity = (productId, packIndex, newQuantity) => {
//     setCartItems(prevItems => {
//       const updatedItems = prevItems.map(item => {
//         if (item.product._id === productId && item.packIndex === packIndex) {
//           return { ...item, quantity: Math.max(0, newQuantity) };
//         }
//         return item;
//       });
//       return updatedItems.filter(item => item.quantity > 0);
//     });
//   };

//   const calculateTotal = () => {
//     return cartItems.reduce((total, item) => {
//       const price = item.product.packs[item.packIndex].price;
//       return total + price * item.quantity;
//     }, 0);
//   };

//   return (
//     <div>
//       {cartItems.length === 0 ? (
//         <p>Your cart is empty.</p>
//       ) : (
//         <div>
//           {cartItems.map((item, index) => (
//             <div key={index}>
//               <h3>{item.product.name}</h3>
//               <p>
//                 {item.product.packs[item.packIndex].ml}ML *{' '}
//                 {item.product.packs[item.packIndex].unit} - RS.
//                 {item.product.packs[item.packIndex].price}
//               </p>
//               <button onClick={() => updateQuantity(item.product._id, item.packIndex, item.quantity - 1)}>
//                 -
//               </button>
//               <span>{item.quantity}</span>
//               <button onClick={() => updateQuantity(item.product._id, item.packIndex, item.quantity + 1)}>
//                 +
//               </button>
//               <hr />
//             </div>

//           ))}
//           <h3>Total: RS.{calculateTotal()}</h3>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Cart;


// // Cart.jsx
// import React from 'react';

// function Cart({ cartItems }) {
//   const calculateTotal = () => {
//     return cartItems.reduce((total, item) => {
//       const price = item.product.packs[item.packIndex].price;
//       return total + price * item.quantity;
//     }, 0);
//   };

//   return (
//     <div>
//       {cartItems.length === 0 ? (
//         <p>Your cart is empty.</p>
//       ) : (
//         <div>
//           {cartItems.map((item, index) => (
//             <div key={index}>
//               <h3>{item.product.name}</h3>
//               <p>
//                 {item.product.packs[item.packIndex].ml}ML *{' '}
//                 {item.product.packs[item.packIndex].unit} - RS.
//                 {item.product.packs[item.packIndex].price}
//               </p>
//               <p>Quantity: {item.quantity}</p>
//               <p>Total: RS.{item.product.packs[item.packIndex].price * item.quantity}</p>
//             </div>
//           ))}
//           <h3>Total: RS.{calculateTotal()}</h3>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Cart;

import React from 'react';

function Cart({ cartItems, setCartItems }) {
  const updateQuantity = (productId, packIndex, newQuantity) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item.product._id === productId && item.packIndex === packIndex) {
          return { ...item, quantity: Math.max(0, newQuantity) };
        }
        return item;
      });
      return updatedItems.filter(item => item.quantity > 0);
    });
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product.packs[item.packIndex].price;
      return total + price * item.quantity;
    }, 0);
  };

  const addToCart = (product, selectedPack, quantity) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item.product._id === product._id && item.packIndex === selectedPack
      );
      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      }
      return [...prevItems, { product, packIndex: selectedPack, quantity }];
    });
  };

  return (
    <div>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item, index) => (
            <div key={index}>
              <h3>{item.product.name}</h3>
              <p>
                {item.product.packs[item.packIndex].ml}ML *{' '}
                {item.product.packs[item.packIndex].unit} - RS.
                {item.product.packs[item.packIndex].price}
              </p>
              <div className="quantity-control">
                <button onClick={() => updateQuantity(item.product._id, item.packIndex, item.quantity - 1)}>
                  -
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product._id, item.packIndex, item.quantity + 1)}>
                  +
                </button>
              </div>
              <p>Total: RS.{item.product.packs[item.packIndex].price * item.quantity}</p>
            </div>
          ))}
          <h3>Total: RS.{calculateTotal()}</h3>
        </div>
      )}
    </div>
  );
}

export default Cart;
