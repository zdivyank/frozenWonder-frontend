import React, { useState, useEffect } from 'react';
import './adminTesimonails.css';
import { CONFIGS } from '../../../../config/index';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';
import { CiCirclePlus } from 'react-icons/ci';

function AdminTesimonails() {
  const [testimonials, setTestimonials] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    cust_name: '',
    message: '',
    image: null,
  });
  const [editTestimonial, setEditTestimonial] = useState(null);
  const [saving, setSaving] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState({}); // State to manage expanded messages

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/gettestimonail`);
      const data = await response.json();
      if (response.ok) {
        setTestimonials(data.message);
      } else {
        console.error('Error fetching testimonials');
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  const handleAddTestimonial = async () => {
    try {
      const formData = new FormData();
      formData.append('cust_name', newTestimonial.cust_name);
      formData.append('message', newTestimonial.message);
      if (newTestimonial.image) {
        formData.append('image', newTestimonial.image);
      }

      const response = await fetch(`${CONFIGS.API_BASE_URL}/addtestimonail`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        fetchTestimonials();
        handleCloseAddModal();
        toast.success('Testimonial added successfully!');
      } else {
        const result = await response.json();
        toast.error(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error adding testimonial:', error);
    }
  };

  const handleUpdateVerify = async (id, currentVerifyStatus) => {
    try {
      const updatedVerify = !currentVerifyStatus; // Toggle verify status
      const response = await fetch(`${CONFIGS.API_BASE_URL}/updatetestimonail/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verify: updatedVerify }),
      });

      if (response.ok) {
        toast.success('Verify status updated successfully!');
        setTestimonials(
          testimonials.map((t) =>
            t._id === id ? { ...t, verify: updatedVerify } : t
          )
        );
      } else {
        toast.error('Failed to update verify status.');
      }
    } catch (error) {
      console.error('Error updating verify status:', error);
      toast.error('Error updating verify status');
    }
  };

  const handleDeleteTestimonial = async (id) => {
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/deletetestimonail/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTestimonials();
        toast.success('Testimonial deleted successfully!');
      } else {
        const result = await response.json();
        toast.error(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
    }
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewTestimonial({
      cust_name: '',
      message: '',
      image: null,
    });
  };

  const toggleMessage = (id) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the expansion state for each testimonial by ID
    }));
  };

  const truncateMessage = (message, wordLimit, isExpanded) => {
    if (isExpanded) {
      return message; // Show the full message if expanded
    }
    const words = message.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return message;
  };

  return (
    <div className="admin-testimonials">
      <h1 className='text-center'>Our Success Stories</h1>
      {testimonials.length > 0 ? (
        <Table striped bordered responsive hover className="mt-4">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Message</th>
              <th>Image/Video</th>
              <th>Verify Status</th>
              <th>Contact_number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map((testimonial) => (
              <tr key={testimonial._id}>
                <td>{testimonial.cust_name}</td>
                <td className='testimonial_msg'>
                  {truncateMessage(
                    testimonial.message,
                    10, // Adjust word limit here
                    expandedMessages[testimonial._id]
                  )}
                  {testimonial.message.split(' ').length > 10 && (
                    <button
                      className="toggle-message-btn"
                      onClick={() => toggleMessage(testimonial._id)}
                    >
                      {expandedMessages[testimonial._id] ? 'Show Less' : 'Show More'}
                    </button>
                  )}
                </td>
                <td>
                  {testimonial.image && (
                    testimonial.image.endsWith('.mp4') ? (
                      <video autoPlay className="img-fluid" width="100">
                        <source src={testimonial.image} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img
                        src={testimonial.image}
                        alt={`${testimonial.cust_name}'s testimonial`}
                        width="100"
                      />
                    )
                  )}
                </td>
                <td>{testimonial.verify ? 'Verified' : 'Not Verified'}</td>
                <td>{testimonial.contact_number}</td>
                <td>
                  <Button
                    variant="outline-primary me-2"
                    onClick={() => handleUpdateVerify(testimonial._id, testimonial.verify)}
                  >
                    {testimonial.verify ? 'Unverify' : 'Verify'}
                  </Button>
                  <Button
                    variant="outline-danger"
                    onClick={() => handleDeleteTestimonial(testimonial._id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No testimonials available.</p>
      )}
    </div>
  );
}

export default AdminTesimonails;
