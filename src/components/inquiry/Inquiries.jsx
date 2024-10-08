import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CONFIGS } from '../../../config';
import './Inquiries.css';  // Import the CSS file
import { useLocation } from 'react-router-dom';

function Inquiries() {
  const [formData, setFormData] = useState({
    name: '',
    company_name: '',
    user_number: '',
    region: '',
    message: '',
    status: false,  // Set status to false by default
  });
  const [isclicked, setisclicked] = useState(false);

  const location = useLocation();
  useEffect(() => {
    // Scroll to the "Contact Us" section only if the hash is "#contact-us"
    if (location.hash === '#inquiries') {
      document.getElementById('inquiries').scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setisclicked(true);

    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/addinquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Message Sent successfully!', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        // Reset form after successful submission
        setFormData({
          name: '',
          company_name: '',
          user_number: '',
          region: '',
          message: '',
          status: false, 
        });
        setisclicked(false);
      } else {
        const errorData = await response.json();
        setisclicked(false);
        toast.error('Failed to submit inquiry: ' + errorData.Message);
      }
    } catch (error) {
      toast.error('Failed to submit inquiry. Please try again.');
      console.error('Error:', error);
      setisclicked(false);
    }
  };

  return (
    <>
      <div className="main_container">
        <h1 className="inquiries-heading">  Business Inquiry</h1>
        <div className="inquiries-container" id="inquiries">
          <form onSubmit={handleSubmit} className="inquiries-form">
            <div className="form-group">
              <label className="form-label">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Company Name:</label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number:</label>
              <input
                type="text"
                name="user_number"
                value={formData.user_number}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Area:</label>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Message:</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="form-textarea"
                required
              />
            </div>
            <button type="submit" disabled={isclicked} className="form-button">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Inquiries;
