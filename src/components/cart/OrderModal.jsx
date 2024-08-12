import React, { useState, useEffect } from 'react';
import { CONFIGS } from '../../../config';
import { toast } from 'react-toastify';
import './ordermodal.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { RadioGroup, Radio, Input } from 'rsuite';
import { RadioTileGroup, RadioTile } from 'rsuite';
import { Icon } from '@rsuite/icons';
import { FaHome, FaBuilding, FaPlus, FaTrash } from 'react-icons/fa';

function OrderModal({ cartItems, total, onClose, setCartItems }) {
  const [customerInfo, setCustomerInfo] = useState({
    cust_name: '',
    cust_address: [],
    selected_address: 0,
    cust_number: '',
    pincode: '',
    order_date: null,
    timeslot: '',
  });
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [blockedDates, setBlockedDates] = useState([]);
  const [newAddress, setNewAddress] = useState('');

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
      toast.error('Please enter a mobile number');
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
        if (data.response && data.response.length > 0) {
          setCustomerInfo(prev => ({
            ...prev,
            cust_name: data.response[0].cust_name || '',
            cust_address: data.response[0].cust_address || [],
            pincode: data.response[0].pincode || ''
          }));
          toast.success('Customer details fetched successfully!');
        } else {
          toast.info('No existing customer found. Please fill in your details.');
        }
      } else {
        throw new Error('Failed to fetch customer details');
      }
    } catch (error) {
      console.error('Error fetching customer details:', error);
      toast.error('Failed to fetch customer details. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (customerInfo.selected_address < 0 || customerInfo.selected_address >= customerInfo.cust_address.length) {
      toast.error('Please select a valid address');
      return;
    }

    const orderData = {
      ...customerInfo,
      selected_address: customerInfo.selected_address + 1,
      order_product: cartItems.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.packs[item.packIndex].price
      })),
      total_amount: total,
      order_date: customerInfo.order_date ? moment(customerInfo.order_date).format('YYYY-MM-DD') : null
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
        const data = await response.json();
        setIsOrderPlaced(true);
        toast.success(data.message);
        onClose();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(`Failed to place order: ${error.message}`);
    }
  };

  const handleSelectAddress = (value) => {
    setCustomerInfo(prev => ({ ...prev, selected_address: parseInt(value, 10) }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleNewAddressChange = (value) => {
    setNewAddress(value);
  };

  const handleAddAddress = () => {
    if (newAddress.trim() === '') {
      toast.error('Please enter an address before adding.');
      return;
    }
    setCustomerInfo(prev => ({
      ...prev,
      cust_address: [...prev.cust_address, newAddress]
    }));
    setNewAddress('');
  };

  const handleRemoveAddress = (index) => {
    setCustomerInfo(prev => ({
      ...prev,
      cust_address: prev.cust_address.filter((_, i) => i !== index),
      selected_address: prev.selected_address > index ? Math.max(0, prev.selected_address - 1) : prev.selected_address
    }));
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
                  <label>Address:</label>
                  <RadioTileGroup
                    name="selected_address"
                    value={customerInfo.selected_address.toString()}
                    onChange={handleSelectAddress}
                    inline
                  >
                    {customerInfo.cust_address.map((address, index) => (
                      <RadioTile
                        key={index}
                        value={index.toString()}
                        icon={<Icon as={FaHome} />}
                        label={`Address ${index + 1}`}
                      >
                        {address}
                        <button
                          type="button"
                          className="btn btn-danger btn-sm ml-2"
                          onClick={() => handleRemoveAddress(index)}
                        >
                          <Icon as={FaTrash} />
                        </button>
                      </RadioTile>
                    ))}
                  </RadioTileGroup>
                  <div className="d-flex mt-2">
                    <Input
                      as="textarea"
                      rows={3}
                      placeholder="Enter new address"
                      value={newAddress}
                      onChange={handleNewAddressChange}
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      className="btn btn-success ml-2"
                      onClick={handleAddAddress}
                    >
                      <Icon as={FaPlus} />
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Pincode:</label>
                  <input
                    type="text"
                    name="pincode"
                    value={customerInfo.pincode}
                    onChange={handleInputChange}
                    className="order_info"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Order Date:</label>
                  <DatePicker
                    selected={customerInfo.order_date}
                    onChange={handleDateChange}
                    minDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                    className="order_info"
                    filterDate={date => !isDateDisabled(date)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Time Slot:</label>
                  <select
                    name="timeslot"
                    value={customerInfo.timeslot}
                    onChange={handleInputChange}
                    className="order_info"
                    required
                  >
                    <option value="" disabled>Select a time slot</option>
                    {getAvailableTimeSlots().map(slot => (
                      <option key={slot} value={slot}>
                        {slot === 'morning' ? 'Morning (9AM - 12PM)' : 'Evening (4PM - 7PM)'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-block mt-3">
                Place Order
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderModal;