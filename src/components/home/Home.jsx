import React from 'react'
import './home.css'

function Home() {
  return (
    <section id="home">

   <div className="home_container">
    <div className="left_container">
      {/* <h1>Welcome  to  </h1> */}
      <img src="/img/logo.png" className='logo text-center' alt="" />
      
          <p>
         
          Discover the future of frozen delights with Frozen Wonders, a revolutionary product that brings the freshest, real fruit flavors straight to your freezer. Our innovative process locks in the natural goodness and vibrant taste of fresh fruits, delivering a refreshing and healthy treat every time. Experience the perfect blend of convenience and quality with our range of frozen juices, smoothies, and more. Dive into a world where freshness meets innovation, and every sip is a burst of real fruit flavor.
          </p>
    </div>

    <div className="right_container">
     
    {/* <video width="900" loop autoPlay="autoPlay" >
      <source src="../../../img/vid.mp4" type="video/mp4"/>
</video> */}

<img src="/img/pack1.jpg" alt="" className='home_video'/>
    </div>
   </div>

   {/* <img src="/img/lower1.svg" alt="" /> */}
</section>
  )
}

export default Home