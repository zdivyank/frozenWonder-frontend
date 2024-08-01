import React, { useState } from 'react';
import { CONFIGS } from '../../../config';
import { toast } from 'react-toastify';

function CheckoutForm({ cart, total, onClose }) {
  const [customerInfo, setCustomerInfo] = useState({
    cust_name: '',
    cust_address: '',
    cust_number: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = {
      ...customerInfo,
      order_product: cart.map(item => ({ ...item, quantity: item.quantity, price: item.price })),
      order_date: new Date().toISOString(),
      status: 'Pending',
      total_amount: total,
    };
    console.log('Order Data:', orderData); // Debugging line

    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/addorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      
      if (response.ok) {
        toast.success('Order placed successfully!', {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

      const data = await response.json();
      console.log('Response Data:', data); // Debugging line



    //   if (data.success) {
    //     alert('Order placed successfully!');
    //     onClose();
    //   } else {
    //     throw new Error(data.error || 'Failed to create order');
    //   }
    } catch (error) {
      console.error('Error creating order:', error);
      alert(`Failed to place order: ${error.message}`);
    }
  };

  return (
    <div className="checkout-form">
      <form onSubmit={handleSubmit}>
        <h3>Complete your order</h3>
        <input 
          type="text" 
          value={customerInfo.cust_name} 
          onChange={(e) => setCustomerInfo(prev => ({ ...prev, cust_name: e.target.value }))} 
          placeholder="Name"
          className='form-control mt-3'
          required
        />
        <input 
          type="text" 
          value={customerInfo.cust_address} 
          onChange={(e) => setCustomerInfo(prev => ({ ...prev, cust_address: e.target.value }))} 
          placeholder="Address"
          className='form-control mt-3'
          required
        />
        <input 
          type="tel" 
          value={customerInfo.cust_number} 
          onChange={(e) => setCustomerInfo(prev => ({ ...prev, cust_number: e.target.value }))} 
          placeholder="Phone number"
          className='form-control mt-3'
          required
        />
        <h4>Order Summary</h4>
        {cart.map(item => (
          <div key={item._id}>
            {item.name} - Quantity: {item.quantity} - Price: RS.{item.price * item.quantity}
          </div>
        ))}
        <h4>Total: RS.{total}</h4>
        <button type="submit" className="btn btn-primary mt-3">Place Order</button>
      </form>
    </div>
  );
}

export default CheckoutForm;
