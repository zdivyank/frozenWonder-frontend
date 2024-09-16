// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom'; // To get _id from URL
// import { FaTrash, FaPlus } from 'react-icons/fa';
// import { toast } from 'react-hot-toast';
// import { CONFIGS } from '../../../../config';

// function Admin_updateorder() {
//   const { _id } = useParams(); 
//   const [customerInfo, setCustomerInfo] = useState({
//     cust_name: '',
//     cust_contact: '',
//     cust_number: '',
//     cust_addresses: [],
//     selected_address: null,
//     pincode: '',
//     order_date: '',
//   });
//   const [newAddress, setNewAddress] = useState('');

//   // Fetch order details on component mount
//   useEffect(() => {
//     const fetchOrderDetails = async () => {
//       try {
//         const response = await fetch(`${CONFIGS.API_BASE_URL}/order/${_id}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch order details');
//         }
//         const order = await response.json();
        
//         setCustomerInfo({
//           cust_name: order.cust_name || '',
//           cust_contact: order.cust_contact || '',
//           cust_number: order.cust_number || '',
//           cust_addresses: order.cust_address || [],
//           selected_address: order.selected_address || 0,
//           pincode: order.pincode || '',
//           order_date: order.order_date ? order.order_date.split('T')[0] : '',
//         });
//       } catch (error) {
//         toast.error(error.message);
//       }
//     };

//     fetchOrderDetails();
//   }, [_id]);

//   // Handle input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCustomerInfo({
//       ...customerInfo,
//       [name]: value,
//     });
//   };

//   // Handle adding a new address
//   const handleAddAddress = () => {
//     if (newAddress.trim()) {
//       setCustomerInfo({
//         ...customerInfo,
//         cust_addresses: [...customerInfo.cust_addresses, newAddress],
//       });
//       setNewAddress(''); // Clear input field
//     }
//   };

//   // Handle removing an address
//   const handleRemoveAddress = (index) => {
//     const updatedAddresses = customerInfo.cust_addresses.filter((_, i) => i !== index);
//     setCustomerInfo({
//       ...customerInfo,
//       cust_addresses: updatedAddresses,
//     });
//   };

//   // Handle selecting an address
//   const handleSelectAddress = (index) => {
//     setCustomerInfo({
//       ...customerInfo,
//       selected_address: index,
//     });
//   };

//   // Handle new address input change
//   const handleNewAddressChange = (e) => {
//     setNewAddress(e.target.value);
//   };

//   // Handle form submission to update order
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Convert cust_addresses to cust_address as expected by the backend
//     const requestBody = {
//       cust_address: customerInfo.cust_addresses,
//       selected_address: customerInfo.selected_address,
//     };

//     console.log("Data being sent:", requestBody);  // Log form data
//     try {
//       const response = await fetch(`${CONFIGS.API_BASE_URL}/editorder/${_id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestBody),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update order');
//       }

//       toast.success('Order updated successfully');
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h2>Update Order</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label>Name:</label>
//           <input
//             type="text"
//             name="cust_name"
//             value={customerInfo.cust_name}
//             onChange={handleInputChange}
//             className="order_info"
//             disabled
//           />
//         </div>

//         <div className="form-group">
//           <label>Phone number:</label>
//           <input
//             type="text"
//             name="cust_contact"
//             value={customerInfo.cust_contact}
//             onChange={handleInputChange}
//             className="order_info"
//             disabled
//           />
//         </div>

//         <div className="form-group">
//           <label>Addresses:</label>
//           {customerInfo.cust_addresses.length > 0 && (
//             <div>
//               {customerInfo.cust_addresses.map((address, index) => (
//                 <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
//                   <input
//                     type="radio"
//                     name="selected_address"
//                     value={index}
//                     checked={customerInfo.selected_address === index}
//                     onChange={() => handleSelectAddress(index)}
//                   />
//                   <span style={{ marginLeft: '8px', flexGrow: 1 }}>{address}</span>
//                   <button
//                     type="button"
//                     className="btn btn-danger"
//                     onClick={() => handleRemoveAddress(index)}
//                   >
//                     <FaTrash />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//           <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
//             <textarea
//               rows={2}
//               placeholder="Enter new address"
//               value={newAddress}
//               onChange={handleNewAddressChange}
//               style={{ flexGrow: 1, marginRight: '10px' }}
//             />
//             <button
//               type="button"
//               className="btn btn-success"
//               onClick={handleAddAddress}
//             >
//               Add <FaPlus />
//             </button>
//           </div>
//         </div>

