import React, { useEffect, useState } from 'react';
import './archive.css';
import { useNavigate } from 'react-router-dom';
import Archive_minibar from './Archive_minibar';
import { useAuth } from '../../../store/Auth';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { CONFIGS } from '../../../../config';
import { MdOutlineSettingsBackupRestore } from 'react-icons/md';

const Archive = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    if (!isLoggedIn) {
      navigate('/');
      return;
    }

    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/viewarchivedorders`, {
        method: 'GET',
      });

      if (!response.ok) {
        console.log('No Orders');
        return;
      }

      const data = await response.json();
      console.log(data);
      
      setOrders(data.orders);
    } catch (error) {
      console.log('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(); // Fetch orders on component mount
  }, [isLoggedIn, navigate]);

  const handleStatusUpdate = async (orderId, currentStatus) => {
    const newStatus = currentStatus === "archive" ? "Pending" : "archive";
    try {
        const response = await fetch(`${CONFIGS.API_BASE_URL}/updateStatus/${orderId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        });
    
        if (response.ok) {
          // Fetch updated orders immediately
          await fetchOrders();
        } else {
          console.log('Failed to update order status');
        }
      } catch (error) {
        console.log('Error updating order status:', error);
      }
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="archive_container">
        <Archive_minibar />

        <div className="orders_list">
          <h1 className='text-center'>Archived Orders</h1>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Table striped bordered hover responsive>
            <thead>
              <tr>
              <th>Name</th>
                  <th>Address</th>
                  <th>Pincode</th>
                  <th>Phone No</th>
                  <th>Order Date</th>
                  <th>Time Slot</th>
                  <th>Agency</th>
                  <th>Status</th>
                  <th>Products</th>
                  <th>Qty.</th>
                  <th>Total</th>
                  <th>Restore</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.length > 0 ? (
                currentOrders.map(order => (
                  <tr key={order._id}>
                    <td>{order.cust_name}</td>
                      <td>{order.cust_address}</td>
                      <td>{order.pincode}</td>
                      <td>{order.cust_contact}</td>
                      <td>{new Date(order.order_date).toLocaleDateString('en-GB')}</td>
                      <td>{order.timeslot}</td>
                      <td>{order.agency_id?.agency_name || 'Agency not available'}</td>
                      <td className={order.status === "pending" ? "text-warning" : "text-success"}>{order.status}</td>
                      <td>
                        {order.order_product.length > 0 ? (
                          <ul>
                            {order.order_product.map((product, index) => (
                              // <li key={`${order._id}-${index}`}>
                               <p className='addcust'> {product.name}</p>
                              // </li>
                            ))}
                          </ul>
                        ) : (
                          <p>No products found</p>
                        )}
                      </td>
                      <td>{order.order_product.reduce((total, product) => total + product.quantity, 0)}</td>
                      <td>RS.{order.total_amount}</td>
                    <td>
                     
                      <MdOutlineSettingsBackupRestore 
                style={{ cursor: 'pointer', color: 'red' }} 
                size={24}
                onClick={() => handleStatusUpdate(order._id, order.status)}
                // onClick={() => handleDelete(inquiry._id)} 
              />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">No Orders Available</td>
                </tr>
              )}
            </tbody>
          </Table>
          )}
          {/* Pagination controls */}
          <div className="pagination">
            {[...Array(Math.ceil(orders.length / ordersPerPage)).keys()].map(number => (
              <Button 
                key={number + 1} 
                onClick={() => paginate(number + 1)} 
                className={number + 1 === currentPage ? 'active' : ''}
              >
                {number + 1}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Archive;
