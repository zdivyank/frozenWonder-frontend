import React, { useState } from 'react';
import { CONFIGS } from '../../../config';
import { toast } from 'react-toastify';
import './ordermodal.css';

function OrderModal({ cartItems, total, onClose, setCartItems }) {
  const [customerInfo, setCustomerInfo] = useState({
    cust_name: '',
    cust_address: '',
    cust_number: '',
    pincode: '',
  });

  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const orderData = {
      ...customerInfo,
      order_product: cartItems.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.packs[item.packIndex].price
      })),
      order_date: new Date().toISOString(),
      status: 'Pending',
      total_amount: total,
    };

    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/addorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        setIsOrderPlaced(true);
        // Order placed successfully, now update stock for each item
        for (const item of cartItems) {
          const stockUpdateResponse = await fetch(`${CONFIGS.API_BASE_URL}/updatestock`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              productId: item.product._id,
              packIndex: item.packIndex,
              quantity: item.quantity,
            }),
          });

          if (!stockUpdateResponse.ok) {
            const errorData = await stockUpdateResponse.json();
            console.error('Failed to update stock:', errorData.error);
            // You might want to handle this error more gracefully
          }
        }

        toast.success('Order placed successfully!', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setCartItems([]); // Clear the cart
        onClose(); // Close the modal
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(`Failed to place order: ${error.message}`, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Order Summary</h5>
            <button type="button" className="close" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <h4>Order Items:</h4>
            {cartItems.map((item, index) => (
              <div key={index}>
                {item.product.name} - {item.product.packs[item.packIndex].ml}ML * {item.product.packs[item.packIndex].unit}
                - Quantity: {item.quantity}
                - Price: RS.{item.product.packs[item.packIndex].price * item.quantity}
              </div>
            ))}
            <h4>Total: RS.{total}</h4>
            <hr />
            <form onSubmit={handleSubmit}>
              <div className="order_container">
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="cust_name"
                    value={customerInfo.cust_name}
                    onChange={handleInputChange}
                    className="order_info"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Mobile Number:</label>
                  <input
                    type="tel"
                    name="cust_number"
                    value={customerInfo.cust_number}
                    onChange={handleInputChange}
                    className="order_info"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Address:</label>
                  <textarea
                    name="cust_address"
                    value={customerInfo.cust_address}
                    onChange={handleInputChange}
                    className="order_info"
                    required
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Pincode:</label>
                  <input
                    type="text"
                    name="pincode"
                    value={customerInfo.pincode}
                    onChange={handleInputChange}
                    className="order_info"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={isOrderPlaced}>Place Order</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderModal;
