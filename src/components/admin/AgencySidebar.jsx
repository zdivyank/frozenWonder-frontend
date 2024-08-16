import React from 'react';
import { NavLink } from 'react-router-dom';
import './adminsidebar.css';
import { AiFillProduct } from 'react-icons/ai';
import { GoListOrdered } from 'react-icons/go';
import { FaLocationDot } from 'react-icons/fa6';
import { IoLogOutOutline } from 'react-icons/io5';
import { VscFeedback } from 'react-icons/vsc';
import { FaUsers } from 'react-icons/fa';
import { CiCalendarDate } from 'react-icons/ci';
import { MdOutlineAssignmentTurnedIn } from 'react-icons/md';

function AgencySidebar() {
  return (
    <div className="admin-sidebar">
      <h2>Agency Dashboard</h2>
      <hr />
      <ul>
      
        <li><NavLink to="/agency/orders" activeClassName="active"><GoListOrdered className='me-2'/>Order Summary</NavLink></li>
        <li><NavLink to="/agency/assignorders" activeClassName="active"><MdOutlineAssignmentTurnedIn className='me-2'/>Assign Order </NavLink></li>
        <li><NavLink to="/agency/location" activeClassName="active"><FaLocationDot className='me-2'/>
        Location Filter</NavLink></li>
        <li><NavLink to="/logout" className="logout"><IoLogOutOutline className='me-2'/>
        Logout</NavLink></li>
      </ul>
    </div>
  );
}

export default AgencySidebar;
