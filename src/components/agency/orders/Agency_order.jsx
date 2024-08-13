import React, { useEffect, useState } from 'react';
import './Agency_order.css'; // Ensure this path is correct
import { useAuth } from '../../../store/Auth';
import { CONFIGS } from '../../../../config';

function Agency_order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${CONFIGS.API_BASE_URL}/fetchagencyorder`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ _id: user.agency_id }), // Ensure user.agency_id is valid
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setOrders(data.response);
      } catch (error) {
        console.error('Error fetching orders:', error); // Log error for debugging
        setError('Failed to load orders.'); // Set user-friendly error message
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user.agency_id]); // Dependency array to refetch if agency_id changes

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>; // Display user-friendly error message
  }

  return (
    <div className="order-container">
      {orders.length === 0 ? (
        <p>No orders available</p>
      ) : (
        <div className="order-cards">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <h3>Order ID: {order._id}</h3>
              <p><strong>Customer Name:</strong> {order.cust_name}</p>
              <p><strong>Phone Number:</strong> {order.cust_number}</p>
              <p><strong>Address:</strong> {order.cust_address[order.selected_address]}</p>
              <p><strong>Pincode:</strong> {order.pincode}</p>
              <p><strong>Order Date:</strong> {new Date(order.order_date).toLocaleDateString()}</p>
              <p><strong>Time Slot:</strong> {order.timeslot}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Total Amount:</strong> ${order.total_amount}</p>
              <div>
                <strong>Products:</strong>
                <ul>
                  {order.order_product.map((product) => (
                    <li key={product._id}>
                      {product.name} - Quantity: {product.quantity} - Price: ${product.price}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Agency_order;
