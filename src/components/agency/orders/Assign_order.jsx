import React, { useEffect, useState } from 'react';
import './assign.css';
import { useAuth } from '../../../store/Auth';
import { CONFIGS } from '../../../../config';

function Assign_orders() {
  const [orders, setOrders] = useState([]);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, [user.agency_id]);

  const fetchData = async () => {
    try {
      await Promise.all([fetchOrders(), fetchDeliveryBoys()]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/fetchpendingagencyorder/${user.agency_id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch orders');

      const data = await response.json();
      const pendingOrders = data.filter(order => !order.assigned_delivery_boys);
      setOrders(pendingOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders.');
    }
  };

  const fetchDeliveryBoys = async () => {
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/fetchDeliveryBoys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agency_id: user.agency_id }),
      });

      if (!response.ok) throw new Error('Failed to fetch delivery boys');

      const data = await response.json();
      setDeliveryBoys(data.deliveryBoys);
    } catch (error) {
      console.error('Error fetching delivery boys:', error);
      setError('Failed to fetch delivery boys.');
    }
  };

  const handleOrderSelect = (orderId) => {
    setSelectedOrders(prev =>
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  };

  const handleDeliveryBoyChange = (event) => {
    setSelectedDeliveryBoy(event.target.value);
  };

  const handleAssignOrders = async () => {
    if (selectedOrders.length === 0 || !selectedDeliveryBoy) {
      alert('Please select orders and a delivery boy');
      return;
    }

    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/adddelivery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: selectedOrders,
          deliveryBoy_id: selectedDeliveryBoy,
          agency_id: user.agency_id,
        }),
      });

      if (!response.ok) throw new Error('Failed to assign orders');

      const updateResponse = await fetch(`${CONFIGS.API_BASE_URL}/updateAssignedOrders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: selectedOrders }),
      });

      if (!updateResponse.ok) throw new Error('Failed to update orders');

      alert('Orders assigned successfully');
      await fetchOrders();
      setSelectedOrders([]);
      setSelectedDeliveryBoy('');
    } catch (error) {
      console.error('Error assigning orders:', error);
      alert('Failed to assign orders');
    }
  };

  const renderOrderCard = (order) => (
    <div key={order._id} className="assign-order-card">
      <input
        type="checkbox"
        checked={selectedOrders.includes(order._id)}
        onChange={() => handleOrderSelect(order._id)}
      />
      <p><strong>Order ID:</strong> {order._id}</p>
      <p><strong>Customer:</strong> {order.cust_name}</p>
      <p><strong>Phone:</strong> {order.cust_number}</p>
      <p><strong>Address:</strong> {order.cust_address[order.selected_address]}</p>
      <p><strong>Date:</strong> {new Date(order.order_date).toLocaleDateString()}</p>
      <p><strong>Amount:</strong> ${order.total_amount}</p>
    </div>
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="assign-orders-wrapper">
      <h2>Assign Orders</h2>
      <select value={selectedDeliveryBoy} onChange={handleDeliveryBoyChange}>
        <option value="">Select Delivery Boy</option>
        {deliveryBoys.map((boy) => (
          <option key={boy._id} value={boy._id}>
            {boy.username || 'Unnamed Delivery Person'}
          </option>
        ))}
      </select>
      <button onClick={handleAssignOrders} className="assign-orders-btn">Assign Orders</button>

      <h2>Orders</h2>
      {orders.length === 0 ? (
        <p>No orders available</p>
      ) : (
        <div className="assign-order-cards">
          {orders.map(renderOrderCard)}
        </div>
      )}
    </div>
  );
}

export default Assign_orders;
