import React from 'react'
import { NavLink } from 'react-router-dom';
import './mininavbar.css'
import { useAuth } from '../../../store/Auth';



function MiniNavbar() {
    const { user } = useAuth();
  return (
    <div className="status col-md-6 ">
          
    <NavLink to={`/admin/user`} ><p className='status_info'>Add User</p></NavLink>
    <NavLink to={`/admin/agency`}><p className='status_info'>Add agency</p></NavLink>
  

</div>
  )
}

export default MiniNavbar