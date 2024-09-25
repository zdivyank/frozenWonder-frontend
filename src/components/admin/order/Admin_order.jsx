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
import { toast } from 'react-toastify';
import { CiEdit } from 'react-icons/ci';

function AdminOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pincodeData, setPincodeData] = useState([]); // Holds available pincodes
  const [selectedPincode, setSelectedPincode] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState('');

  // const [editedOrder, setEditedOrder] = useState();
  // const [selectedPincode, setSelectedPincode] = useState('');
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [editedOrder, setEditedOrder] = useState({
    cust_name: "",
    cust_address: "",
    pincode: "",
    status: "Pending",
    reason: "",
    area: "",
    landmark: "",
  });




  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;

  //   setEditedOrder((prevOrder) => ({
  //     ...prevOrder,
  //     [name]: value, // Dynamically update the field by name
  //   }));
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update the state for the corresponding field
    setEditedOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value || "", // If value is empty, set to an empty string
    }));
  };


  useEffect(() => {
    console.log("Edited order updated:", editedOrder);
  }, [editedOrder]);



  const handleEdit = (order) => {
    setEditedOrder(order); // Set the specific order being edited
    setIsEditing(true);
  };

  const handleAddressChange = (e, index) => {
    const { value } = e.target;

    setEditedOrder((prevOrder) => ({
      ...prevOrder,
      cust_address: prevOrder.cust_address.map((address, i) =>
        i === index ? value : address
      )
    }));
  };


  const handleSave = async () => {
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/editorder/${editedOrder._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cust_name: editedOrder.cust_name,
          cust_address: editedOrder.cust_address,
          pincode: editedOrder.pincode,
          status: editedOrder.status,
          reason: editedOrder.reason,
          area: editedOrder.area,
          landmark: editedOrder.landmark,
          // Add other fields here if needed
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update the order');
      }

      const data = await response.json();
      console.log('Order updated successfully:', data);

      // After a successful update, reset the editing state
      // setIsEditing(false);
      setEditedOrder({});
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === editedOrder._id ? { ...order, ...editedOrder } : order
        )
      );

      setIsEditing(false);
      setEditedOrder({});
      // Optionally, you can fetch updated orders here
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };
  // a
  //   const handleFilter = async () => {
  //     try {
  //       // Convert dates to ISO string format
  //       const queryParams = new URLSearchParams({
  //         pincode: selectedPincode,
  //         startDate: startDate ? startDate.toISOString() : '',
  //         endDate: endDate ? endDate.toISOString() : '',
  //         status: selectedStatus,
  //       });

  //       const response = await fetch(`${CONFIGS.API_BASE_URL}/filter-orders?${queryParams.toString()}`);
  //       const data = await response.json();
  //       setOrders(data);
  //     } catch (error) {
  //       console.error('Error fetching filtered orders:', error);
  //     }
  //   };

  const handleFilter = async () => {
    try {
      const queryParams = new URLSearchParams();

      console.log(":::", queryParams);

      if (selectedPincode) {
        queryParams.append('pincode', selectedPincode);
      }
      if (startDate) {
        queryParams.append('startDate', startDate.toISOString().split('T')[0]); // Convert to YYYY-MM-DD
      }
      if (endDate) {
        queryParams.append('endDate', endDate.toISOString().split('T')[0]); // Convert to YYYY-MM-DD
      }
      if (selectedStatus) {
        queryParams.append('status', selectedStatus);
      }

      const response = await fetch(`${CONFIGS.API_BASE_URL}/filter-orders?${queryParams.toString()}`);
      const data = await response.json();
      console.log(data);

      setOrders(data);
    } catch (error) {
      console.error('Error fetching filtered orders:', error);
    }
  };

  const handleEndDateChange = (date) => {
    const selectedEndDate = new Date(date);
    selectedEndDate.setHours(23, 59, 59, 999); // Adjust the time
    setEndDate(selectedEndDate);
    console.log('Start Date:', startDate); // Log start date
    console.log('End Date:', selectedEndDate); // Log end date
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
        unique_code: order.unique_code,
        cust_name: order.cust_name,
        cust_address: addressString,  // Address placed right after serial number
        selected_address: order.selected_address,
        area: order.area,
        landmark: order.landmark,
        pincode: order.pincode,
        cust_contact: order.cust_contact,
        order_date: formattedDate,
        timeslot: order.timeslot,
        status: order.status,
        reason: order.reason,
        order_product: productsString,  // Convert array of objects to string
        total_amount: order.total_amount,
        cust_number: order.cust_number,
        // agency_id: order.agency_id,
        // coupon_code: order.coupon_code,
        // assigned_delivery_boys: order.assigned_delivery_boys,
        // blocked_dates: JSON.stringify(order.blocked_dates), 
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
  const fetchOrdersByStatus = async (status) => {
    setLoading(true);
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/orderstatus`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
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

  // const indexOfLastOrder = currentPage * ordersPerPage;
  // const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  // const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const itemsPerPage = 10; // Define how many items per page
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
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

  const handleStatusChange = (e) => {
    const status = e.target.value;
    setSelectedStatus(status);
    fetchOrdersByStatus(status); // Fetch orders by pincode
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedOrderId(null);
  };

  return (
    <div className="admin-order-section text-center">
      <div className='text-center m-3 '>
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
            dateFormat="dd/MM/yyyy" // Set date format
          />
          {/* <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            placeholderText="End Date"
            dateFormat="dd/MM/yyyy" // Set date format
          /> */}

          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange} // Use the custom handler here
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            placeholderText="End Date"
            dateFormat="dd/MM/yyyy"
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
          <Form as="select" size="sm" value={selectedPincode} onChange={handlePincodeChange} className="custom-select">
            <option value="">All pincodes</option>
            {pincodeData.map((pincode, index) => (
              <option key={index} value={pincode}>
                {pincode}
              </option>
            ))}
          </Form>
        </div>

        {/* <div className="mt-3 mb-3">
        <h4>Status Filter:</h4>
        <Form.Control as="select" size="md" value={selectedStatus} onChange={handleStatusChange} className="custom-select">
          <option value="">All statuses</option>
          <option value="Pending">Pending</option>
          <option value="Delivered">Delivered</option>
          <option value="Canceled">Canceled</option>
        </Form.Control>
      </div> */}

        <button className='btn btn-dark mt-3 mb-3 m-3' onClick={downloadExcel}>Filter Data Download</button>


        <button className='btn btn-dark mt-3 mb-3 m-3' onClick={handledownload}>All Data Download</button>

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
                  {/* <th>Status</th> */}
                  <th> <Form as="select" size="sm" value={selectedStatus} onChange={handleStatusChange} className="custom-select">
                    <option value="">status</option>
                    <option value="Pending">Pending</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Canceled">Canceled</option>
                  </Form></th>
                  <th>Reason</th>
                  <th>Products</th>
                  <th>Qty.</th>
                  <th>Total</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="text-center">
                        {order.unique_code || '-'}
                      </td>

                      {/* Editable Name Field */}
                      <td>
                        {isEditing && editedOrder._id === order._id ? (
                          <input
                            type="text"
                            name="cust_name"
                            value={editedOrder.cust_name || ""}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        ) : (
                          order.cust_name
                        )}
                      </td>

                      {/* Editable Address Field */}
                      <td>

                        {isEditing && editedOrder._id === order._id ? (
                          <>
                            <textarea
                              name={`cust_address_${order.selected_address}`} // Unique name for each address field
                              value={editedOrder.cust_address[order.selected_address] || ""}
                              onChange={(e) => handleAddressChange(e, order.selected_address)} // Use a new handle function for address
                              className="form-control"
                            />
                            <input
                              type="text"
                              name="area"
                              value={editedOrder.area || ""}  // Ensuring controlled input with fallback
                              onChange={handleInputChange}
                              className="form-control text-primary"
                            />

                            <input
                              type="text"
                              name="landmark"
                              value={editedOrder.landmark || ""}  // Ensuring controlled input with fallback
                              onChange={handleInputChange}
                              className="form-control text-danger"
                            />

                          </>

                        ) : (
                          order.cust_address && order.selected_address !== null && order.cust_address[order.selected_address] ? (
                            <>
                              {order.cust_address[order.selected_address]}
                              {order.area && <span className="text-primary">, {order.area}</span>}
                              {order.landmark && <span className="text-danger">, {order.landmark}</span>}
                            </>
                          ) : 'No address selected'
                        )}
                      </td>

                      {/* Non-editable Pincode */}
                      <td>
                        {order.pincode}
                      </td>

                      {/* Non-editable Phone Number */}
                      <td>{order.cust_contact}</td>

                      {/* Non-editable Order Date */}
                      <td>{new Date(order.order_date).toLocaleDateString('en-GB')}</td>

                      {/* Non-editable Time Slot */}
                      <td>{order.timeslot}</td>

                      {/* Non-editable Agency */}
                      <td>{order.agency_id?.agency_name || 'Agency not available'}</td>

                      {/* Editable Status */}
                      <td>
                        {isEditing && editedOrder._id === order._id ? (
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
                        ) : (
                          <span
                            className={
                              order.status === "Pending"
                                ? "text-warning"
                                : order.status === "Delivered"
                                  ? "text-success"
                                  : "text-danger"
                            }
                          >
                            {order.status}
                          </span>
                        )}
                      </td>

                      {/* Editable Reason Field */}
                      <td>
                        {isEditing && editedOrder._id === order._id ? (
                          <input
                            type="text"
                            name="reason"
                            value={editedOrder.reason || ""}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        ) : (
                          order.reason || 'N/A'
                        )}
                      </td>

                      {/* Products List */}
                      <td>
                        {order.order_product.length > 0 ? (
                          <ul>
                            {order.order_product.map((product, index) => (
                              <p key={index} className="addcust">{product.name}</p>
                            ))}
                          </ul>
                        ) : 'No products found'}
                      </td>

                      {/* Non-editable Quantity */}
                      <td>{order.order_product.reduce((total, product) => total + product.quantity, 0)}</td>

                      {/* Non-editable Total Amount */}
                      <td>RS. {order.total_amount}</td>

                      {/* Edit/Save Button */}
                      <td>
                        {isEditing && editedOrder._id === order._id ? (
                          <button onClick={handleSave} className="btn btn-success">
                            Save
                          </button>
                        ) : (
                          // <button onClick={() => handleEdit(order)} className="btn btn-primary">
                          <CiEdit onClick={() => handleEdit(order)} className="text-center text-primary" size={25} />
                          // </button>
                        )}
                      </td>

                      {/* Delete Button */}
                      <td>
                        {/* <Button onClick={() => openModal(order._id)} variant="danger"> */}
                        <MdDelete onClick={() => openModal(order._id)} size={25} className='text-danger' />
                        {/* </Button> */}
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
              {[...Array(Math.ceil(orders.length / itemsPerPage)).keys()].map(number => (
                <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => setCurrentPage(number + 1)}>
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
      </div>
    </div>
  );
}

export default AdminOrder;
