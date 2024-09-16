import React, { useState, useEffect } from 'react';
import { Pagination, Table, Container, Button, Modal, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../store/Auth';
import { CONFIGS } from '../../../../config/index';
import './admin_order.css';
import { MdDelete } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { GrDocumentUpdate } from 'react-icons/gr';

function AdminOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(9);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pincodeData, setPincodeData] = useState([]); // Holds available pincodes
  const [selectedPincode, setSelectedPincode] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  // const [selectedPincode, setSelectedPincode] = useState('');
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();




  // const handleFilter = async () => {
  //   try {
  //     const queryParams = new URLSearchParams({
  //       pincode: selectedPincode,
  //       startDate: startDate?.toISOString(),
  //       endDate: endDate?.toISOString(),
  //     });

  //     const response = await fetch(`${CONFIGS.API_BASE_URL}/filter-orders?${queryParams.toString()}`);
  //     const data = await response.json();
  //     setOrders(data);
  //   } catch (error) {
  //     console.error('Error fetching filtered orders:', error);
  //   }
  // };
  const handleFilter = async () => {
    try {
      // Convert dates to ISO string format
      const queryParams = new URLSearchParams({
        pincode: selectedPincode,
        startDate: startDate ? startDate.toISOString() : '',
        endDate: endDate ? endDate.toISOString() : '',
      });

      const response = await fetch(`${CONFIGS.API_BASE_URL}/filter-orders?${queryParams.toString()}`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching filtered orders:', error);
    }
  };

  // const downloadExcel = () => {
  //   // Process orders to add serial number, format date, and exclude 'id'
  //   const processedOrders = orders.map((order, index) => {
  //     const { _id, cust_address, ...restOrder } = order; // Exclude the 'id' field

  //     // Handle multiple addresses by joining them into a single string if needed
  //     const addressString = Array.isArray(cust_address) ? cust_address.join(', ') : cust_address;

  //     const formattedDate = new Date(order.order_date).toLocaleDateString('en-GB'); // Format date as dd/mm/yyyy

  //     // Return the fields in the correct order
  //     return {
  //       serial_no: index + 1,  // Serial number starting from 1
  //       cust_name: order.cust_name,
  //       cust_number: order.cust_number,
  //       cust_address: addressString,  // Address placed right after serial number
  //       selected_address: order.selected_address,
  //       pincode: order.pincode,
  //       order_date: formattedDate,  // Formatted date
  //       timeslot: order.timeslot,
  //       order_product: order.order_product,
  //       status: order.status,
  //       total_amount: order.total_amount,
  //       agency_id: order.agency_id,
  //       coupon_code: order.coupon_code,
  //       assigned_delivery_boys: order.assigned_delivery_boys,
  //       blocked_dates: order.blocked_dates,
  //       // __v: order.__v,
  //       cust_contact: order.cust_contact,
  //     };
  //   });

  //   // Create the worksheet from processed orders
  //   const worksheet = XLSX.utils.json_to_sheet(processedOrders);

  //   // Create a new workbook and append the worksheet
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

  //   // Write the workbook to a buffer and trigger download
  //   const excelBuffer = XLSX.write(workbook, { bookType: 'xls', type: 'array' });
  //   const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
  //   saveAs(data, 'filtered_orders.xls'); // Ensure the file extension is .xlsx
  // };


  const downloadExcel = () => {
    // Process orders to add serial number, format date, and exclude 'id'
    const processedOrders = orders.map((order, index) => {
      const { _id, cust_address, order_product, ...restOrder } = order; // Exclude the 'id' field

      // Handle multiple addresses by joining them into a single string if needed
      const addressString = Array.isArray(cust_address) ? cust_address.join(', ') : cust_address;

      const formattedDate = new Date(order.order_date).toLocaleDateString('en-GB'); // Format date as dd/mm/yyyy

      // Format order_product into a string
      const productsString = order_product.map(product =>
        `${product.name} (Qty: ${product.quantity}, Price: ${product.price})`
      ).join(', ');

      // Return the fields in the correct order
      return {
        serial_no: index + 1,  // Serial number starting from 1
        cust_name: order.cust_name,
        cust_number: order.cust_number,
        cust_address: addressString,  // Address placed right after serial number
        selected_address: order.selected_address,
        pincode: order.pincode,
        order_date: formattedDate,  // Formatted date
        timeslot: order.timeslot,
        order_product: productsString,  // Convert array of objects to string
        status: order.status,
        total_amount: order.total_amount,
        agency_id: order.agency_id,
        coupon_code: order.coupon_code,
        assigned_delivery_boys: order.assigned_delivery_boys,
        blocked_dates: JSON.stringify(order.blocked_dates), // Optionally stringify blocked_dates
        cust_contact: order.cust_contact,
        unique_code: order.unique_code,
      };
    });

    // Create the worksheet from processed orders
    const worksheet = XLSX.utils.json_to_sheet(processedOrders);

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    // Write the workbook to a buffer and trigger download
    const excelBuffer = XLSX.write(workbook, { bookType: 'xls', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, 'filtered_orders.xls'); // Ensure the file extension is .xlsx
  };


  // Fetch all available pincodes
  const fetchAllPincodes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/allPincode`, {
        method: "GET",
      });

      if (!response.ok) {
        console.log("No Pincode Found");
        return;
      }

      const data = await response.json();
      setPincodeData(data.pincodes || []);
    } catch (error) {
      console.log("Error fetching pincodes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders based on selected pincode
  const fetchOrdersByPincode = async (pincode) => {
    setLoading(true);
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/orderlocation`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pincode }),
      });

      if (!response.ok) {
        console.log('No orders found for selected pincode');
        return;
      }

      const data = await response.json();
      console.log(data);

      setOrders(data.orders || []);
    } catch (error) {
      console.log("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all orders initially
  const fetchOrders = async () => {
    setLoading(true);
    if (!isLoggedIn) {
      navigate('/');
      return;
    }

    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/viewvalidorders`, {
        method: 'GET',
      });

      if (!response.ok) {
        console.log('No Orders');
        return;
      }

      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.log('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPincodes(); // Fetch available pincodes
    fetchOrders(); // Fetch all orders initially
  }, [isLoggedIn, navigate]);

  const handleStatusUpdate = async (orderId, currentStatus) => {
    const newStatus = currentStatus === "Pending" ? "archive" : "Pending";
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


  const handleStatus = async (orderId, selectedStatus) => {
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/updateStatus/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: selectedStatus }), // Use selected status from dropdown
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

  const handleDelete = async () => {
    if (selectedOrderId) {
      try {
        // Update the status of the order to 'archive'
        await handleStatusUpdate(selectedOrderId, 'Pending');
        // Fetch updated orders immediately
        await fetchOrders();
        closeModal(); // Close the modal after updating the status
      } catch (error) {
        console.log('Error updating order status to archive:', error);
      }
    }
  };


  const openModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowModal(true);
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handledownload = async () => {
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/downloadexcel`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'orders.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        console.error('Failed to download file');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePincodeChange = (e) => {
    const pincode = e.target.value;
    setSelectedPincode(pincode);
    fetchOrdersByPincode(pincode); // Fetch orders by pincode
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrderId(null);
  };

  return (
    <section className="admin-order-section text-center">
      <Container className='text-center'>
        <h1 className="mt-3">Orders List</h1>



        <div className='m-3'>
          <label>Select Date Range:</label>

          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Start Date"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            placeholderText="End Date"
          />

          <button
            className='btn btn-success mt-3 mb-3 m-3'
            onClick={handleFilter}
          >
            GO
          </button>
        </div>



        <div className="mt-3 mb-3 ">
          <h4>Pincode Filter:</h4>
          <Form.Control as="select" size="md" value={selectedPincode} onChange={handlePincodeChange} className="custom-select">
            <option value="">All pincodes</option>
            {pincodeData.map((pincode, index) => (
              <option key={index} value={pincode}>
                {pincode}
              </option>
            ))}
          </Form.Control>
        </div>
        <button className='btn btn-dark mt-3 mb-3 m-3' onClick={downloadExcel}>Filter Data Excel</button>


        <button className='btn btn-dark mt-3 mb-3 m-3' onClick={handledownload}>All Data excel</button>

        {loading ? (
          <p className="admin-order-loading">Loading...</p>
        ) : (
          <>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Unique code</th>
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <tr key={order._id}>
                      {
                        order.unique_code ?
                          <td className='text-center'>
                            {order.unique_code}</td>

                          : <td className='text-center'>-</td>

                      }

                      <td>{order.cust_name}</td>
                      {/* <td>{order.cust_address}</td> */}
                      <td>
                        {order.cust_address && order.selected_address !== null
                          ? order.cust_address[order.selected_address]
                          : 'No address selected'}
                      </td>
                      <td>{order.pincode}</td>
                      <td>{order.cust_contact}</td>
                      <td>{new Date(order.order_date).toLocaleDateString('en-GB')}</td>
                      <td>{order.timeslot}</td>
                      <td>{order.agency_id?.agency_name || 'Agency not available'}</td>
                      <td>
                        <select
                          className={
                            order.status === "Pending"
                              ? "text-warning"
                              : order.status === "Delivered"
                                ? "text-success"
                                : "text-danger"
                          }
                          value={order.status}
                          onChange={(e) => handleStatus(order._id, e.target.value)} // Call function with selected status
                        >
                          <option value="Pending" className="text-warning">
                            Pending
                          </option>
                          <option value="Delivered" className="text-success">
                            Delivered
                          </option>
                          <option value="Canceled" className="text-danger">
                            Canceled
                          </option>
                        </select>
                      </td>

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
                        <Link to={`/admin/order/${order._id}`} variant="danger">
                          <GrDocumentUpdate />
                        </Link>
                      </td>
                      <td>
                        <Button onClick={() => openModal(order._id)} variant="danger">
                          <MdDelete />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="text-center">No Orders Available</td>
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
