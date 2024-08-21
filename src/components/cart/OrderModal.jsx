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
import { useNavigate } from 'react-router-dom';

function OrderModal({ cartItems, total, onClose, setCartItems }) {
  const [customerInfo, setCustomerInfo] = useState({
    cust_name: '',
    cust_addresses: [],
    selected_address: '',
    cust_number: '',
    pincode: '',
    order_date: null,
    timeslot: '',
    isNewUser: true,
  });
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [blockedDates, setBlockedDates] = useState([]);
  const [newAddress, setNewAddress] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [availableCoupons, setAvailableCoupons] = useState({});
  const [discountedTotal, setDiscountedTotal] = useState(total);

  const navigate = useNavigate();


  useEffect(() => {
    fetchBlockedDates();
    fetchAvailableCoupons();
  }, []);

  const fetchAvailableCoupons = async () => {
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/getcoupon`);
      if (response.ok) {
        const data = await response.json();
        console.log(data.message);

        if (typeof data.message === 'object' && data.message !== null) {
          setAvailableCoupons(data.message);
        } else {
          console.error('API did not return an object of coupons');
          setAvailableCoupons({});
        }
      } else {
        console.error('Failed to fetch available coupons');
        setAvailableCoupons({});
      }
    } catch (error) {
      console.error('Error fetching available coupons:', error);
      setAvailableCoupons({});
    }
  };


  useEffect(() => {
    calculateDiscountedTotal();
  }, [couponCode, total, availableCoupons]); // Add availableCoupons to the dependency array

  const calculateDiscountedTotal = () => {
    const selectedCoupon = availableCoupons[couponCode];
    if (selectedCoupon) {
      const discount = selectedCoupon.discount / 100;
      setDiscountedTotal(total - (total * discount));
    } else {
      setDiscountedTotal(total);
    }
  };

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
            cust_addresses: customer.cust_address ? customer.cust_address.map((address, index) => address) : [],
            selected_address: customer.selected_address ? parseInt(customer.selected_address) : '',
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
  
    if (customerInfo.cust_addresses.length === 0) {
      toast.error('Please add at least one address');
      return;
    }
  
    const selectedAddress = customerInfo.selected_address !== ''
      ? customerInfo.selected_address
      : 0;
  
    if (!customerInfo.selected_address && customerInfo.cust_addresses.length > 0) {
      setCustomerInfo(prev => ({ ...prev, selected_address: 0 }));
    }
  
    const orderData = {
      cust_name: customerInfo.cust_name,
      cust_address: customerInfo.cust_addresses,
      selected_address: Number(selectedAddress),
      cust_number: customerInfo.cust_number,
      pincode: customerInfo.pincode,
      order_product: cartItems.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.packs[item.packIndex].price
      })),
      total_amount: discountedTotal,
      order_date: customerInfo.order_date ? moment(customerInfo.order_date).format('YYYY-MM-DD') : null,
      timeslot: customerInfo.timeslot,
      coupon_code: couponCode, // Make sure this line is present
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
        navigate('/')
        const data = await response.json();
        console.log('Sending order data:', JSON.stringify(orderData, null, 2)); 
        toast.success(data.message);
        if (data.order && typeof data.order.selected_address === 'string') {
          data.order.selected_address = Number(data.order.selected_address);
        }
        console.log(data);
        setIsOrderPlaced(true);
        onClose();
      } else {
        const errorData = await response.json();
        console.log(errorData);
        throw new Error(errorData.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(`Failed to place order: ${error.message}`);
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
        selected_address: updatedAddresses.length,
      }));

      if (!customerInfo.isNewUser) {
        const response = await fetch(`${CONFIGS.API_BASE_URL}/addAddress`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cust_number: customerInfo.cust_number,
            selectedAddress: newAddress,
          }),
        });

        if (response.ok) {
          toast.success('Address added successfully');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to add address');
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
      setCustomerInfo(prev => {
        const updatedAddresses = prev.cust_addresses.filter((_, i) => i !== index);
        const updatedSelectedAddress = prev.selected_address === index + 1 ?
          (updatedAddresses.length > 0 ? 1 : null) :
          (prev.selected_address > index + 1 ? prev.selected_address - 1 : prev.selected_address);

        return {
          ...prev,
          cust_addresses: updatedAddresses,
          selected_address: updatedSelectedAddress,
        };
      });

      if (!customerInfo.isNewUser) {
        const response = await fetch(`${CONFIGS.API_BASE_URL}/delete-address`, {
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
          toast.success('Address removed successfully');
        } else {
          const errorData = await response.json();
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
            {discountedTotal !== total && (
              <h4>Discounted Total: RS.{discountedTotal.toFixed(2)}</h4>
            )}
            <hr />
            <form onSubmit={handleSubmit}>
              <div className="order_container">
                <div className="form-group">
                  <label>Email:</label>
                  <div className="">
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
                      value={customerInfo.selected_address - 1}
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

              <div className="form-group">
                <label>Coupon Code:</label>
                <select
                  name="couponCode"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="order_info"
                >
                  <option value="">Select a coupon code</option>
                  {Object.entries(availableCoupons).map(([code, coupon]) => (
                    <option key={code} value={coupon.code}>
                      {code}-{coupon.code} - {coupon.discount}% off
                    </option>
                  ))}
                </select>
              </div>
              {(!customerInfo.isNewUser) ? (
                <p className="text-danger">Orders are currently limited to 500 unique customers. We apologize for the inconvenience.</p>
              ) : (
                <button type="submit" className="btn btn-primary btn-block mt-3">
                  Place Order
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderModal;