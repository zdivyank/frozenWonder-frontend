import React from 'react';
import { motion, useViewportScroll, useTransform } from 'framer-motion';
import './about.css';

const About = () => {
  const { scrollYProgress } = useViewportScroll();
  
  const scale = useTransform(scrollYProgress, [0, 0.8, 1], [0.9, 1.7, 1.9]);
  const opacity = useTransform(scrollYProgress, [0, 1, 0], [1, 1, 0]);

  return (
    <div className="blur-background">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        id="about"
        style={{ scale, opacity }}
      >
{/* 
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#00cba9" fill-opacity="1" d="M0,160L34.3,181.3C68.6,203,137,245,206,234.7C274.3,224,343,160,411,122.7C480,85,549,75,617,74.7C685.7,75,754,85,823,96C891.4,107,960,117,1029,133.3C1097.1,149,1166,171,1234,154.7C1302.9,139,1371,85,1406,58.7L1440,32L1440,0L1405.7,0C1371.4,0,1303,0,1234,0C1165.7,0,1097,0,1029,0C960,0,891,0,823,0C754.3,0,686,0,617,0C548.6,0,480,0,411,0C342.9,0,274,0,206,0C137.1,0,69,0,34,0L0,0Z"></path></svg> */}

{/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#F4E869" fill-opacity="1" d="M0,32L40,48C80,64,160,96,240,133.3C320,171,400,213,480,197.3C560,181,640,107,720,80C800,53,880,75,960,96C1040,117,1120,139,1200,133.3C1280,128,1360,96,1400,80L1440,64L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path></svg> */}


{/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#F4E869" fill-opacity="1" d="M0,32L40,48C80,64,160,96,240,133.3C320,171,400,213,480,197.3C560,181,640,107,720,80C800,53,880,75,960,96C1040,117,1120,139,1200,133.3C1280,128,1360,96,1400,80L1440,64L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"></path></svg> */}
        <div className="about_content">
          <div className="about_box">
            <h1 className='text-center'>Our Philosophy</h1>
            <p>
            “Frozen Wonders” where innovation meets nature’s finest flavors. Our journey began with a simple idea: to bring the freshest, real fruit flavors straight to your freezer. We are passionate about creating frozen delights that not only taste amazing but also retain the natural goodness of fresh fruits. Our state-of-the-art process ensures that every product we offer is a perfect blend of convenience, quality, and health. From frozen juices to smoothies, we are committed to delivering a refreshing and healthy treat in every ship.
             </p>
          </div>
          <div className="about_box">
            <h1 className='text-center'>Our Mission</h1>
            <p>
            At Frozen Wonders, our mission is to revolutionize the way you enjoy frozen treats. We strive to provide products that are not only delicious but also nutritious, making healthy eating easy and enjoyable. Our commitment to quality and innovation drives us to continuously improve our processes and products. We believe in sustainability and work towards minimizing our environmental footprint. Join us on our journey to bring the best of nature to your freezer, one frozen wonder at a time.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default About;
