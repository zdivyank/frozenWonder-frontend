import React, { useState, useEffect } from 'react';
import { CONFIGS } from '../../../config';
import { toast } from 'react-toastify';
import './ordermodal.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { RadioGroup, Radio, Input, RadioTileGroup, RadioTile } from 'rsuite';
import { Icon } from '@rsuite/icons';
import { FaHome, FaPlus, FaTrash } from 'react-icons/fa';

function OrderModal({ cartItems, total, onClose, setCartItems }) {
  const [customerInfo, setCustomerInfo] = useState({
    cust_name: '',
    cust_addresses: [],
    selected_address: null,
    cust_number: '',
    pincode: '',
    order_date: null,
    timeslot: '',
    isNewUser: true,
  });
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [blockedDates, setBlockedDates] = useState([]);
  const [newAddress, setNewAddress] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

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
          const customer = data.response[0];
          setCustomerInfo(prev => ({
            ...prev,
            cust_name: customer.cust_name || '',
            cust_addresses: customer.cust_address || [], // This should now be an array of addresses
            selected_address: customer.selected_address ? parseInt(customer.selected_address) : 1,
            pincode: customer.pincode || '',
            isNewUser: false,
          }));
          toast.success('Customer details fetched successfully!');
        } else {
          setCustomerInfo(prev => ({
            ...prev,
            cust_name: '',
            cust_addresses: [],
            selected_address: null,
            pincode: '',
            isNewUser: true,
          }));
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
    if (isSubmitting) return; // Prevent multiple submissions

    setIsSubmitting(true);

    if (customerInfo.cust_addresses.length === 0) {
      toast.error('Please add at least one address');
      return;
    }

    // Adjust selected_address to be 0-based for the backend
    const adjustedSelectedAddress = customerInfo.selected_address - 1;

    // Ensure the adjusted address is within valid range
    if (adjustedSelectedAddress < 0 || adjustedSelectedAddress >= customerInfo.cust_addresses.length) {
      toast.error('Invalid selected address');
      return;
    }

    const orderData = {
      cust_name: customerInfo.cust_name,
      cust_address: customerInfo.cust_addresses,
      selected_address: adjustedSelectedAddress,
      cust_number: customerInfo.cust_number,
      pincode: customerInfo.pincode,
      order_product: cartItems.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.packs[item.packIndex].price
      })),
      total_amount: total,
      order_date: customerInfo.order_date ? moment(customerInfo.order_date).format('YYYY-MM-DD') : null,
      timeslot: customerInfo.timeslot
    };

    console.log('Order Data:', orderData);

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
        console.log(data);
        setIsOrderPlaced(true);
        toast.success(data.message);
        onClose();
      } else {
        const errorData = await response.json();
        console.log(errorData);
        throw new Error(errorData.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(`Failed to place order: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectAddress = (value) => {
    setCustomerInfo(prev => ({ ...prev, selected_address: Number(value) + 1 }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleNewAddressChange = (value) => {
    setNewAddress(value);
  };

  const handleAddAddress = async () => {
    if (newAddress.trim() === '') {
      toast.error('Please enter an address before adding.');
      return;
    }

    try {
      const updatedAddresses = [...customerInfo.cust_addresses, newAddress];
      setCustomerInfo(prev => ({
        ...prev,
        cust_addresses: updatedAddresses,
        selected_address: updatedAddresses.length, // This will be 1-based
      }));

      if (!customerInfo.isNewUser) {
        const response = await fetch(`${CONFIGS.API_BASE_URL}/addAddress`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cust_number: customerInfo.cust_number,
            address: newAddress,
          }),
        });

        if (response.ok) {
          toast.success('Address added successfully');
        }
      } else {
        toast.success('Address added successfully');
      }
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error(`Failed to add address: ${error.message}`);
    }

    setNewAddress('');
  };

  const handleRemoveAddress = async (index) => {
    try {
      // Update the state first
      setCustomerInfo(prev => {
        const updatedAddresses = prev.cust_addresses.filter((_, i) => i !== index);
        const updatedSelectedAddress =
          prev.selected_address === index ?
            (updatedAddresses.length > 0 ? 0 : null) :
            (prev.selected_address > index ? prev.selected_address - 1 : prev.selected_address);

        return {
          ...prev,
          cust_addresses: updatedAddresses,
          selected_address: updatedSelectedAddress,
        };
      });
      console.log(index);

      // If the user is not new, attempt to delete the address from the backend
      if (!customerInfo.isNewUser) {
        const response = await fetch(`${CONFIGS.API_BASE_URL}/delete-address`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cust_number: customerInfo.cust_number,
            selected_address: index,
          }),
        });

        if (response.ok) {
          toast.success('Address removed successfully');
        } else {
          const errorData = await response.json();
          console.log('Error data from server:', errorData);

          throw new Error(errorData.message || 'Failed to remove address');
        }
      } else {
        toast.success('Address removed successfully');
      }
    } catch (error) {
      console.error('Error removing address:', error);
      toast.error(`Failed to remove address: ${error.message}`);
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
                  {customerInfo.cust_addresses.length > 0 && (
                    <RadioTileGroup
                      name="selected_address"
                      value={customerInfo.selected_address ? customerInfo.selected_address - 1 : null}
                      onChange={handleSelectAddress}
                    >
                      {customerInfo.cust_addresses.map((address, index) => (
                        <RadioTile key={index} value={index} style={{ marginBottom: '10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <Icon as={FaHome} /> {address}
                            </div>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={(e) => {
                                e.preventDefault();
                                handleRemoveAddress(index);
                              }}
                            >
                              <Icon as={FaTrash} />
                            </button>
                          </div>
                        </RadioTile>
                      ))}
                    </RadioTileGroup>
                  )}
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
              <button
                type="submit"
                className="btn btn-primary mt-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>
          {isOrderPlaced && (
            <div className="modal-footer">
              <p className="text-success">Order has been placed successfully!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderModal;