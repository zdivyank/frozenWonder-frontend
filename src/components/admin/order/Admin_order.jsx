import React, { useState, useEffect } from 'react';
import { Pagination, Table, Container, Button, Modal } from 'react-bootstrap';
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

      if (response.ok) {
        const updatedOrders = orders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        );
        
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
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Pincode</th>
                  <th>Phone Number</th>
                  <th>Order Date</th>
                  <th>Time Slot</th>
                  <th>Agency</th>
                  <th>Status</th>
                  <th>Products</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <tr key={order._id}>
                      <td>{order.cust_name}</td>
                      <td>{getSelectedAddress(order)}</td>
                      <td>{order.pincode}</td>
                      <td>{order.cust_number}</td>
                      <td>{new Date(order.order_date).toLocaleDateString()}</td>
                      <td>{order.timeslot}</td>
                      <td>{order.agency_id?.agency_name || 'Agency not available'}</td>
                      <td className={order.status === "pending" ? "text-warning" : "text-success"}>{order.status}</td>
                      <td>
                        {order.order_product.length > 0 ? (
                          <ul>
                            {order.order_product.map((product, index) => (
                              <li key={`${order._id}-${index}`}>
                                <div className="d-flex justify-content-between">
                                  <span>{product.name}</span>
                                  <span>RS.{product.price}</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                  <span>Quantity:</span>
                                  <span>{product.quantity}</span>
                                </div>
                              </li>
                            ))}
                            <hr />
                            <div className="d-flex justify-content-between">
                              <b>Total Amount:</b>
                              <div>RS.{order.total_amount}</div>
                            </div>
                          </ul>
                        ) : (
                          <p>No products found</p>
                        )}
                      </td>
                      <td>
                        {/* <Button
                          onClick={() => handleStatusUpdate(order._id, order.status)}
                          variant={order.status === "pending" ? "success" : "dark"}
                          className='me-2'
                        >
                          <FaExchangeAlt className='me-2' />
                          {order.status === "pending" ? "Delivered" : "Pending"}
                        </Button> */}
                        <Button
                          onClick={() => openModal(order._id)}
                          variant="danger"
                        >
                          <MdDelete /> Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center">No Orders Available</td>
                  </tr>
                )}
              </tbody>
            </Table>

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
