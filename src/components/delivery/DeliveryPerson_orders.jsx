import React, { useState, useEffect } from 'react';
import './deliveryperson_order.css';
import { CONFIGS } from '../../../config';
import { useAuth } from '../../store/Auth';
import { FaExchangeAlt } from 'react-icons/fa';
import { Button, Modal } from 'react-bootstrap';

function DeliveryPersonOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${CONFIGS.API_BASE_URL}/personWise_delivery`, {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deliveryBoy_id: user._id }),
        });

        if (!response.ok) throw new Error('Failed to fetch orders');

        const data = await response.json();
        const allOrderIds = data.Message.flatMap(delivery => delivery.order_id);
        console.log(allOrderIds);
        

        const orderDetails = await Promise.all(
          allOrderIds.map(async (orderId) => {
            const orderResponse = await fetch(`${CONFIGS.API_BASE_URL}/order/${orderId}`, {
              method: "GET",
            });

            console.log(orderResponse);
            
            if (!orderResponse.ok) throw new Error(`Failed to fetch details for order ${orderId}`);
            return orderResponse.json();
          })
        );

        setOrders(orderDetails);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError('Failed to fetch orders. Please try again later.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user._id]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/updateStatus/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        console.log('Failed to update order status');
      }
    } catch (error) {
      console.log('Error updating order status:', error);
    }
  };

  const confirmDelivery = (orderId) => {
    setSelectedOrderId(orderId);
    setShowModal(true);
  };

  const handleConfirmDelivery = () => {
    handleStatusUpdate(selectedOrderId, "Delivered");
    setShowModal(false);
  };

  const getSelectedAddress = (order) => {
    if (order.cust_address && Array.isArray(order.cust_address) && order.selected_address !== undefined) {
      return order.cust_address[order.selected_address] || 'Address not available';
    } else if (typeof order.cust_address === 'string') {
      return order.cust_address;
    } else if (order.cust_addresses && Array.isArray(order.cust_addresses) && order.selected_address !== undefined) {
      return order.cust_addresses[order.selected_address]?.address || 'Address not available';
    }
    return 'Address not available';
  };

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="delivery-orders-wrapper">
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="delivery-orders-list">
          {orders.map((order) => (
            <div key={order._id} className="delivery-order-card">
              <b>Customer Name: {order.cust_name}</b>
              <p><strong>Delivery Address:</strong> {getSelectedAddress(order)}</p>
              <p><strong>Total amount:</strong> ${order.total_amount}</p>
              <p className={order.status === "Pending" ? "bg-danger text-light p-1" : "bg-success text-light p-1"}>
                Status: {order.status}
              </p>
              <div className="order-status-buttons">
                {order.status === "Pending" ? (
                  <Button
                    onClick={() => confirmDelivery(order._id)}
                    variant="success"
                    className='me-2'
                  >
                    <FaExchangeAlt className='me-2' />
                    Mark as Delivered
                  </Button>
                ) : (
                  <span>Order Delivered</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delivery</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to mark this order as delivered?</Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowModal(false)}>
            No
          </Button>
          <Button variant='outline-danger' onClick={handleConfirmDelivery}>
            Yes, Mark as Delivered
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DeliveryPersonOrders;
