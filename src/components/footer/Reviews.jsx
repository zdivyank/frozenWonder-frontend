// import React, { useState } from 'react';
// import { Form, Button } from 'react-bootstrap';
// import { toast } from 'react-toastify';
// import { CONFIGS } from '../../../config';
// import './reviews.css';

// function Reviews() {
//   const [newTestimonial, setNewTestimonial] = useState({
//     cust_name: '',
//     message: '',
//     image: null,
//     verify: false,
//     contact_number: '',
//   });
//   const [saving, setSaving] = useState(false);

//   const handleInputChange = (name, value) => {
//     setNewTestimonial((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (event) => {
//     setNewTestimonial({ ...newTestimonial, image: event.target.files[0] });
//   };
//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);

//     try {
//       const formData = new FormData();
//       formData.append('cust_name', newTestimonial.cust_name);
//       formData.append('message', newTestimonial.message);
//       formData.append('contact_number', newTestimonial.contact_number);
//       formData.append('verify', newTestimonial.verify);

//       if (newTestimonial.image) {
//         formData.append('image', newTestimonial.image); // Ensure this is a File object
//       }

//       console.log('Form Data:', formData.get('image')); // Debugging

//       const response = await fetch(`${CONFIGS.API_BASE_URL}/addtestimonail`, {
//         method: 'POST',
//         body: formData
//       });

//       if (response.ok) {
//         toast.success('Testimonial added successfully!', {
//           position: 'top-center',
//           autoClose: 5000
//         });
//         setNewTestimonial({
//           cust_name: '',
//           message: '',
//           image: null,
//           verify: false,
//           contact_number: '',
//         });
//       } else {
//         const result = await response.json();
//         toast.error(`Error: ${result.Message}`);
//       }
//     } catch (error) {
//       toast.error('Error adding testimonial');
//     } finally {
//       setSaving(false);
//     }
//   };


//   return (
//     <>
//       <h1 className="reviews-title mt-3">Share Your Review</h1>
//       <div className="reviews-container">
//         <div className="reviews-img-container">
//           <img src="/img/review.svg" alt="Reviews" className="reviews-image" />
//         </div>

//         <Form className="reviews-form" onSubmit={handleFormSubmit}>
//           <Form.Group controlId="formCustName">
//             <Form.Label>Customer Name</Form.Label>
//             <Form.Control
//               type="text"
//               required
//               placeholder="Enter customer name"
//               value={newTestimonial.cust_name}
//               onChange={(e) => handleInputChange('cust_name', e.target.value)}
//             />
//           </Form.Group>
//           {/* <Form className="reviews-form" onSubmit={handleFormSubmit}> */}


//           <Form.Group controlId="formCustName">
//             <Form.Label>Customer Number</Form.Label>
//             <Form.Control
//               type="number"
//               required
//               placeholder="Enter customer number"
//               value={newTestimonial.contact_number}
//               onChange={(e) => handleInputChange('contact_number', e.target.value)}
//             />
//           </Form.Group>

//           <Form.Group controlId="formMessage">
//             <Form.Label>Message</Form.Label>
//             <Form.Control
//               as="textarea"
//               required
//               rows={3}
//               placeholder="Enter testimonial message"
//               value={newTestimonial.message}
//               onChange={(e) => handleInputChange('message', e.target.value)}
//             />
//           </Form.Group>

//           <Form.Group controlId="formImage">
//             <Form.Label>Upload Your Image/Video</Form.Label>
//             {/* <Form.Control
//               type="file"
//               accept="image/*"
//               onChange={handleFileChange}
//             /> */}

//             <input
//               type="file"
//               // onChange={handleFileChange}  
//               onChange={(e) => setNewTestimonial({ ...newTestimonial, image: e.target.files[0] })}
//             />

//           </Form.Group>

//           <Button className="reviews-submit-btn" type="submit" disabled={saving}>
//             {saving ? 'Saving...' : 'Submit'}
//           </Button>
//         </Form>
//       </div>
//     </>
//   );
// }

// export default Reviews;



import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Cropper from 'react-easy-crop';
import { CONFIGS } from '../../../config';
import getCroppedImg from './cropImage';
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
  
  // Cropper state
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [imageSrc, setImageSrc] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleInputChange = (name, value) => {
    setNewTestimonial((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropConfirm = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, zoom);
      setNewTestimonial(prev => ({ ...prev, image: croppedImage }));
      setShowCropper(false);
    } catch (error) {
      console.error('Error cropping image:', error);
      toast.error('Failed to crop image');
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
          verify: false,
          contact_number: '',
        });
        setImageSrc(null);
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

          <Form.Group controlId="formCustName">
            <Form.Label>Customer Number</Form.Label>
            <Form.Control
              type="number"
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

          {showCropper && (
            <>
            <div className="cropper-container" style={{ height: 400, position: 'relative' }}>
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                />
            </div>
              <Button 
                onClick={handleCropConfirm}
                style={{ marginTop: '10px' }}
                >
                Confirm Crop
              </Button>
                </>
          )}


        {showCropper?null:

          <Button className="reviews-submit-btn" type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Submit'}
          </Button>
        
}
        </Form>
      </div>
    </>
  );
}

export default Reviews;