import React from 'react';
import { NavLink } from 'react-router-dom';
import './adminsidebar.css';
import { AiFillProduct } from 'react-icons/ai';
import { GoListOrdered } from 'react-icons/go';
import { FaLocationDot } from 'react-icons/fa6';
import { IoLogOutOutline } from 'react-icons/io5';

function AdminSidebar() {
  return (
    <div className="admin-sidebar">
      <h2>Admin Dashboard</h2>
      <hr />
      <ul>
        <li><NavLink to="/admin/product" activeClassName="active"><AiFillProduct className='me-2' /> Products</NavLink></li>
        <li><NavLink to="/admin/order" activeClassName="active"><GoListOrdered className='me-2'/>Order Summary</NavLink></li>
        <li><NavLink to="/admin/location" activeClassName="active"><FaLocationDot className='me-2'/>
        Location Filter</NavLink></li>
        <li><NavLink to="/logout" className="logout"><IoLogOutOutline className='me-2'/>
        Logout</NavLink></li>
      </ul>
    </div>
  );
}

export default AdminSidebar;
