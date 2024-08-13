import React, { useState, useEffect } from 'react';
import { Pagination, Card, Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../store/Auth';
import { CONFIGS } from '../../../../config/index';
import './admin_order.css';
import { MdDelete } from 'react-icons/md';
import { FaExchangeAlt } from 'react-icons/fa';

function AdminOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(9);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    if (!isLoggedIn) {
      navigate('/');
      return;
    }

    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/vieworders`, {
        method: 'GET',
      });

      if (!response.ok) {
        console.log('No Orders');
        return;
      }

      const data = await response.json();
      console.log(':::::::::::', data.orders);

      const sortedOrders = data.orders.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
      setOrders(sortedOrders);
    } catch (error) {
      console.log('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [isLoggedIn, navigate]);

  const handleStatusUpdate = async (orderId, currentStatus) => {
    const newStatus = currentStatus === "pending" ? "delivered" : "pending";
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/updateorderstatus/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      // if (response.ok) {
      //   setOrders(orders.map(order =>
      //     order._id === orderId ? { ...order, status: newStatus } : order
      //   ));

        if (response.ok) {
          const updatedOrders = orders.map(order =>
            order._id === orderId ? { ...order, status: newStatus } : order
          );
          
          // Re-sort the orders
          const sortedOrders = updatedOrders.sort((a, b) => {
            if (a.status === 'pending' && b.status !== 'pending') return -1;
            if (a.status !== 'pending' && b.status === 'pending') return 1;
            return new Date(b.order_date) - new Date(a.order_date);
          });
    
          setOrders(sortedOrders);
      } else {
        console.log('Failed to update order status');
      }
    } catch (error) {
      console.log('Error updating order status:', error);
    }
  };

  const openModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrderId(null);
  };

  const handleDelete = async () => {
    if (selectedOrderId) {
      try {
        const response = await fetch(`${CONFIGS.API_BASE_URL}/deleteorder/${selectedOrderId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setOrders(orders.filter(order => order._id !== selectedOrderId));
          closeModal();
        } else {
          console.log('Failed to delete order');
        }
      } catch (error) {
        console.log('Error deleting order:', error);
      }
    }
  };

  // Function to get the selected address
  const getSelectedAddress = (order) => {
    if (order.cust_address && Array.isArray(order.cust_address) && order.selected_address !== undefined) {
      // If cust_address is an array, use selected_address as index
      return order.cust_address[order.selected_address] || 'Address not available';
    } else if (typeof order.cust_address === 'string') {
      // If cust_address is a string, return it directly
      return order.cust_address;
    } else if (order.cust_addresses && Array.isArray(order.cust_addresses) && order.selected_address !== undefined) {
      // Fallback to cust_addresses if present
      return order.cust_addresses[order.selected_address]?.address || 'Address not available';
    }
    return 'Address not available';
  };

  // Calculate current orders
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section className="admin-order-section">
      <Container>
        <h1 className="">Orders List</h1>
        {loading ? (
          <p className="admin-order-loading">Loading...</p>
        ) : (
          <>
            <Row>
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
                  <Col key={order._id} md={4} sm={6} xs={12} className="admin-order-col">
                    <Card className="admin-order-card">
                      <Card.Body>
                        <div className="admin-order-info">
                          <div className="admin-order-detail">
                            <b className="admin-order-label">Name:</b>
                            <div className="admin-order-value">{order.cust_name}</div>
                          </div>
                          <div className="admin-order-detail">
                            <b className="admin-order-label">Address:</b>
                            <div className="admin-order-value">{getSelectedAddress(order)}</div>
                          </div>
                          <div className="admin-order-detail">
                            <b className="admin-order-label">Pincode:</b>
                            <div className="admin-order-value">{order.pincode}</div>
                          </div>

                          <div className="admin-order-detail">
                            <b className="admin-order-label">Phone Number:</b>
                            <div className="admin-order-value">{order.cust_number}</div>
                          </div>
                          <div className="admin-order-detail">
                            <b className="admin-order-label">Order Date:</b>
                            <div className="admin-order-value">{new Date(order.order_date).toLocaleDateString()}</div>
                          </div>
                          <div className="admin-order-detail">
                            <b className="admin-order-label">Time Slot:</b>
                            <div className="admin-order-value">{order.timeslot}</div>
                          </div>
                          <div className="admin-order-detail">
                            <b className="admin-order-label">Agency:</b>
                            <div className="admin-order-value">{order.agency_id?.agency_name || 'Agency not available'}</div>
                          </div>

                          <div className="admin-order-detail">
                            <b className="admin-order-label">Status:</b>
                            <div className={order.status === "pending" ? "text-warning" : "text-success"}>{order.status}</div>
                          </div>

                          <div className="admin-order-products">
                            <b className="admin-order-products-title">Products:</b>
                            <div className="admin-order-product-details">
                              {order.order_product.length > 0 ? (
                                <ul className="admin-order-product-list">
                                  {order.order_product.map((product, index) => (
                                    <li key={`${order._id}-${index}`} className="admin-order-product-item">
                                      <div className="d-flex justify-content-between">
                                        <span className="admin-order-product-name">{product.name}</span>
                                        <span className="admin-order-product-price">RS.{product.price}</span>
                                      </div>
                                      <div className="d-flex justify-content-between">
                                        <span>Quantity:</span>
                                        <span>{product.quantity}</span>
                                      </div>
                                    </li>
                                  ))}
                                  <hr />
                                  <div className="d-flex justify-content-between">
                                    <b className="admin-order-product-name">Total Amount:</b>
                                    <div className="admin-order-product-price">RS.{order.total_amount}</div>
                                  </div>
                                </ul>
                              ) : (
                                <p className="admin-order-no-products">No products found</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleStatusUpdate(order._id, order.status)}
                          variant={order.status === "pending" ? "success" : "dark"}
                          className='me-2'
                        >
                          <FaExchangeAlt className='me-2' />
                          {order.status === "pending" ? "Delivered" : "Pending"}
                        </Button>
                        <Button
                          onClick={() => openModal(order._id)}
                          variant="danger"
                          className=''
                        >
                          <MdDelete /> Delete
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col xs={12}>
                  <p className="admin-order-no-orders">No Orders Available</p>
                </Col>
              )}
            </Row>

            {/* Pagination Controls */}
            <Pagination className="admin-order-pagination">
              {[...Array(Math.ceil(orders.length / ordersPerPage)).keys()].map(number => (
                <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => paginate(number + 1)}>
                  {number + 1}
                </Pagination.Item>
              ))}
            </Pagination>

            {/* Delete Confirmation Modal */}
            <Modal show={showModal} onHide={closeModal}>
              <Modal.Header closeButton>
                <Modal.Title>Confirm Delete</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure you want to delete this order?
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        )}
      </Container>
    </section>
  );
}

export default AdminOrder;
