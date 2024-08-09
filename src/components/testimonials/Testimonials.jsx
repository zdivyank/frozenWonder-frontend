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
  ); 
}

export default Testimonials;
