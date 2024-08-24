import React, { useEffect, useState } from 'react'; 
import './testimonials.css'; 
import { CONFIGS } from '../../../config';  

function Testimonials() {   
  const [testimonials, setTestimonials] = useState([]);   

  const fetchTestimonials = async () => {     
    try {       
      const response = await fetch(`${CONFIGS.API_BASE_URL}/gettestimonail`, {         
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

  useEffect(() => {     
    fetchTestimonials();   
  }, []); 
  



  return (     
    <>
      
    <div id='testimonials'>       
      <h1 className='text-center'>Success Stories</h1>           
      <div className='testimonials-container'>         
        {           
          testimonials.length > 0 ? (             
            testimonials.map((testimonial, index) => (               
              <div key={index} className='testimonial-card'>                 
                {testimonial.image && (                  
                  testimonial.image.endsWith('.mp4') ? (                    
                    <video controls autoPlay>                      
                      <source src={testimonial.image} type="video/mp4" />                      
                      Your browser does not support the video tag.                    
                    </video>                  
                  ) : (                    
                    <img src={testimonial.image} alt={`${testimonial.cust_name}'s testimonial`} />                  
                  )                
                )}                 
                <p><strong>Customer Name:</strong> {testimonial.cust_name}</p>                 
                <p><strong>Message:</strong> {testimonial.message}</p>               
              </div>             
            ))         
          ) : (           
            <p>No testimonials available.</p>         
          )       
        }     
      </div>  
    </div>   
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#f4e869" fill-opacity="1" d="M0,64L34.3,80C68.6,96,137,128,206,149.3C274.3,171,343,181,411,165.3C480,149,549,107,617,90.7C685.7,75,754,85,823,117.3C891.4,149,960,203,1029,192C1097.1,181,1166,107,1234,96C1302.9,85,1371,139,1406,165.3L1440,192L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"></path></svg> 
        </>
  ); 
}

export default Testimonials;
