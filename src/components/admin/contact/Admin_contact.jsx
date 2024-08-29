import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CONFIGS } from '../../../../config';
import './Admin_contact.css';  // Import the updated CSS file

function Admin_contact() {
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await fetch(`${CONFIGS.API_BASE_URL}/getinquiry`);
        if (response.ok) {
          const data = await response.json();
          // Sort inquiries by _id to get the newest inquiries first
          const sortedInquiries = data.message.sort((a, b) => b._id.localeCompare(a._id));
          setInquiries(sortedInquiries);
        } else {
          const errorData = await response.json();
          toast.error('Failed to fetch inquiries: ' + errorData.message);
        }
      } catch (error) {
        toast.error('Failed to fetch inquiries. Please try again.');
        console.error('Error:', error);
      }
    };

    fetchInquiries();
  }, []);
  const handledownload = async()=>{
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/downloadInquiries`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        // Create a link to trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'inquiries.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        console.error('Failed to download file');
      }
    }catch (error) {
      console.log(error);
      
    }
  }

  return (
    <div className="admin-contact-container text-center">
      <h1 className="admin-contact-title">Inquiries</h1>
      <button className='text-center btn btn-dark mt-3 mb-3' onClick={handledownload}>Download excel</button>

      
      <div className="inquiries-list">
        {inquiries.map((inquiry, index) => (
          <div key={index} className="inquiry-card">
            <div className="inquiry-details">
              <p><strong>Name:</strong> {inquiry.name}</p>
              <p><strong>Company Name:</strong> {inquiry.company_name}</p>
              <p><strong>Phone Number:</strong> {inquiry.user_number}</p>
              <p><strong>Region:</strong> {inquiry.region}</p>
              <p><strong>Message:</strong> {inquiry.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin_contact;
