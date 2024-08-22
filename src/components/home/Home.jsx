import React, { useRef } from 'react';
import { motion, useTransform, useViewportScroll } from 'framer-motion';
import './home.css';

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


  // Define the scale and opacity transforms based on scroll position
  const scale = useTransform(scrollYProgress, [0, 1, 1], [0.9, 2, 1.7]);
  const opacity = useTransform(scrollYProgress, [0, 1, 0], [1, 1, 0]);

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
        <div className="left_container">
          {/* <motion.img
            src="/img/logo.png"
            className="logo text-center"
            alt=""
            variants={itemVariants}
          /> */}
          <motion.p variants={itemVariants}>
            Discover the future of frozen delights with Frozen Wonders, a revolutionary product that brings the freshest, real fruit flavors straight to your freezer. Our innovative process locks in the natural goodness and vibrant taste of fresh fruits, delivering a refreshing and healthy treat every time. Experience the perfect blend of convenience and quality with our range of frozen juices, smoothies, and more. Dive into a world where freshness meets innovation, and every sip is a burst of real fruit flavor.
          </motion.p>
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