//         <div className="form-group">
//           <label>Pincode:</label>
//           <input
//             type="text"
//             name="pincode"
//             value={customerInfo.pincode}
//             onChange={handleInputChange}
//             className="order_info"
//             disabled
//           />
//         </div>

//         <div className="form-group">
//           <label>Order Date:</label>
//           <input
//             type="date"
//             name="order_date"
//             value={customerInfo.order_date}
//             onChange={handleInputChange}
//             className="order_info"
//             disabled
//           />
//         </div>

//         <button type="submit" className="btn btn-primary">Update Order</button>
//       </form>
//     </div>
//   );
// }

// export default Admin_updateorder;





// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom'; // To get _id from URL
// import { FaTrash, FaPlus, FaEdit } from 'react-icons/fa';
// import { toast } from 'react-hot-toast';
// import { CONFIGS } from '../../../../config';

// function Admin_updateorder() {
//   const { _id } = useParams();
//   const [customerInfo, setCustomerInfo] = useState({
//     cust_name: '',
//     cust_contact: '',
//     cust_number: '',
//     cust_addresses: [],
//     selected_address: null,
//     pincode: '',
//     order_date: '',
//   });
//   const [newAddress, setNewAddress] = useState('');
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [editedAddress, setEditedAddress] = useState('');

//   // Fetch order details on component mount
//   useEffect(() => {
//     const fetchOrderDetails = async () => {
//       try {
//         const response = await fetch(`${CONFIGS.API_BASE_URL}/order/${_id}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch order details');
//         }
//         const order = await response.json();

//         setCustomerInfo({
//           cust_name: order.cust_name || '',
//           cust_contact: order.cust_contact || '',
//           cust_number: order.cust_number || '',
//           cust_addresses: order.cust_address || [],
//           selected_address: order.selected_address || 0,
//           pincode: order.pincode || '',
//           order_date: order.order_date ? order.order_date.split('T')[0] : '',
//         });
//       } catch (error) {
//         toast.error(error.message);
//       }
//     };

//     fetchOrderDetails();
//   }, [_id]);

//   // Handle input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCustomerInfo({
//       ...customerInfo,
//       [name]: value,
//     });
//   };

//   // Handle adding a new address
//   const handleAddAddress = () => {
//     if (newAddress.trim()) {
//       setCustomerInfo({
//         ...customerInfo,
//         cust_addresses: [...customerInfo.cust_addresses, newAddress],
//       });
//       setNewAddress(''); // Clear input field
//     }
//   };

//   // Handle removing an address
//   const handleRemoveAddress = (index) => {
//     const updatedAddresses = customerInfo.cust_addresses.filter((_, i) => i !== index);
//     setCustomerInfo({
//       ...customerInfo,
//       cust_addresses: updatedAddresses,
//     });
//   };

//   // Handle selecting an address
//   const handleSelectAddress = (index) => {
//     setCustomerInfo({
//       ...customerInfo,
//       selected_address: index,
//     });
//   };

//   // Handle new address input change
//   const handleNewAddressChange = (e) => {
//     setNewAddress(e.target.value);
//   };

//   // Handle editing an address
//   const handleEditAddress = (index) => {
//     setEditingIndex(index);
//     setEditedAddress(customerInfo.cust_addresses[index]);
//   };

//   // Handle updated address change
//   const handleEditedAddressChange = (e) => {
//     setEditedAddress(e.target.value);
//   };

//   // Save edited address
//   const handleSaveEdit = () => {
//     const updatedAddresses = customerInfo.cust_addresses.map((address, index) =>
//       index === editingIndex ? editedAddress : address
//     );
//     setCustomerInfo({
//       ...customerInfo,
//       cust_addresses: updatedAddresses,
//     });
//     setEditingIndex(null);
//     setEditedAddress('');
//   };

