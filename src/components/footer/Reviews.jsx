import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { CONFIGS } from '../../../config';
import './reviews.css';

function Reviews() {
  const [newTestimonial, setNewTestimonial] = useState({
    cust_name: '',
    message: '',
    image: null,
    verify: false
  });
  const [saving, setSaving] = useState(false);

  const handleInputChange = (name, value) => {
    setNewTestimonial((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    setNewTestimonial({ ...newTestimonial, image: event.target.files[0] });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('cust_name', newTestimonial.cust_name);
      formData.append('message', newTestimonial.message);
      formData.append('verify', newTestimonial.verify);
      if (newTestimonial.image) {
        formData.append('image', newTestimonial.image);
      }

      const response = await fetch(`${CONFIGS.API_BASE_URL}/addtestimonail`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        toast.success('Testimonial added successfully!', {
          position: 'top-center',
          autoClose: 5000
        });
        setNewTestimonial({
          cust_name: '',
          message: '',
          image: null,
          verify: false
        });
      } else {
        const result = await response.json();
        toast.error(`Error: ${result.Message}`);
      }
    } catch (error) {
      toast.error('Error adding testimonial');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <h1 className="reviews-title mt-3">Share Your EXperience</h1>
    <div className="reviews-container">
      <div className="reviews-img-container">
        <img src="/img/review.svg" alt="Reviews" className="reviews-image" />
      </div>

      <Form className="reviews-form" onSubmit={handleFormSubmit}>
        <Form.Group controlId="formCustName">
          <Form.Label>Customer Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter customer name"
            value={newTestimonial.cust_name}
            onChange={(e) => handleInputChange('cust_name', e.target.value)}
            />
        </Form.Group>

        <Form.Group controlId="formMessage">
          <Form.Label>Message</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter testimonial message"
            value={newTestimonial.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formImage">
          <Form.Label>Upload Image/Video</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            />
        </Form.Group>

        <Button className="reviews-submit-btn"  type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Submit'}
        </Button>
      </Form>
    </div>
            </>
  );
}

export default Reviews;
