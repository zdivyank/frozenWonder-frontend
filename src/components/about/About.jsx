import React from 'react';
import { motion, useViewportScroll, useTransform } from 'framer-motion';
import './about.css';

const About = () => {
  const { scrollYProgress } = useViewportScroll();
  
  // Define the scale and opacity transforms based on scroll position
  const scale = useTransform(scrollYProgress, [0, 0.8, 1], [0.9, 1.7, 1.9]);
  const opacity = useTransform(scrollYProgress, [0, 1, 0], [1, 1, 0]);

  return (
    
    <div className="blur-background">
        <div className="about_content">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          id="about"
          style={{ scale, opacity }}
        >
          <section className="about_container" id='about'>
            <h1 className='text-center'>Our Philosophy</h1>
            <p>
              “Frozen Wonders” where innovation meets nature’s finest flavors. Our journey began with a simple idea: to bring the freshest, real fruit flavors straight to your freezer. We are passionate about creating frozen delights that not only taste amazing but also retain the natural goodness of fresh fruits. Our state-of-the-art process ensures that every product we offer is a perfect blend of convenience, quality, and health. From frozen juices to smoothies, we are committed to delivering a refreshing and healthy treat in every ship.
            </p>

            <hr />

            <h1 className='text-center'>Our Mission</h1>
            <p>
              At Frozen Wonders, our mission is to revolutionize the way you enjoy frozen treats. We strive to provide products that are not only delicious but also nutritious, making healthy eating easy and enjoyable. Our commitment to quality and innovation drives us to continuously improve our processes and products. We believe in sustainability and work towards minimizing our environmental footprint. Join us on our journey to bring the best of nature to your freezer, one frozen wonder at a time.
            </p>
          </section>
    </motion.div>
        </div>
      </div>
  );
}

export default About;
