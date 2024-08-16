import React, { useEffect, useState } from 'react';
import { CONFIGS } from '../../../../config';
import { useAuth } from '../../../store/Auth';
import './order.css';

function Agency_orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${CONFIGS.API_BASE_URL}/fetchagencyorder`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id: user.agency_id }), // Replace with actual agency ID or get it from auth/store
            });

            if (!response.ok) throw new Error('Failed to fetch orders');

            const data = await response.json();
            setOrders(data.response); // Assuming `response` contains the orders array
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to fetch orders.');
        } finally {
            setLoading(false);
        }
    };

    const renderOrderCard = (order) => (
        <div key={order._id} className="order-card">
            {/* <p><strong>Order ID:</strong> {order._id}</p> */}
            <div className="">
                <strong>Customer Name:</strong>
                <p> {order.cust_name}</p>
            </div>

            <div className="">

                <strong>Phone Number:</strong>
                <p> {order.cust_number}</p>
            </div>

            <div className="">

                <strong>Address:</strong>
                <p> {order.cust_address[order.selected_address]}</p>
            </div>

            <div className="">
                <strong>Status:</strong>
                <p> {order.status}</p>
            </div>
            {/* <p><strong>Order Date:</strong> {new Date(order.order_date).toLocaleDateString()}</p>
      <p><strong>Pincode:</strong> {order.pincode}</p>
      <p><strong>Time Slot:</strong> {order.timeslot}</p>
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
      </div> */}
        </div>
    );

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="orders-container">
            <h2>All Orders</h2>
            {orders.length === 0 ? (
                <p>No orders available</p>
            ) : (
                <div className="order-cards">
                    {orders.map(renderOrderCard)}
                </div>
            )}
        </div>
    );
}

export default Agency_orders;
