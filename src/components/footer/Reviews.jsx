import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { CONFIGS } from '../../../config';
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropImage'; // Import the cropping function
import './reviews.css';

function Reviews() {
  const [newTestimonial, setNewTestimonial] = useState({
    cust_name: '',
    message: '',
    image: null,
    verify: false,
    contact_number: '',
  });
  const [saving, setSaving] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (name, value) => {
    setNewTestimonial((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Show preview
      };
      reader.readAsDataURL(file);
      setNewTestimonial({ ...newTestimonial, image: file }); // Store original image
    }
  };

  const handleCropComplete = async () => {
    if (imagePreview) {
      const image = await getCroppedImg(imagePreview, crop, zoom);
      setCroppedImage(image);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('cust_name', newTestimonial.cust_name);
      formData.append('message', newTestimonial.message);
      formData.append('contact_number', newTestimonial.contact_number);
      formData.append('verify', newTestimonial.verify);

      // Use cropped image if available
      if (croppedImage) {
        formData.append('image', croppedImage, 'croppedImage.jpg');
      } else if (newTestimonial.image) {
        formData.append('image', newTestimonial.image); // Ensure this is a File object
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
          verify: false,
          contact_number: '',
        });
        setCroppedImage(null);
        setImagePreview(null); // Reset preview
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
      <h1 className="reviews-title mt-3">Share Your Review</h1>
      <div className="reviews-container">
        <div className="reviews-img-container">
          <img src="/img/review.svg" alt="Reviews" className="reviews-image" />
        </div>

        <Form className="reviews-form" onSubmit={handleFormSubmit}>
          <Form.Group controlId="formCustName">
            <Form.Label>Customer Name</Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="Enter customer name"
              value={newTestimonial.cust_name}
              onChange={(e) => handleInputChange('cust_name', e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formCustNumber">
            <Form.Label>Customer Number</Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="Enter customer number"
              value={newTestimonial.contact_number}
              onChange={(e) => handleInputChange('contact_number', e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formMessage">
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              required
              rows={3}
              placeholder="Enter testimonial message"
              value={newTestimonial.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formImage">
            <Form.Label>Upload Your Image/Video</Form.Label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Form.Group>

          {imagePreview && (
            <div style={{ position: 'relative', height: '300px', width: '100%' }}>
              <Cropper
                image={imagePreview}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3} // Set the aspect ratio (optional)
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
                style={{ containerStyle: { height: '300px' } }}
              />
            </div>
          )}

          <Button className="reviews-submit-btn" type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Submit'}
          </Button>
        </Form>
      </div>
    </>
  );
}

export default Reviews;
