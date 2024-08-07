import React from 'react';
import { motion } from 'framer-motion';
import './home.css';

const containerVariants = {
  hidden: { opacity: 0, scale: 1},
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 2.5,
      when: "beforeChildren",
      staggerChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 90 },
  visible: { opacity: 1, y: 0 }
};

function Home() {
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
          <motion.img
            src="/img/logo.png"
            className="logo text-center"
            alt=""
            variants={itemVariants}
          />
          <motion.p variants={itemVariants}>
            Discover the future of frozen delights with Frozen Wonders, a revolutionary product that brings the freshest, real fruit flavors straight to your freezer. Our innovative process locks in the natural goodness and vibrant taste of fresh fruits, delivering a refreshing and healthy treat every time. Experience the perfect blend of convenience and quality with our range of frozen juices, smoothies, and more. Dive into a world where freshness meets innovation, and every sip is a burst of real fruit flavor.
          </motion.p>
        </div>

        <div className="right_container">
          <motion.img
            src="/img/pack1.jpg"
            alt=""
            className="home_video"
            variants={itemVariants}
          />
        </div>
      </div>
    </motion.section>
  );
}

export default Home;
