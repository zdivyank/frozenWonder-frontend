import React, { useState, useEffect } from 'react';
import './adminTesimonails.css'; // Ensure to create this CSS file for styling
import { CONFIGS } from '../../../../config/index';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap'; // Import Bootstrap components
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import icons
import { CiCirclePlus } from 'react-icons/ci';

function AdminTesimonails() {
  const [testimonials, setTestimonials] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    cust_name: '',
    message: '',
    image: null
  });
  const [editTestimonial, setEditTestimonial] = useState(null);
  const [saving, setSaving] = useState(false); // New state for tracking button disabled

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
        body: formData
      });

      if (response.ok) {
        fetchTestimonials();
        handleCloseAddModal();
        toast.success('Testimonial added successfully!', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        const result = await response.json();
        toast.error(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error adding testimonial:', error);
    }
  };

  const handleUpdateTestimonial = async () => {
    setSaving(true); // Disable the button
    try {
      const formData = new FormData();
      formData.append('cust_name', editTestimonial.cust_name);
      formData.append('message', editTestimonial.message);
      if (editTestimonial.image) {
        formData.append('image', editTestimonial.image);
      }

      const response = await fetch(`${CONFIGS.API_BASE_URL}/updatetestimonail/${editTestimonial._id}`, {
        method: 'PUT',
        body: formData
      });

      if (response.ok) {
        fetchTestimonials();
        handleCloseEditModal();
        toast.success('Testimonial updated successfully!', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        const result = await response.json();
        toast.error(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error updating testimonial:', error);
    } finally {
      setSaving(false); // Re-enable the button
    }
  };

  const handleDeleteTestimonial = async (id) => {
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/deletetestimonail/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchTestimonials();
        toast.success('Testimonial deleted successfully!', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
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
      image: null
    });
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditTestimonial(null);
  };

  const handleFileChange = (event) => {
    setNewTestimonial({ ...newTestimonial, image: event.target.files[0] });
  };

  const handleEditFileChange = (event) => {
    setEditTestimonial({ ...editTestimonial, image: event.target.files[0] });
  };

  return (
    <div className="admin-testimonials">
      <Button className='btn btn-success' onClick={() => setShowAddModal(true)}> <CiCirclePlus className='me-2' size={24}/> Add Testimonial</Button>
      <Row className="mt-4">
        <h1>Our Success Stories</h1>
        <hr />
        {testimonials.length > 0 ? (
          testimonials.map((testimonial) => (
            <Col md={4} sm={6} xs={12} key={testimonial._id} className="mb-4 d-flex">
              <div className="testimonial-card p-3 border rounded d-flex flex-column">
                <p><strong>Customer Name:</strong> {testimonial.cust_name}</p>
                {testimonial.image && (
                  testimonial.image.endsWith('.mp4') ? (
                    <video controls autoPlay className="img-fluid">
                      <source src={testimonial.image} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img src={testimonial.image} alt={`${testimonial.cust_name}'s testimonial`} className="img-fluid" />
                  )
                )}
                <p><strong>Message:</strong> {testimonial.message}</p>
                <hr />
                <div className="actions text-center mt-auto">
                  <Button 
                    variant="outline-primary me-3" 
                    onClick={() => {
                      setEditTestimonial(testimonial);
                      setShowEditModal(true);
                    }}
                  >
                    <FaEdit />
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    onClick={() => handleDeleteTestimonial(testimonial._id)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </div>
            </Col>
          ))
        ) : (
          <p>No testimonials available.</p>
        )}
      </Row>

      {/* Add Testimonial Modal */}
      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Testimonial</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCustName">
              <Form.Label>Customer Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter customer name"
                value={newTestimonial.cust_name}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, cust_name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formMessage">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter testimonial message"
                value={newTestimonial.message}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, message: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formImage">
              <Form.Label>Upload Image or Video</Form.Label>
              <Form.Control
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddTestimonial}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Testimonial Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Testimonial</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editTestimonial && (
            <Form>
              <Form.Group controlId="formEditCustName">
                <Form.Label>Customer Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter customer name"
                  value={editTestimonial.cust_name}
                  onChange={(e) => setEditTestimonial({ ...editTestimonial, cust_name: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formEditMessage">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter testimonial message"
                  value={editTestimonial.message}
                  onChange={(e) => setEditTestimonial({ ...editTestimonial, message: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formEditImage">
                <Form.Label>Upload New Image or Video (Optional)</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleEditFileChange}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={handleUpdateTestimonial}
            disabled={saving} // Disable button if saving is true
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminTesimonails;
