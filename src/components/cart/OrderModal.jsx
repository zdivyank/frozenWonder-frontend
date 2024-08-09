import React, { useState, useEffect } from 'react';
import { CONFIGS } from '../../../config';
import { toast } from 'react-toastify';
import './ordermodal.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

function OrderModal({ cartItems, total, onClose, setCartItems }) {
  const [customerInfo, setCustomerInfo] = useState({
    cust_name: '',
    cust_addresses: [{ address: '', label: 'Primary Address' }],
    selected_address: 0,
    cust_number: '',
    pincode: '',
    order_date: null,
    timeslot: '',
  });
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [blockedDates, setBlockedDates] = useState([]);

  useEffect(() => {
    fetchBlockedDates();
  }, []);

  const fetchBlockedDates = async () => {
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/blocked-dates`);
      if (response.ok) {
        const data = await response.json();
        setBlockedDates(data);
      } else {
        console.error('Failed to fetch blocked dates');
      }
    } catch (error) {
      console.error('Error fetching blocked dates:', error);
    }
  };

  const handleFetchCustomerDetails = async () => {
    if (!customerInfo.cust_number) {
      toast.error('Please enter a mobile number', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/isAlreadyuser`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cust_number: customerInfo.cust_number }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.response);
        
        if (data.response) {
          setCustomerInfo(prev => ({
            ...prev,
            cust_name: data.response[0].cust_name || '',
            cust_addresses: data.response[0].cust_addresses || [{ address: '', label: 'Primary Address' }],
            pincode: data.response[0].pincode || ''
          }));
          toast.success('Customer details fetched successfully!', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          toast.info('No existing customer found. Please fill in your details.', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      } else {
        throw new Error('Failed to fetch customer details');
      }
    } catch (error) {
      console.error('Error fetching customer details:', error);
      toast.error('Failed to fetch customer details. Please try again.', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      ...customerInfo,
      order_product: cartItems.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.packs[item.packIndex].price
      })),
      status: 'Pending',
      total_amount: total,
    };

    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/addorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        setIsOrderPlaced(true);
        for (const item of cartItems) {
          const stockUpdateResponse = await fetch(`${CONFIGS.API_BASE_URL}/updatestock`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              productId: item.product._id,
              packIndex: item.packIndex,
              quantity: item.quantity,
            }),
          });

          if (!stockUpdateResponse.ok) {
            const errorData = await stockUpdateResponse.json();
            console.error('Failed to update stock:', errorData.error);
          }
        }

        toast.success('Order placed successfully!', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setCartItems([]);
        onClose();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(`Failed to place order: ${error.message}`, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (index, e) => {
    const { value } = e.target;
    setCustomerInfo(prev => {
      const updatedAddresses = [...prev.cust_addresses];
      updatedAddresses[index].address = value;
      return { ...prev, cust_addresses: updatedAddresses };
    });
  };

  const handleAddAddress = () => {
    setCustomerInfo(prev => ({
      ...prev,
      cust_addresses: [...prev.cust_addresses, { address: '', label: `Address ${prev.cust_addresses.length + 1}` }],
    }));
  };

  const handleSelectAddress = (e) => {
    setCustomerInfo(prev => ({ ...prev, selected_address: parseInt(e.target.value, 10) }));
  };

  const handleDateChange = (date) => {
    setCustomerInfo(prev => ({ ...prev, order_date: date, timeslot: '' }));
  };

  const isDateDisabled = (date) => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    return blockedDates.some(blockedDate =>
      blockedDate.date === formattedDate &&
      (blockedDate.timeslot === 'fullday' || blockedDate.timeslot === 'all')
    );
  };

  const getAvailableTimeSlots = () => {
    if (!customerInfo.order_date) return [];
    
    const formattedDate = moment(customerInfo.order_date).format('YYYY-MM-DD');
    const blockedTimeslots = blockedDates
      .filter(blockedDate => blockedDate.date === formattedDate)
      .map(blockedDate => blockedDate.timeslot);

    const allTimeSlots = ['morning', 'evening'];
    return allTimeSlots.filter(slot => !blockedTimeslots.includes(slot));
  };

  return (
    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Order Summary</h5>
            <button type="button" className="close" onClick={onClose}>
              <span className='text-dark'>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {cartItems.map((item, index) => (
              <div key={index}>
                {item.product.name} - {item.product.packs[item.packIndex].ml}ML * {item.product.packs[item.packIndex].unit}
                - Quantity: {item.quantity}
                - Price: RS.{item.product.packs[item.packIndex].price * item.quantity}
              </div>
            ))}
            <h4>Total: RS.{total}</h4>
            <hr />
            <form onSubmit={handleSubmit}>
              <div className="order_container">
                <div className="form-group">
                  <label>Mobile Number:</label>
                  <div className="d-flex">
                    <input
                      type="tel"
                      name="cust_number"
                      value={customerInfo.cust_number}
                      onChange={handleInputChange}
                      className="order_info"
                      required
                    />
                    <button 
                      type="button" 
                      className="btn btn-secondary ml-2" 
                      onClick={handleFetchCustomerDetails}
                    >
                      Fetch Details
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="cust_name"
                    value={customerInfo.cust_name}
                    onChange={handleInputChange}
                    className="order_info"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Select Address:</label>
                  <select
                    name="selected_address"
                    value={customerInfo.selected_address}
                    onChange={handleSelectAddress}
                    className="order_info"
                    required
                  >
                    {customerInfo.cust_addresses.map((address, index) => (
                      <option key={index} value={index}>
                        {address.label} - {address.address}
                      </option>
                    ))}
                  </select>
                  <button 
                    type="button" 
                    className="btn btn-dark m-5" 
                    onClick={handleAddAddress}
                  >
                    +
                  </button>
                  {customerInfo.cust_addresses.map((address, index) => (
                    <div key={index} className="form-group">
                      <label>{address.label}:</label>
                      <input
                        type="text"
                        value={address.address}
                        onChange={(e) => handleAddressChange(index, e)}
                        className="order_info"
                      />
                    </div>
                  ))}
                </div>
                <div className="form-group">
                  <label>Date:</label>
                  <DatePicker
                    selected={customerInfo.order_date}
                    onChange={handleDateChange}
                    minDate={new Date()}
                    filterDate={(date) => !isDateDisabled(date)}
                    className="order_info"
                    placeholderText="Select a date"
                    required
                  />
                </div>
                {customerInfo.order_date && (
                  <div className="form-group">
                    <label>Timeslot:</label>
                    <select
                      name="timeslot"
                      value={customerInfo.timeslot}
                      onChange={handleInputChange}
                      className="order_info"
                      required
                    >
                      <option value="">Select a timeslot</option>
                      {getAvailableTimeSlots().map((slot, index) => (
                        <option key={index} value={slot}>
                          {slot.charAt(0).toUpperCase() + slot.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <button type="submit" className="btn btn-primary">
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderModal;
