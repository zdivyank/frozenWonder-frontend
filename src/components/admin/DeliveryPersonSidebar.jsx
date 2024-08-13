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

function DeliveryPersonSidebar() {
  return (
    <div className="admin-sidebar">
      <h2>Delivery Person Dashboard</h2>
      <hr />
      <ul>
      
        <li><NavLink to="/delivery/orders" activeClassName="active"><GoListOrdered className='me-2'/>Order Summary</NavLink></li>
       
        <li><NavLink to="/logout" className="logout"><IoLogOutOutline className='me-2'/>
        Logout</NavLink></li>
      </ul>
    </div>
  )
}

export default DeliveryPersonSidebar