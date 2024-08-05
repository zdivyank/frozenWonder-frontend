import React, { useState, useEffect } from 'react';
import { Pagination, Card, Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../store/Auth';
import { CONFIGS } from '../../../../config/index';
import './admin_order.css';
import { MdDelete } from 'react-icons/md';

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
      const sortedOrders = data.message.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
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

  const handleDelete = async () => {
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/deleteorder/${selectedOrderId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setOrders(orders.filter(order => order._id !== selectedOrderId));
        setShowModal(false);
      } else {
        console.error('Error deleting order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
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

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

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
                            <div className="admin-order-value">{order.cust_address}</div>
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
                            <b className="admin-order-label">Status:</b>
                            <div className="admin-order-value">{order.status}</div>
                          </div>

                          <div className="admin-order-products">
                            <b className="admin-order-products-title">Products:</b>
                            <div className="admin-order-product-details">
                              {order.order_product.length > 0 ? (
                                <ul className="admin-order-product-list">
                                  {order.order_product.map((product, index) => (
                                    <li key={index} className="admin-order-product-item">
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
                          onClick={() => openModal(order._id)}
                          variant="danger"
                          className='admin-order-delete-btn'
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
              {[...Array(Math.ceil(orders.length / ordersPerPage)).keys()].map((number) => (
                <Pagination.Item
                  key={number + 1}
                  active={number + 1 === currentPage}
                  onClick={() => paginate(number + 1)}
                >
                  {number + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </>
        )}
      </Container>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this order?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}

export default AdminOrder;
