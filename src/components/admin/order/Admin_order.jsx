import React, { useState, useEffect } from 'react';
import { Pagination, Card, Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../store/Auth';
import { CONFIGS } from '../../../../config/index';
import './admin_order.css';
import { MdDelete } from 'react-icons/md';

function Admin_order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(9); // Number of orders per page
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
      
      // Sort orders by date in descending order
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

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section>
      <Container>
        <h1>Orders List</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <Row>
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
                  <Col key={order._id} md={4} sm={6} xs={12} className="mb-3">
                    <Card className="order-card">
                      <Card.Body>
                        <div className="order-info">
                          <div className="d-flex mb-2">
                            <b className="w-25 font-weight-bold">Name:</b>
                            <div className="w-75">{order.cust_name}</div>
                          </div>
                          <div className="d-flex mb-2">
                            <b className="w-25 font-weight-bold">Address:</b>
                            <div className="w-75">{order.cust_address}</div>
                          </div>
                          <div className="d-flex mb-2">
                            <b className="w-25 font-weight-bold">Phone Number:</b>
                            <div className="w-75">{order.cust_number}</div>
                          </div>
                          <div className="d-flex mb-2">
                            <b className="w-25 font-weight-bold">Order Date:</b>
                            <div className="w-75">{new Date(order.order_date).toLocaleDateString()}</div>
                          </div>
                          <div className="d-flex mb-2">
                            <b className="w-25 font-weight-bold">Status:</b>
                            <div className="w-75">{order.status}</div>
                          </div>
                          <div className="d-flex mb-2">
                            <b className="w-25 font-weight-bold">Total Amount:</b>
                            <div className="w-75">RS.{order.total_amount}</div>
                          </div>
                          <div className="mt-3">
                            <b className="font-weight-bold">Products:</b>
                            <div className="product-details">
                              {order.order_product.length > 0 ? (
                                <ul className="list-unstyled">
                                  {order.order_product.map((product, index) => (
                                    <li key={index} className="product-item">
                                      <div className="d-flex justify-content-between">
                                        <span className="font-weight-bold">{product.name}</span>
                                        <span>RS.{product.price}</span>
                                      </div>
                                      <div className="d-flex justify-content-between">
                                        <span>Quantity:</span>
                                        <span>{product.quantity}</span>
                                      </div>
                                      <hr />
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p>No products found</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => openModal(order._id)}
                          variant="danger"
                          className='mt-2'
                        >
                          <MdDelete /> Delete
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col xs={12}>
                  <p className="text-center">No Orders Available</p>
                </Col>
              )}
            </Row>

            {/* Pagination Controls */}
            <Pagination>
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

export default Admin_order;
