import React from 'react'
import { NavLink } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function Archive_minibar() {
  return (
    <>
     <div className="status col-md-6 ">
          
          <Link to={`/admin/archive`} ><p className='status_info'>Orders</p></Link>
          <Link to={`/admin/archive/inquiry`}><p className='status_info'>Inquiries</p></Link>
        
      
      </div>
    </>
  )
}

export default Archive_minibar