//   // Handle form submission to update order
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Convert cust_addresses to cust_address as expected by the backend
//     const requestBody = {
//       ...customerInfo,
//       cust_address: customerInfo.cust_addresses,
//     };

//     try {
//       const response = await fetch(`${CONFIGS.API_BASE_URL}/editorder/${_id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestBody),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update order');
//       }

//       toast.success('Order updated successfully');
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h2>Update Order</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label>Name:</label>
//           <input
//             type="text"
//             name="cust_name"
//             value={customerInfo.cust_name}
//             onChange={handleInputChange}
//             className="order_info"
//           />
//         </div>

//         <div className="form-group">
//           <label>Phone number:</label>
//           <input
//             type="text"
//             name="cust_contact"
//             value={customerInfo.cust_contact}
//             onChange={handleInputChange}
//             className="order_info"
//           />
//         </div>

//         <div className="form-group">
//           <label>Addresses:</label>
//           {customerInfo.cust_addresses.length > 0 && (
//             <div>
//               {customerInfo.cust_addresses.map((address, index) => (
//                 <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
//                   <input
//                     type="radio"
//                     name="selected_address"
//                     value={index}
//                     checked={customerInfo.selected_address === index}
//                     onChange={() => handleSelectAddress(index)}
//                   />
//                   <span style={{ marginLeft: '8px', flexGrow: 1 }}>
//                     {editingIndex === index ? (
//                       <input
//                         type="text"
//                         value={editedAddress}
//                         onChange={handleEditedAddressChange}
//                         style={{ flexGrow: 1 }}
//                       />
//                     ) : (
//                       address
//                     )}
//                   </span>
//                   <button
//                     type="button"
//                     className="btn btn-danger"
//                     onClick={() => handleRemoveAddress(index)}
//                   >
//                     <FaTrash />
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-warning"
//                     onClick={() => handleEditAddress(index)}
//                     style={{ marginLeft: '5px' }}
//                   >
//                     <FaEdit />
//                   </button>
//                   {editingIndex === index && (
//                     <button
//                       type="button"
//                       className="btn btn-success"
//                       onClick={handleSaveEdit}
//                       style={{ marginLeft: '5px' }}
//                     >
//                       Save
//                     </button>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//           <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
//             <textarea
//               rows={2}
//               placeholder="Enter new address"
//               value={newAddress}
//               onChange={handleNewAddressChange}
//               style={{ flexGrow: 1, marginRight: '10px' }}
//             />
//             <button
//               type="button"
//               className="btn btn-success"
//               onClick={handleAddAddress}
//             >
//               Add <FaPlus />
//             </button>
//           </div>
//         </div>

//         <div className="form-group">
//           <label>Pincode:</label>
//           <input
//             type="text"
//             name="pincode"
//             value={customerInfo.pincode}
//             onChange={handleInputChange}
//             className="order_info"
//           />
//         </div>

//         <div className="form-group">
//           <label>Order Date:</label>
//           <input
//             type="date"
//             name="order_date"
//             value={customerInfo.order_date}
//             onChange={handleInputChange}
//             className="order_info"
//           />
//         </div>

//         <button type="submit" className="btn btn-primary">Update Order</button>
//       </form>
//     </div>
//   );
// }

// export default Admin_updateorder;



