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

  return (
    <div className="admin-contact-container">
      <h1 className="admin-contact-title">Inquiries</h1>
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
