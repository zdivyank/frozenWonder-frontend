// import React, { useEffect, useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './testimonials.css'; // Your custom CSS file if needed
// import { CONFIGS } from '../../../config';
// import TestimonialCard from './TestimonialCard';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
// import Slider from 'react-slick';

// export default function Testimonials() {
//   const [testimonials, setTestimonials] = useState([]);

//   const fetchTestimonials = async () => {
//     try {
//       const response = await fetch(`${CONFIGS.API_BASE_URL}/getVerifiedtestimonail`, {
//         method: "GET"
//       });
//       const data = await response.json();

//       if (!response.ok) {
//         console.error("No testimonials fetched");
//         return;
//       }

//       setTestimonials(data.message);
//       console.log(data.message);
//     } catch (error) {
//       console.error("Error fetching testimonials:", error);
//     }
//   };

//   useEffect(() => {
//     fetchTestimonials();
//   }, []);

//   const settings = {
//     dots: true, // Show dot indicators at the bottom
//     infinite: true, // Loop through the slides infinitely
//     speed: 1000, // Speed of the transition
//     slidesToShow: 4, // Show 4 reviews at a time
//     slidesToScroll: 1, // Scroll 1 review at a time
//     autoplay: true, // Enable auto-moving of slides
//     autoplaySpeed: 2000, // Time between transitions (in milliseconds)
//     pauseOnHover: true // Pause when hovered
//   };

//   return (
//     <>
//       <div id='testimonials' className="py-5">
//         <div className="container">
//           <h1 className="text-center mb-5">Success Stories</h1>
//           {testimonials.length > 0 ? (
//             <Slider {...settings}>
//               {testimonials.map((testimonial, index) => (
//                 <div key={index} className="p-2"> {/* Add padding for spacing */}
//                   <TestimonialCard
//                     name={testimonial.cust_name}
//                     // role={testimonial.contact_number || "Verified User"}
//                     content={testimonial.message}
//                     avatarSrc={testimonial.image ? testimonial.image : "/img/placeholder.jpg"}
//                   />
//                 </div>
//               ))}
//             </Slider>
//           ) : (
//             <div className="col">
//               <p className="text-center">No testimonials available.</p>
//             </div>
//           )}
//         </div>
//       </div>
//       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
//         <path fill="#f4e869" fillOpacity="1" d="M0,64L34.3,80C68.6,96,137,128,206,149.3C274.3,171,343,181,411,165.3C480,149,549,107,617,90.7C685.7,75,754,85,823,117.3C891.4,149,960,203,1029,192C1097.1,181,1166,107,1234,96C1302.9,85,1371,139,1406,165.3L1440,192L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"></path>
//       </svg>
//     </>
//   );
// }


import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './testimonials.css'; // Your custom CSS file if needed
import { CONFIGS } from '../../../config';
import TestimonialCard from './TestimonialCard';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [settings, setSettings] = useState({}); // State for settings

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/getVerifiedtestimonail`, {
        method: "GET"
      });
      const data = await response.json();

      if (!response.ok) {
        console.error("No testimonials fetched");
        return;
      }

      setTestimonials(data.message);
      console.log(data.message);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    }
  };

  const updateSliderSettings = () => {
    const width = window.innerWidth;
    if (width < 576) {
      setSettings({
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: true
      });
    } else if (width >= 576 && width < 768) {
      setSettings({
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: true
      });
    } else {
      setSettings({
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: true
      });
    }
  };

  useEffect(() => {
    fetchTestimonials();
    updateSliderSettings(); // Set initial settings
    window.addEventListener('resize', updateSliderSettings); // Update settings on resize

    return () => {
      window.removeEventListener('resize', updateSliderSettings); // Clean up the listener
    };
  }, []);

  return (
    <>
      <div id='testimonials' className="py-5">
        <div className="container">
          <h1 className="text-center mb-5">Success Stories</h1>
          {testimonials.length > 0 && settings.slidesToShow ? ( // Check if settings are ready
            <Slider {...settings}>
              {testimonials.map((testimonial, index) => (
                <div key={index} className="p-2"> {/* Add padding for spacing */}
                  <TestimonialCard
                    name={testimonial.cust_name}
                    content={testimonial.message}
                    avatarSrc={testimonial.image ? testimonial.image : "/img/placeholder.jpg"}
                  />
                </div>
              ))}
            </Slider>
          ) : (
            <div className="col">
              <p className="text-center">No testimonials available.</p>
            </div>
          )}
        </div>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="#f4e869" fillOpacity="1" d="M0,64L34.3,80C68.6,96,137,128,206,149.3C274.3,171,343,181,411,165.3C480,149,549,107,617,90.7C685.7,75,754,85,823,117.3C891.4,149,960,203,1029,192C1097.1,181,1166,107,1234,96C1302.9,85,1371,139,1406,165.3L1440,192L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"></path>
      </svg>
    </>
  );
}