import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // To get _id from URL
import { FaTrash, FaPlus, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { CONFIGS } from '../../../../config';

function Admin_updateorder() {
  const { _id } = useParams();
  const [customerInfo, setCustomerInfo] = useState({
    cust_name: '',
    cust_contact: '',
    cust_number: '',
    cust_addresses: [],
    selected_address: null,
    pincode: '',
    order_date: '',
  });
  const [newAddress, setNewAddress] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedAddress, setEditedAddress] = useState('');

  // Fetch order details on component mount
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`${CONFIGS.API_BASE_URL}/order/${_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }
        const order = await response.json();

        setCustomerInfo({
          cust_name: order.cust_name || '',
          cust_contact: order.cust_contact || '',
          cust_number: order.cust_number || '',
          cust_addresses: order.cust_address || [],
          selected_address: order.selected_address || 0,
          pincode: order.pincode || '',
          order_date: order.order_date ? order.order_date.split('T')[0] : '',
        });
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchOrderDetails();
  }, [_id]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo({
      ...customerInfo,
      [name]: value,
    });
  };

  // Handle adding a new address
  const handleAddAddress = () => {
    if (newAddress.trim()) {
      setCustomerInfo({
        ...customerInfo,
        cust_addresses: [...customerInfo.cust_addresses, newAddress],
      });
      setNewAddress(''); // Clear input field
    }
  };

  // Handle removing an address
  const handleRemoveAddress = (index) => {
    const updatedAddresses = customerInfo.cust_addresses.filter((_, i) => i !== index);
    setCustomerInfo({
      ...customerInfo,
      cust_addresses: updatedAddresses,
    });
  };

  // Handle selecting an address
  const handleSelectAddress = (index) => {
    setCustomerInfo({
      ...customerInfo,
      selected_address: index,
    });
  };

  // Handle new address input change
  const handleNewAddressChange = (e) => {
    setNewAddress(e.target.value);
  };

  // Handle editing an address
  const handleEditAddress = (index) => {
    setEditingIndex(index);
    setEditedAddress(customerInfo.cust_addresses[index]);
  };

  // Handle updated address change
  const handleEditedAddressChange = (e) => {
    setEditedAddress(e.target.value);
  };

  // Save edited address
  const handleSaveEdit = () => {
    const updatedAddresses = customerInfo.cust_addresses.map((address, index) =>
      index === editingIndex ? editedAddress : address
    );
    setCustomerInfo({
      ...customerInfo,
      cust_addresses: updatedAddresses,
    });
    setEditingIndex(null);
    setEditedAddress('');
  };

  // Handle form submission to update order
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert cust_addresses to cust_address as expected by the backend
    const requestBody = {
      ...customerInfo,
      cust_address: customerInfo.cust_addresses,
    };

    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/editorder/${_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to update order');
      }

      toast.success('Order updated successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Update Order</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="cust_name"
            value={customerInfo.cust_name}
            onChange={handleInputChange}
            className="order_info"
            disabled
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
            disabled
          />
        </div>

        <div className="form-group">
          <label>Addresses:</label>
          {customerInfo.cust_addresses.length > 0 && (
            <div>
              {customerInfo.cust_addresses.map((address, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <input
                    type="radio"
                    name="selected_address"
                    value={index}
                    checked={customerInfo.selected_address === index}
                    onChange={() => handleSelectAddress(index)}
                  />
                  <span style={{ marginLeft: '8px', flexGrow: 1 }}>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={editedAddress}
                        onChange={handleEditedAddressChange}
                        style={{ flexGrow: 1 }}
                      />
                    ) : (
                      address
                    )}
                  </span>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleRemoveAddress(index)}
                    style={{ marginLeft: '10px', borderRadius: '5px', border: 'none' }}
                  >
                    <FaTrash />
                  </button>
                  <button
                    type="button"
                    className="btn  "
                    onClick={() => handleEditAddress(index)}
                    style={{ marginLeft: '10px', borderRadius: '5px', border: 'none' }}
                  >
                    <FaEdit />
                  </button>
                  {editingIndex === index && (
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={handleSaveEdit}
                      style={{ marginLeft: '10px', borderRadius: '5px', border: 'none' }}
                    >
                      Save
                    </button>
                  )}
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
              style={{ flexGrow: 1, marginRight: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <button
              type="button"
              className="btn btn-success"
              onClick={handleAddAddress}
              style={{ borderRadius: '5px', border: 'none' }}
            >
              Add <FaPlus />
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
            disabled
          />
        </div>

        <div className="form-group">
          <label>Order Date:</label>
          <input
            type="date"
            name="order_date"
            value={customerInfo.order_date}
            onChange={handleInputChange}
            className="order_info"
            disabled
          />
        </div>

        <button type="submit" className="btn btn-primary">Update Order</button>
      </form>
    </div>
  );
}

export default Admin_updateorder;
