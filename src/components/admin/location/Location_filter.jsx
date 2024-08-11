import React, { useState, useEffect } from 'react';
import { Dropdown } from 'rsuite';
import { FaEdit } from 'react-icons/fa'; // Importing the edit icon
import { MdPendingActions } from 'react-icons/md';
import { CONFIGS } from '../../../../config';
import './location_filter.css';

function LocationFilter() {
    const [pincodeData, setPincodeData] = useState([]);
    const [selectedPincode, setSelectedPincode] = useState('');
    const [orders, setOrders] = useState([]);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);
    const [orderStatus, setOrderStatus] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false); // Add loading state
    const ordersPerPage = 6; // Number of orders to show per page

    // Fetch all pincode data
    const fetchAllPincodes = async () => {
        setLoading(true); // Set loading true when starting fetch
        try {
            const response = await fetch(`${CONFIGS.API_BASE_URL}/allPincode`, {
                method: "GET",
            });

            if (!response.ok) {
                console.log("No Pincode Found");
                return;
            }

            const data = await response.json();
            console.log(data.pincodes);
            
            setPincodeData(data.pincodes || []);
        } catch (error) {
            console.log("Error fetching pincodes:", error);
        } finally {
            setLoading(false); // Set loading false when fetch is complete
        }
    };

    const fetchOrders = async (pincode) => {
        setLoading(true); // Set loading true when starting fetch
        try {
            const response = await fetch(`${CONFIGS.API_BASE_URL}/orderlocation`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pincode }),
            });
    
            if (!response.ok) {
                console.log(`No orders found for selected pincodes`);
                return;
            }
    
            const data = await response.json();
            console.log(data);
            
            console.log('Fetched Orders:', data.orders); 
    
            setOrders(data.orders || []);
    
            // Initialize status state
            const statusMap = data.orders.reduce((map, order) => {
                map[order._id] = order.status;
                return map;
            }, {});
            setOrderStatus(statusMap);
        } catch (error) {
            console.log("Error fetching orders:", error);
        } finally {
            setLoading(false); // Set loading false when fetch is complete
        }
    };
    
    useEffect(() => {
        fetchAllPincodes();
    }, []);

    useEffect(() => {
        if (selectedPincode) {
            fetchOrders(selectedPincode);
        } else {
            setOrders([]);
        }
    }, [selectedPincode]);

    // Handle pincode selection and update the Dropdown title
    const handleSelect = (eventKey) => {
        setSelectedPincode(eventKey);
        setCurrentPage(1); // Reset to the first page when pincode changes
    };

    // Handle status change
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await fetch(`${CONFIGS.API_BASE_URL}/updateStatus/${orderId}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                console.log(`Failed to update status`);
                return;
            }

            // Update local state
            setOrderStatus(prevStatus => ({
                ...prevStatus,
                [orderId]: newStatus,
            }));
        } catch (error) {
            console.log("Error updating status:", error);
        }
    };

    // Handle edit click
    const handleEditClick = (orderId) => {
        setUpdatingOrderId(orderId);
    };

    // Handle status dropdown change
    const handleDropdownSelect = (value) => {
        if (updatingOrderId) {
            handleStatusChange(updatingOrderId, value);
            setUpdatingOrderId(null);
        }
    };

    // Pagination logic
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orders.length / ordersPerPage);

    return (
        <div className='location_main'>
            <div className="location_container">
                <h1>Location Filter</h1>
                <Dropdown title={selectedPincode || "Select Pincode"} onSelect={handleSelect}>
                    {pincodeData.map((pincode, index) => (
                        <Dropdown.Item key={index} eventKey={pincode}>
                            {pincode}
                        </Dropdown.Item>
                    ))}
                </Dropdown>

                <hr />
                <br />
                <div className="filter">
                    {loading ? (
                      <img src="/img/load.gif" alt=""  className='loading_screen text-center'/>
                    ) : (
                        <div className="order-grid">
                            {currentOrders.length > 0 ? (
                                currentOrders.map((order, index) => (
                                    <div key={index} className="pincode_item">
                                        <p>Name: {order.cust_name}</p>
                                        <p>Address: {order.cust_address}</p>
                                        <p>Order_date: {order.order_date}</p>
                                        <p>Status: {orderStatus[order._id]}</p>

                                        {/* Edit icon */}
                                        <FaEdit onClick={() => handleEditClick(order._id)} style={{ cursor: 'pointer' }} />

                                        {/* Dropdown for status selection */}
                                        {updatingOrderId === order._id && (
                                            <>
                                                <hr />
                                                <b>Update Status:</b>
                                                <Dropdown title={orderStatus[order._id] || "Select Status"} onSelect={handleDropdownSelect}>
                                                    <Dropdown.Item eventKey="Pending">
                                                        <MdPendingActions className='btn btn-danger' />
                                                        Pending
                                                    </Dropdown.Item>
                                                    <Dropdown.Item eventKey="Delivered">Delivered</Dropdown.Item>
                                                </Dropdown>
                                            </>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>No orders found for selected pincodes</p>
                            )}
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span>Page {currentPage} of {totalPages}</span>
                            <button
                                onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LocationFilter;
