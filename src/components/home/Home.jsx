import React, { useRef } from 'react';
import { motion, useTransform, useViewportScroll } from 'framer-motion';
import './home.css';
import { FiGift } from 'react-icons/fi';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ScrollLink } from 'react-scroll';

const containerVariants = {
  hidden: { opacity: 0, scale: 1 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 2.5,
      when: "beforeChildren",
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 90 },
  visible: { opacity: 1, y: 0 },
};



function Home() {
  const { scrollYProgress } = useViewportScroll();
  const constraintsRef = useRef(null)
  const navigate = useNavigate();


  // Define the scale and opacity transforms based on scroll position
  const scale = useTransform(scrollYProgress, [0, 1, 1], [0.9, 2, 1.7]);
  const opacity = useTransform(scrollYProgress, [0, 1, 0], [1, 1, 0]);

  const handleClick = () => {
    // console.log("clciked");

    // Navigate to the home page if not already there
    navigate('/');

    // Scroll to the products section
    setTimeout(() => {
      const productsSection = document.getElementById('products');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    // console.log("clciked2");
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={containerVariants}
      id="home"
      className="home-section"
    >
      <div className="home_container">
        <div className="left_container text-center">
          {/* <motion.img
            src="/img/logo.png"
            className="logo text-center"
            alt=""
            variants={itemVariants}
          /> */}
          <motion.div variants={itemVariants}>
          {/* DELIGHTS WITH FROZEN WONDERS, A REVOLUTIONARY PRODUCT THAT BRINGS THE FRESHEST, REAL FRUIT FLAVORS STRAIGHT TO YOUR FREEZER. OUR INNOVATIVE PROCESS LOCKS IN THE NATURAL GOODNESS AND VIBRANT TASTE OF FRESH FRUITS, DELIVERING A REFRESHING AND HEALTHY TREAT EVERY TIME.  */}

          <img src="/img/claim2.png" className='claim text-center' alt="" />
          
           {/* <button
              onClick={handleClick}
              className='btn btn-dark  giftbtn'
              style={{
                display: 'inline-block',
                // marginTop: '2rem',
                fontWeight: 'bold',
                padding: '1.5rem 0.50rem', 
                fontSize: '2rem',
                width: '70%', 
                
              }}
            >
         <FiGift className='mb-1' />    Click Here <FiGift className='mb-1' />
            </button> */}

          </motion.div>
        </div>

        <div className="right_container">
          <motion.img
            src="/img/gif1.gif"
            alt=""
            className="home_video"
            variants={itemVariants}
          />
        </div>
        {/* <img src="/img/vector.svg" height={650} alt="" /> */}
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#F4E869" fill-opacity="1" d="M0,32L80,74.7C160,117,320,203,480,208C640,213,800,139,960,90.7C1120,43,1280,21,1360,10.7L1440,0L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path></svg>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7 }}
        className="animate_text"
        style={{ scale, opacity }}
        ref={constraintsRef}
        variants={containerVariants}
      >
        <motion.h1 drag dragConstraints={constraintsRef} className='moving_text m-3'> Frozen Wonders</motion.h1>
        {/* <motion.h1 drag dragConstraints={constraintsRef} className='moving_text m-3'> Frozen Wonders</motion.h1> */}
        {/* <motion.h1 drag dragConstraints={constraintsRef} className='moving_text m-3'> Frozen Wonders</motion.h1> */}
        {/* <h1 className='moving_text'>Hello From Frozen Wonders</h1> */}

      </motion.div>
      {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#f4e869" fill-opacity="1" d="M0,192L34.3,192C68.6,192,137,192,206,170.7C274.3,149,343,107,411,112C480,117,549,171,617,165.3C685.7,160,754,96,823,85.3C891.4,75,960,117,1029,133.3C1097.1,149,1166,139,1234,117.3C1302.9,96,1371,64,1406,48L1440,32L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z" className='svg-1'></path></svg> */}
    </motion.section>
  );
}

export default Home;
