import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { CONFIGS } from '../../../../config';
import { useAuth } from '../../../store/Auth';
import MiniNavbar from './MiniNavabar.jsx'; // Fixed typo in import
import './adminuser.css'; // Import the CSS file

function Admin_user() {

  const [userForm, setUserForm] = useState({
    username: '', email: '', phone: '', password: '', role: '', agency_id: '', 
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

  const handleUserSubmit = async (e) => {
    e.preventDefault();
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
    <>
      <MiniNavbar />
      <div className="admin-user-container">
        <h2>Add User</h2>
        <form onSubmit={handleUserSubmit}>
          <label className="admin-user-label">
            Username
            <input 
              type="text" 
              placeholder="Username" 
              value={userForm.username} 
              onChange={(e) => setUserForm({...userForm, username: e.target.value})} 
            />
          </label>
          <label className="admin-user-label">
            Email
            <input 
              type="email" 
              placeholder="Email" 
              value={userForm.email} 
              onChange={(e) => setUserForm({...userForm, email: e.target.value})} 
            />
          </label>
          <label className="admin-user-label">
            Phone
            <input 
              type="text" 
              placeholder="Phone" 
              value={userForm.phone} 
              onChange={(e) => setUserForm({...userForm, phone: e.target.value})} 
            />
          </label>
          <label className="admin-user-label">
            Password
            <input 
              type="password" 
              placeholder="Password" 
              value={userForm.password} 
              onChange={(e) => setUserForm({...userForm, password: e.target.value})} 
            />
          </label>
          <label className="admin-user-label">
            Role
            <select 
              value={userForm.role} 
              onChange={(e) => setUserForm({...userForm, role: e.target.value})}
            >
              <option value="">Select Role</option>
              {roles.map(role => <option key={role._id} value={role._id}>{role.name}</option>)}
            </select>
          </label>
          <label className="admin-user-label">
            Agency
            <select 
              value={userForm.agency_id} 
              onChange={(e) => setUserForm({...userForm, agency_id: e.target.value})}
            >
              <option value="">Select Agency</option>
              {agencies.map(agency => <option key={agency._id} value={agency._id}>{agency.agency_name}</option>)}
            </select>
          </label>
          <button type="submit">Register User</button>
        </form>
      </div>
    </>
  );
}

export default Admin_user;
