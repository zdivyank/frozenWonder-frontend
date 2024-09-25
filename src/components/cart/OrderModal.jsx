import React, { useState, useEffect } from 'react';
import { CONFIGS } from '../../../config';
// import { toast } from 'react-toastify';
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
import swal from 'sweetalert';
import { toast } from 'react-toastify';



function OrderModal({ cartItems, total, onClose, setCartItems }) {
  const [customerInfo, setCustomerInfo] = useState({
    cust_name: '',
    cust_addresses: [],
    selected_address: '',
    cust_number: '',
    cust_contact: '',
    pincode: '',
    order_date: null,
    // order_date: new Date(),
    timeslot: '',
    isNewUser: true,
    otp: '',
    area: '',
    landmark: '',
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
  const [step, setStep] = useState(1);


  const [isLoadingVerify, setIsLoadingVerify] = useState(false);
  const [timer, setTimer] = useState(90); // Set initial timer to 20 seconds
  const [isEnabled, setIsEnabled] = useState(false); // Initially disabled
  const [isLoadingOTP, setIsLoadingOTP] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  const [isclicked, setisclicked] = useState(false);
  const [message, setMessage] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  const [showlower, setshowlower] = useState(false);

  const [errors, setErrors] = useState({});
  const [isAddressEnabled, setIsAddressEnabled] = useState(false);


  const [orders, setOrders] = useState([]); // Initialize orders as an empty  array

  
  const [availableDate, setAvailableDate] = useState(null); // Store the next available date
  useEffect(() => {
    // Fetch the next available date from the backend
    const fetchAvailableDate = async () => {
      try {
        const res = await fetch(`${CONFIGS.API_BASE_URL}/available-dates`, {
          method: 'GET'
        });
        const data = await res.json();
        setAvailableDate(data.nextAvailableDate); // Set the available date from the backend
        setCustomerInfo(prev => ({
          ...prev,
          order_date: data.nextAvailableDate // Automatically set the available date in customer info
        }));
      } catch (error) {
        console.error('Error fetching available date:', error);
      }
    };

    fetchAvailableDate();
  }, []);

  const handlePhoneBlur = () => {
    if (customerInfo.cust_contact.length !== 10 || isNaN(customerInfo.cust_contact)) {
      setPhoneError('Phone number must be exactly 10 digits.');
    } else {
      setPhoneError('');
    }
  };

  // const [errors, setErrors] = useState({});
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // Trim whitespace from inputs and validate phone number length
    const trimmedValue = name === 'cust_contact' ? value.trim() : value;

    // Validate phone number
    if (name === 'cust_contact') {
      if (trimmedValue.length !== 10 || isNaN(trimmedValue)) {
        setErrors(prev => ({ ...prev, cust_contact: 'Phone number must be 10 digits long' }));
        setIsAddressEnabled(false); // Disable address field if phone number is invalid
      } else {
        setErrors(prev => ({ ...prev, cust_contact: '' })); // Clear error if valid
        setIsAddressEnabled(true); // Enable address field if valid phone number
      }
    }

    // Update customer information state
    setCustomerInfo(prev => ({
      ...prev,
      [name]: trimmedValue,
    }));
  };


  const handleDateChange = (date) => {
    setCustomerInfo((prev) => ({
      ...prev,
      order_date: date,
    }));
  };

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1); // Move to the next step
  };

  const handlePreviousStep = () => {
    if (step > 1) setStep(step - 1); // Move to the previous step
  };


  // Function to disable dates before the next available date
  // const isDateDisabled = (date) => {
  //   return date < availableDate; // Disable dates before the available one
  // };

  const isDateDisabled = (date) => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    const orderCount = orders.filter(order => order.order_date === formattedDate).length;
    return orderCount >= 15; // Disable if there are 15 or more orders
  };



  useEffect(() => {
    fetchBlockedDates();
    fetchAvailableCoupons();
  }, []);

  const shouldAllowMaxDate = () => {
    // If the minDate (current available date) has fewer than 15 orders, don't allow maxDate (next date)
    const formattedMinDate = moment(availableDate).format('YYYY-MM-DD');
    const minDateOrderCount = orders.filter(order => order.order_date === formattedMinDate).length;

    return minDateOrderCount >= 15; // Allow maxDate only if minDate has 15 or more orders
  };


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

  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;

  //   // Trim whitespace from email input
  //   const trimmedValue = name === 'cust_number' ? value.trim() : value;

  //   setCustomerInfo(prev => ({
  //     ...prev,
  //     [name]: trimmedValue,
  //   }));
  // };


  const startTimer = () => {
    setIsEnabled(false);
    setTimer(90); // Reset timer to 20 seconds

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
            area: customer.area || '',
            landmark: customer.landmark || '',
            pincode: customer.pincode || '',
            cust_contact: customer.cust_contact || '',
            isNewUser: false,
          }));
          // toast.success('Customer details fetched successfully!');
        } else {
          setCustomerInfo(prev => ({
            ...prev,
            cust_name: '',
            cust_addresses: [],
            selected_address: null,
            landmark: '',
            area: '',
            pincode: '',
            cust_contact: '',
            isNewUser: true,
          }));
          // toast.info('No existing customer found. Please fill in your details.');
        }
      } else {
        throw new Error('Failed to fetch customer details');
      }
    } catch (error) {
      // console.error('Error fetching customer details:', error);
      swal("Error!", "Error fetching customer details:!", "error");

      // toast.error('Failed to fetch customer details. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!canPlaceOrder()) {
      toast.error('This date has already reached the maximum order limit of 4. Please choose another date.');
      return;
    }

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
      selected_address: Number(selectedAddress) + 1,
      cust_number: customerInfo.cust_number,
      cust_contact: customerInfo.cust_contact,
      pincode: customerInfo.pincode,
      area: customerInfo.area,
      landmark: customerInfo.landmark,
      order_product: cartItems.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.packs[item.packIndex].price
      })),
      total_amount: discountedTotal,
      order_date: customerInfo.order_date ? moment(customerInfo.order_date).format('YYYY-MM-DD') : null,
      timeslot: 'morning',
      otp: customerInfo.otp,
      coupon_code: couponCode,
    };

    console.log('Order Data:', orderData);

    try {
      setisclicked(true);
      const response = await fetch(`${CONFIGS.API_BASE_URL}/addorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      setOrders([...orders, { date: moment(customerInfo.order_date).format('YYYY-MM-DD'), timeslot: customerInfo.timeslot }]);

      if (response.ok) {
        navigate('/');
        const data = await response.json();
        console.log('Sending order data:', JSON.stringify(orderData, null, 2));
        // toast.success(data.message);
        // swal("Confirmed!", `${data.message}`, "success");
        localStorage.removeItem('cart'); 
        swal({
          title: "Order Placed!",
          text: "Your order has been placed successfully.",
          icon: "success",
          button: "OK",
        }).then(() => {
          // Reload the page after clicking "OK" button
          window.location.reload();
        });
    

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
        setisclicked(false);
        throw new Error(errorData.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(`Failed to place order: ${error.message}`);
    }
  };

  const handleSelectAddress = (index) => {
    setCustomerInfo(prev => ({
      ...prev,
      selected_address: index
    }));
  };

  const handleNewAddressChange = (e) => {
    const value = e.target.value;  // Extract the value from the event's target
    // setshowlower(true)
    setNewAddress(value);          // Update the state with the new address
  };


  const handleAddAddress = async () => {
    if (newAddress.trim() === '') {
      toast.error('Please enter an address before adding.');
      console.log("Lower non visable");

      console.log("Lower visable");
      setIsEnabled(true);
      setisclicked(true)
      return;
    }
    setshowlower(true)

    try {
      const updatedAddresses = [...customerInfo.cust_addresses, newAddress];  // Add the new address to the existing array
      setCustomerInfo(prev => ({
        ...prev,
        cust_addresses: updatedAddresses,
        selected_address: updatedAddresses.length - 1,  // Automatically select the newly added address
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
          // toast.success('Address added successfully');
          null
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to add address');
        }
      } else {
        // toast.success('Address added successfully');
      }
    } catch (error) {
      console.error('Error adding address:', error);
      // toast.error(`Failed to add address: ${error.message}`);
    }

    setNewAddress('');
  };

  const handleRemoveAddress = async (index) => {
    try {
      setCustomerInfo(prev => {
        const updatedAddresses = prev.cust_addresses.filter((_, i) => i !== index);
        const updatedSelectedAddress = prev.selected_address === index ?
          (updatedAddresses.length > 0 ? 0 : null) :
          (prev.selected_address > index ? prev.selected_address - 1 : prev.selected_address);

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
            addressIndex: index,
          }),
        });

        if (response.ok) {
          // toast.success('Address removed successfully');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to remove address');
        }
      } else {
        // toast.success('Address removed successfully');
      }
    } catch (error) {
      console.error('Error removing address:', error);
      // toast.error(`Failed to remove address: ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${CONFIGS.API_BASE_URL}/vieworders`, {
          method: "GET"
        }); // Replace with your actual API endpoint
        const data = await response.json();
        setOrders(data.orders);
        // setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        // toast.error('Failed to load orders');
      }
    };

    fetchOrders();
  }, []);



  // const handleDateChange = (date) => {
  //   setCustomerInfo(prev => ({ ...prev, order_date: date, timeslot: '' }));
  // };


  // working code for disble dates

  // const isDateDisabled = (date) => {
  //   const formattedDate = moment(date).format('YYYY-MM-DD');

  //   // Check if the date is before 1st September 2024
  //   const isBeforeSeptember = moment(formattedDate).isBefore('2024-09-01');

  //   // Disable the date if it's before 1st September 2024 or matches the blocked dates and timeslots
  //   return isBeforeSeptember || blockedDates.some(blockedDate =>
  //     blockedDate.date === formattedDate &&
  //     (blockedDate.timeslot === 'fullday' || blockedDate.timeslot === 'all' || blockedDate.timeslot === customerInfo.timeslot)
  //   );
  // };


  // const getAvailableTimeSlots = () => {
  //   if (!customerInfo.order_date) return [];

  //   const formattedDate = moment(customerInfo.order_date).format('YYYY-MM-DD');
  //   const blockedTimeslots = blockedDates
  //     .filter(blockedDate => blockedDate.date === formattedDate)
  //     .map(blockedDate => blockedDate.timeslot);

  //   const allTimeSlots = ['morning', 'evening'];
  //   return allTimeSlots.filter(slot => !blockedTimeslots.includes(slot));
  // };

  // useEffect(() => {
  //   // Add the class when the modal opens
  //   document.body.classList.add('modal-open');

  //   // Remove the class when the modal closes
  //   return () => {
  //     document.body.classList.remove('modal-open');
  //   };
  // }, []);\



  // const isDateDisabled = (date) => {
  //   const formattedDate = moment(date).format('YYYY-MM-DD');

  //   // Find the number of orders placed on the selected date
  //   const orderCountOnDate = orders.filter(order => order.date === formattedDate).length;

  //   // Check if previous dates have 4 orders
  //   const prevDatesFull = orders.reduce((prevFull, order) => {
  //     const orderDate = moment(order.date);
  //     if (orderDate.isBefore(formattedDate)) {
  //       const orderCount = orders.filter(o => o.date === order.date).length;
  //       return prevFull && orderCount >= 4; // Only true if all previous dates are fully booked
  //     }
  //     return prevFull;
  //   }, true); // Start assuming all previous dates are full

  //   // Disable the date if it has 4 or more orders or previous dates are not fully booked
  //   return orderCountOnDate >= 4 || !prevDatesFull;
  // };

  const canPlaceOrder = () => {
    const formattedDate = moment(customerInfo.order_date).format('YYYY-MM-DD');

    // Handle case when `orders` is undefined or not an array
    if (!orders || !Array.isArray(orders)) {
      console.error('Orders array is undefined or not an array');
      return false; // Don't allow order placement if orders are undefined
    }

    // Check the number of orders for the selected date
    const orderCountOnDate = orders.filter(order => {
      const orderDate = moment(order.date).format('YYYY-MM-DD');
      return orderDate === formattedDate;
    }).length;

    // Allow placing the order only if there are fewer than 15 orders
    return orderCountOnDate < 15;
  };

  const getNextAvailableDate = () => {
    const formattedDate = moment(customerInfo.order_date).format('YYYY-MM-DD');

    const orderCountOnDate = orders.filter(order => {
      const orderDate = moment(order.date).format('YYYY-MM-DD');
      return orderDate === formattedDate;
    }).length;

    if (orderCountOnDate >= 15) {
      let nextDate = moment(customerInfo.order_date).add(1, 'days');
      setCustomerInfo(prev => ({ ...prev, order_date: nextDate.toDate() }));
    }
  };

  useEffect(() => {
    getNextAvailableDate(); // Check for next date when order count changes
  }, [orders, customerInfo.order_date]);


  const getAvailableTimeSlots = () => {
    if (!customerInfo.order_date) return [];

    const formattedDate = moment(customerInfo.order_date).format('YYYY-MM-DD');

    const blockedTimeslots = orders
      .filter(order => order.date === formattedDate)
      .map(order => order.timeslot);

    const allTimeSlots = ['morning', 'evening'];
    return allTimeSlots.filter(slot => !blockedTimeslots.includes(slot));
  };

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
            {!showOtherFields && !showIndividualFields && (
              <h5 className="modal-title">OTP VERIFICATION</h5>
            )}
            {showOtherFields && showIndividualFields && (
              <h5 className="modal-title">Order Summary</h5>
            )}
            <button type="button" className="close" onClick={onClose}>
              <span className="text-dark">&times;</span>
            </button>
          </div>
          <div class="modal-body">

            {showOtherFields && showIndividualFields && (
              <>
                <h3>GIFT HAMPER</h3>
                <hr />
              </>
              // <h5 className="modal-title">OTP VERIFICATION</h5>
            )}
            {/* {cartItems.map((item, index) => (
            <div key={index}>
              {item.product.name} - {item.product.packs[item.packIndex].ml}ML * {item.product.packs[item.packIndex].unit}
              - Quantity: {item.quantity} - Price: RS.{item.product.packs[item.packIndex].price * item.quantity}
            </div>
          ))}
          <h4>Total: RS.{total}</h4>
          {discountedTotal !== total && <h4>Discounted Total: RS.{discountedTotal.toFixed(2)}</h4>} */}
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
                    {/* {!showlower && (
                      <> */}
                    <div className="form-group">
                      <label>Name*:</label>
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
                      <label>Phone number*:</label>
                      <input
                        type="number"
                        name="cust_contact"
                        value={customerInfo.cust_contact}
                        onChange={handleInputChange}
                        className={`order_info ${errors.cust_contact ? 'is-invalid' : ''}`}
                        required
                      />
                      {errors.cust_contact && (
                        <div className="invalid-feedback">
                          {errors.cust_contact}
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Addresses*:</label>
                      {customerInfo.cust_addresses.length > 0 && (
                        <div>
                          {customerInfo.cust_addresses.map((address, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                              <input
                                type="radio"
                                name="selected_address"
                                value={index}
                                disabled={!isAddressEnabled}
                                checked={customerInfo.selected_address === index}
                                onChange={() => handleSelectAddress(index)}
                              />
                              <span style={{ marginLeft: '8px', flexGrow: 1 }}>{address}</span>
                              <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => handleRemoveAddress(index)}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                        <textarea
                          rows={2}
                          placeholder="Enter new address"
                          value={newAddress}
                          onChange={handleNewAddressChange}
                          style={{ flexGrow: 1, marginRight: '10px' }}
                        />


                      </div>

                      <div className="form-group">
                        <label>area:</label>
                        <input
                          type="text"
                          name="area"
                          value={customerInfo.area}
                          onChange={handleInputChange}
                          className="order_info"
                          
                        />
                      </div>
                      <div className="form-group">
                        <label>Landmark:</label>
                        <input
                          type="text"
                          name="landmark"
                          value={customerInfo.landmark}
                          onChange={handleInputChange}
                          className="order_info"
                          
                        />
                      </div>

                      <div className="form-group">
                        <label>Pincode*:</label>
                        <input
                          type="text"
                          name="pincode"
                          value={customerInfo.pincode}
                          onChange={handleInputChange}
                          className="order_info"
                          required
                        />
                      </div>

                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={handleAddAddress}
                        disabled={!isAddressEnabled}
                      >
                        Save Address <FaPlus />
                      </button>
                    </div>
                    {/* </>
                     */}
                    {/* ) 
                    } */}
                    {showlower && (
                      <>

                        {/* <div className="form-group">
                        <label>Order Date:</label> */}
                        {/* <DatePicker
                        selected={customerInfo.order_date}
                        onChange={handleDateChange}
                        minDate={new Date()}
                        dateFormat="dd/MM/yyyy"
                        className="order_info"
                        filterDate={date => !isDateDisabled(date)}
                        required
                       /> */}

                        {/* <DatePicker
                        selected={customerInfo.order_date}
                        onChange={handleDateChange}
                        minDate={new Date()} // Disables past dates
                        dateFormat="dd/MM/yyyy"
                        className="order_info"
                        filterDate={date => !isDateDisabled(date)} // Disable dates with 4 or more orders
                        required
                        />
                        </div> */}

                        {/* <div className="form-group">
                        <label>Order Date:</label>
                                  {availableDate ? (
                          <DatePicker
                        selected={customerInfo.order_date}
                        onChange={(date) => setCustomerInfo({ ...customerInfo, order_date: date })}
                        minDate={availableDate} // Set the minimum date as the available date
                        maxDate={availableDate} // Only allow the available date
                        dateFormat="dd/MM/yyyy"
                        className="order_info"
                        required
                        />
                          ) : (
                            <p>Loading available date...</p> // Show a loading message while the date is being fetched
                          )}
                        </div> */}


                        <div className="form-group">
                          <label>Order Date*:</label>
                          {availableDate ? (
                            <select
                              value={customerInfo.order_date}
                              onChange={(e) =>
                                setCustomerInfo({ ...customerInfo, order_date: e.target.value })
                              }
                              required
                            >
                              {/* Dropdown shows only one available date */}
                              <option value={availableDate}>{availableDate}</option>
                            </select>
                          ) : (
                            <p>Loading available date...</p> // Show a loading message while the date is being fetched
                          )}
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
                          <label>Coupon Code*:</label>
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

                        <div className="mt-3">
                          <p>
                            <strong>TERMS AND CONDITIONS</strong>
                          </p>
                          <hr />

                          <ul>

                            <li>
                              SAMPLES ARE FREE OF COST; ONLY DELIVERY/COURIER CHARGES APPLY.
                            </li>
                            <li>
                              YOU WILL RECEIVE YOUR FREE SAMPLE PACK THROUGH OUR PRESCHEDULED DELIVERIES STARTING FROM 1ST SEPTEMBER ONWARDS.
                            </li>
                            <li>
                              YOU WILL GET A CONFIRMATION CALL BEFORE ANY DELIVERY IS MADE.
                            </li>
                            <li>
                              SAMPLES WILL BE DELIVERED WHICH ARE SUBJECT TO AVAILABILITY.
                            </li>
                          </ul>

                          <hr />
                        </div>

                        {/* <div className="mt-3">
                      <label>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => setIsChecked(!isChecked)}
                        />
                        I agree to the terms and conditions
                      </label>
                    </div> */}

                        <div className="mt-3">
                          <label>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => setIsChecked(!isChecked)} // Toggle checkbox state
                              className='me-2'
                            />
                            I AGREE TO -
                            PAY DELIVERY/COURIER CHARGES  & ALL THE TERMS & CONDITIONS OF THE COMPANY.
                          </label>
                        </div>

                        {/* Submit Button */}
                        {!customerInfo.isNewUser ? (
                          <p className="text-danger">Orders are currently limited to 500 unique customers. We apologize for the inconvenience.</p>
                        ) : (
                          // <button type="submit" disabled={isclicked} className="btn btn-primary btn-block mt-3">
                          //   Place Order
                          // </button>

                          <button
                            type="submit"
                            disabled={!isChecked || isclicked} // Disabled until checkbox is checked
                            className="btn btn-primary btn-block mt-3"
                          >
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