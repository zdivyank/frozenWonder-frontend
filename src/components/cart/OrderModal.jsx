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
    cust_addresses: [{ address: '', label: 'Primary Address' }],
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

  const handleNewAddressChange = (value) => {
    setNewAddress(value);
  };

  const handleAddAddress = async () => {
    try {
      if (newAddress.trim() === '') {
        toast.error('Please enter an address before adding.');
        return;
      }
  
      const response = await fetch(`${CONFIGS.API_BASE_URL}/addAddress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cust_number: customerInfo.cust_number,
          address: newAddress,
          label: `Address ${customerInfo.cust_addresses.length + 1}`
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setCustomerInfo((prev) => ({
          ...prev,
          cust_addresses: data.cust_addresses, // Update with response data
        }));
        setNewAddress('');
      } else {
        toast.error('Failed to add address. Please try again.');
      }
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('An error occurred. Please try again.');
    }
  };
  const handleremoveAddress = async (index) => {
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/deleteAddress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cust_number: customerInfo.cust_number,
          addressIndex: index
        }),
      });

      if (response.ok) {
        setCustomerInfo((prev) => ({
          ...prev,
          cust_addresses: prev.cust_addresses.filter((_, i) => i !== index),
          selected_address: prev.selected_address > index ? prev.selected_address - 1 : 0
        }));
        toast.success('Address removed successfully');
      } else {
        toast.error('Failed to remove address. Please try again.');
      }
    } catch (error) {
      console.error('Error removing address:', error);
      toast.error('An error occurred. Please try again.');
    }
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

  const handleSelectAddress = (value) => {
    setCustomerInfo(prev => ({ ...prev, selected_address: parseInt(value) }));
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
                    name="address"
                    value={customerInfo.selected_address.toString()}
                    onChange={handleSelectAddress}
                    inline
                  >
                    {customerInfo.cust_addresses.map((address, index) => (
                      <RadioTile
                        key={index}
                        value={index.toString()}
                        icon={<Icon as={index === 0 ? FaHome : FaHome} />}
                        label={address.label}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{address.address}</span>
                          {index !== 0 && (
                            <button
                              type="button"
                              className="btn btn-danger btn-sm ml-2"
                              onClick={() => handleremoveAddress(index)}
                            >
                              <Icon as={FaTrash} />
                            </button>
                          )}
                        </div>
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
                      // style={{ alignSelf: 'flex-end' }}
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
