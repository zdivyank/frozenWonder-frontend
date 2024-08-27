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
import { Popover, Whisper, Button, List } from 'rsuite';
import { IoIosInformationCircleOutline } from 'react-icons/io';



function OrderModal({ cartItems, total, onClose, setCartItems }) {
  const [customerInfo, setCustomerInfo] = useState({
    cust_name: '',
    cust_addresses: [],
    selected_address: '',
    cust_number: '',
    cust_contact: '',
    pincode: '',
    order_date: null,
    timeslot: '',
    isNewUser: true,
    otp: ''
  });
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [blockedDates, setBlockedDates] = useState([]);
  const [newAddress, setNewAddress] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [availableCoupons, setAvailableCoupons] = useState({});
  const [discountedTotal, setDiscountedTotal] = useState(total);

  const [showOTPInput, setShowOTPInput] = useState(false);
  const [showOtherFields, setShowOtherFields] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showIndividualFields, setShowIndividualFields] = useState(false);



  const [isLoadingVerify, setIsLoadingVerify] = useState(false);
  const [timer, setTimer] = useState(20); // Set initial timer to 20 seconds
  const [isEnabled, setIsEnabled] = useState(false); // Initially disabled
  const [isLoadingOTP, setIsLoadingOTP] = useState(false);
  const [isResending, setIsResending] = useState(false);
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // Trim whitespace from email input
    const trimmedValue = name === 'cust_number' ? value.trim() : value;

    setCustomerInfo(prev => ({
      ...prev,
      [name]: trimmedValue,
    }));
  };


  const startTimer = () => {
    setIsEnabled(false);
    setTimer(20); // Reset timer to 20 seconds

    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(countdown);
          setIsEnabled(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const sendotp = async () => {
    const trimmedCustNumber = customerInfo.cust_number.trim();
    setIsLoadingOTP(true);
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/sendotp`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cust_number: trimmedCustNumber }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setShowOTPInput(true);
        startTimer(); // Start timer when OTP is sent
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingOTP(false);
    }
  };


  const verifyotp = async () => {
    setIsLoadingVerify(true);
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/verifyotp`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cust_number: customerInfo.cust_number, otp: customerInfo.otp }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        handleFetchCustomerDetails()
        // setShowOTPInput(false);
        setOtpVerified(true);
        setShowOTPInput(false);
        setShowIndividualFields(true);
        setShowOtherFields(true);
        startTimer();

      }
    } catch (error) {
      console.log(error);

    }
    finally {
      setIsLoadingVerify(false);
    }
  }

  const handleResendOtp = async () => {
    setIsResending(true);
    setIsEnabled(false); // Disable the button immediately

    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/resendOtp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cust_number: customerInfo.cust_number }),
      });

      const data = await response.json();
      setMessage(data.message);
      startTimer(); // Start the timer again after resending OTP
    } catch (error) {
      setMessage('Failed to resend OTP');
    } finally {
      setIsResending(false);
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

      console.log('Response status:', response.status); // Log response status
      console.log('Response headers:', response.headers); // Log response headers

      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data); // Log response data

        if (data.response && data.response.length > 0) {
          const customer = data.response[0];
          setCustomerInfo(prev => ({
            ...prev,
            cust_name: customer.cust_name || '',
            cust_addresses: customer.cust_address ? customer.cust_address.map((address, index) => address) : [],
            selected_address: customer.selected_address ? parseInt(customer.selected_address) : '',
            pincode: customer.pincode || '',
            cust_contact: customer.cust_contact || '',
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
            cust_contact: '',
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
    if (!customerInfo.order_date) {
      toast.error('Please select an order date');
      return;
    }

    if (isDateDisabled(customerInfo.order_date)) {
      toast.error('This date is not available for ordering. Please select another date.');
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
      cust_contact: customerInfo.cust_contact,
      pincode: customerInfo.pincode,
      order_product: cartItems.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.packs[item.packIndex].price
      })),
      total_amount: discountedTotal,
      order_date: customerInfo.order_date ? moment(customerInfo.order_date).format('YYYY-MM-DD') : null,
      timeslot: 'morning',
      otp: customerInfo.otp,
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

        for (const item of cartItems) {
          await fetch(`${CONFIGS.API_BASE_URL}/updatestock`, {
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
        }

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

    // Check if the date is before 1st September 2024
    const isBeforeSeptember = moment(formattedDate).isBefore('2024-09-01');

    // Disable the date if it's before 1st September 2024 or matches the blocked dates and timeslots
    return isBeforeSeptember || blockedDates.some(blockedDate =>
      blockedDate.date === formattedDate &&
      (blockedDate.timeslot === 'fullday' || blockedDate.timeslot === 'all' || blockedDate.timeslot === customerInfo.timeslot)
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

  useEffect(() => {
    // Add the class when the modal opens
    document.body.classList.add('modal-open');

    // Remove the class when the modal closes
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  const terms = (
    <Popover title="Terms and Conditions" style={{ maxWidth: 300 }}>
      <List bordered hover>
        <List.Item>Samples are free of cost; only delivery/courier charges apply.</List.Item>
        <List.Item>You will receive your free sample pack through our prescheduled deliveries starting from 1st September onwards.</List.Item>
        <List.Item>You will get a confirmation call before any delivery is made.</List.Item>
        <List.Item>Samples will be delivered subject to availability.</List.Item>
      </List>
    </Popover>
  );

  return (
    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 className="modal-title">Order Summary</h5>
            <button type="button" className="close" onClick={onClose}>
              <span className="text-dark">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <h3>GIFT HAMPER</h3>
            {/* {cartItems.map((item, index) => (
            <div key={index}>
              {item.product.name} - {item.product.packs[item.packIndex].ml}ML * {item.product.packs[item.packIndex].unit}
              - Quantity: {item.quantity} - Price: RS.{item.product.packs[item.packIndex].price * item.quantity}
            </div>
          ))}
          <h4>Total: RS.{total}</h4>
          {discountedTotal !== total && <h4>Discounted Total: RS.{discountedTotal.toFixed(2)}</h4>} */}
            <hr />
            <form onSubmit={handleSubmit}>
              <div className="order_container">
                {/* Show Email and Send OTP Button */}
                {!showOTPInput && !showIndividualFields && (
                  <div className="form-group">
                    <label>Email:</label>
                    <div className="">
                      <input
                        type="text"
                        name="cust_number"
                        value={customerInfo.cust_number}
                        onChange={handleInputChange}
                        className="order_info"
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-danger mt-4 d-flex text-center"
                        onClick={sendotp}
                        disabled={isLoadingOTP}
                      >
                        {isLoadingOTP ? 'SENDING...' : 'SEND OTP'}
                      </button>
                    </div>
                  </div>
                )}


                {/* Show OTP Verification Field */}
                {showOTPInput && (
                  <div className="form-group">
                    <label>OTP:</label>
                    <div className="">
                      <input
                        type="tel"
                        name="otp"
                        value={customerInfo.otp}
                        onChange={handleInputChange}
                        className="order_info form-control"
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-success mt-4 d-flex text-center"
                        onClick={verifyotp}
                        disabled={isLoadingVerify}
                      >
                        {isLoadingVerify ? 'VERIFYING...' : 'VERIFY OTP'}
                      </button>

                      <button className='btn btn-dark' onClick={handleResendOtp} disabled={!isEnabled || isResending}>
                        {isResending ? 'Resending...' : isEnabled ? 'Resend OTP' : `Resend OTP in ${timer}s`}
                      </button>
                      {/* {message && <p>{message}</p>} */}

                    </div>
                  </div>
                )}

                {/* Show Additional Fields After OTP Verification */}
                {showOtherFields && showIndividualFields && (
                  <>
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
                      <label>Phone number:</label>
                      <input
                        type="text"
                        name="cust_contact"
                        value={customerInfo.cust_contact}
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
                                  className="btn btn-danger"
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
                      </div>
                      <button
                        type="button"
                        className="btn btn-success mt-2"
                        onClick={handleAddAddress}
                      >
                        Add address
                        <Icon as={FaPlus} className='ms-2' />
                      </button>
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

                    {/* <div className="form-group">
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
                    </div> */}

                    {/* <div className="form-group">
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
                    </div> */}


                    <div className="form-group">
                      <label>Coupon Code:</label>
                      <input
                        type="text"
                        name="couponCode"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="order_info"
                        placeholder="Enter coupon code"
                        required
                      />
                    </div>
                    {/* Submit Button */}
                    {!customerInfo.isNewUser ? (
                      <p className="text-danger">Orders are currently limited to 500 unique customers. We apologize for the inconvenience.</p>
                    ) : (
                      <button type="submit" className="btn btn-primary btn-block mt-3">
                        Place Order
                      </button>
                    )}

                    <div className=" mt-3">
                      <Whisper placement="auto" trigger="hover" speaker={terms}>
                        <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                          <IoIosInformationCircleOutline />
                          Terms and Conditions*
                        </span>
                      </Whisper>
                    </div>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>


  );

}

export default OrderModal;