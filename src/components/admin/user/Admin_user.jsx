import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';  // Added toast for notifications
import { CONFIGS } from '../../../../config';
import { useAuth } from '../../../store/Auth';

function Admin_user() {
  const [agencyForm, setAgencyForm] = useState({
    agency_name: '', owner: '', mobile_number: '', email: '', gstno: '', address: '', logo: null
  });
  const [userForm, setUserForm] = useState({
    username: '', email: '', phone: '', password: '', role: '', agency_id: '', user_type: ''
  });
  const [roles, setRoles] = useState([]);
  const [agencies, setAgencies] = useState([]);

  const userAuthentication = useAuth();
  
  useEffect(() => {
    fetchRoles();
    fetchAgencies();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/getrole`);
      const data = await response.json();
      setRoles(data.message);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchAgencies = async () => {
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/getagency`);
      const data = await response.json();
      setAgencies(data.message);
    } catch (error) {
      console.error('Error fetching agencies:', error);
    }
  };

  const handleAgencySubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in agencyForm) {
      formData.append(key, agencyForm[key]);
    }
    formData.append('admin_id', userAuthentication.user._id);

    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/addagency`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      alert('Agency added successfully');
      setAgencyForm({ agency_name: '', owner: '', mobile_number: '', email: '', gstno: '', address: '', logo: null });
      fetchAgencies();
    } catch (error) {
      console.error('Error adding agency:', error);
      alert(`Failed to add agency: ${error.message}`);
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();  // Prevent default form submission behavior
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success('User added successfully!', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <div>
      <h2>Add Agency</h2>
      <form onSubmit={handleAgencySubmit}>
        <input type="text" placeholder="Agency Name" value={agencyForm.agency_name} onChange={(e) => setAgencyForm({...agencyForm, agency_name: e.target.value})} />
        <input type="text" placeholder="Owner" value={agencyForm.owner} onChange={(e) => setAgencyForm({...agencyForm, owner: e.target.value})} />
        <input type="text" placeholder="Mobile Number" value={agencyForm.mobile_number} onChange={(e) => setAgencyForm({...agencyForm, mobile_number: e.target.value})} />
        <input type="email" placeholder="Email" value={agencyForm.email} onChange={(e) => setAgencyForm({...agencyForm, email: e.target.value})} />
        <input type="text" placeholder="GST No" value={agencyForm.gstno} onChange={(e) => setAgencyForm({...agencyForm, gstno: e.target.value})} />
        <input type="text" placeholder="Address" value={agencyForm.address} onChange={(e) => setAgencyForm({...agencyForm, address: e.target.value})} />
        <input type="file" onChange={(e) => setAgencyForm({...agencyForm, logo: e.target.files[0]})} />
        <button type="submit">Add Agency</button>
      </form>

      <h2>Register User</h2>
      <form onSubmit={handleUserSubmit}>
        <input type="text" placeholder="Username" value={userForm.username} onChange={(e) => setUserForm({...userForm, username: e.target.value})} />
        <input type="email" placeholder="Email" value={userForm.email} onChange={(e) => setUserForm({...userForm, email: e.target.value})} />
        <input type="text" placeholder="Phone" value={userForm.phone} onChange={(e) => setUserForm({...userForm, phone: e.target.value})} />
        <input type="password" placeholder="Password" value={userForm.password} onChange={(e) => setUserForm({...userForm, password: e.target.value})} />
        <select value={userForm.role} onChange={(e) => setUserForm({...userForm, role: e.target.value})}>
          <option value="">Select Role</option>
          {roles.map(role => <option key={role._id} value={role._id}>{role.name}</option>)}
        </select>
        <select value={userForm.agency_id} onChange={(e) => setUserForm({...userForm, agency_id: e.target.value})}>
          <option value="">Select Agency</option>
          {agencies.map(agency => <option key={agency._id} value={agency._id}>{agency.agency_name}</option>)}
        </select>
        <select value={userForm.user_type} onChange={(e) => setUserForm({...userForm, user_type: e.target.value})}>
          <option value="">Select User Type</option>
          <option value="Agency">Agency</option>
          <option value="Delivery Person">Delivery Person</option>
        </select>
        <button type="submit">Register User</button>
      </form>
    </div>
  );
}

export default Admin_user;
