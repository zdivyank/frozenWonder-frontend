import React, { useRef, useEffect, useState } from 'react';
import { MdDelete } from 'react-icons/md';
import emptyCartGif from '/img/cart.jpg';
import './cart.css';
import OrderModal from './OrderModal';
import { toast } from 'react-toastify';

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

  const checkInventory = () => {
    let isValid = true;
    let errorMessage = '';

    cartItems.forEach(item => {
      const packDetails = item.product.packs[item.packIndex];
      if (packDetails && item.quantity > packDetails.inventory) {
        isValid = false;
        errorMessage += `Not enough stock for ${item.product.name} (${packDetails.ml}ML * ${packDetails.unit}). Available: ${packDetails.inventory}, In cart: ${item.quantity}.\n`;
      }
    });

    return { isValid, errorMessage };
  };

  const handlePlaceOrder = () => {
    const { isValid, errorMessage } = checkInventory();

    if (isValid) {
      setShowOrderModal(true);
    } else {
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
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
                  <td>{item.product.packs[item.packIndex].price.toFixed(2)}</td>
                  <td>
                    <MdDelete onClick={() => removeFromCart(item.product._id, item.packIndex)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
              
          <div className="cart-summary">
            {/* <h3>Order Summary</h3> */}
            <div className="summary-line">
              <span>Subtotal</span>
              <span>{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-line">
              <span>Shipping</span>
              <span>{shipping.toFixed(2)}</span>
            </div>
            <div className="summary-line total">
              <span>Total</span>
              <span>RS {total.toFixed(2)}</span>
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