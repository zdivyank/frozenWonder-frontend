// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Home from './components/home/Home';
// import About from './components/about/About';
// import Product from './components/product/Product';
// import './App.css';
// import Admin from './components/admin/login/Admin';
// import { useAuth } from './store/Auth';
// import { Logout } from './components/logout/Logout';
// import 'rsuite/dist/rsuite.min.css';
// import Admin_product from './components/admin/product/Admin_product';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import AddProduct from './components/admin/product/AddProduct';
// import UpdateProduct from './components/admin/product/UpdateProduct';
// import Cart from './components/cart/Cart';
// import { BsCart2 } from 'react-icons/bs';
// import { FaBars, FaTimes } from 'react-icons/fa';
// import Admin_order from './components/admin/order/Admin_order';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Offcanvas } from 'react-bootstrap';

// function App() {
//   const [showNav, setShowNav] = useState(true);
//   const [lastScrollY, setLastScrollY] = useState(0);
//   const { isLoggedIn } = useAuth();

//   const [cart, setCart] = useState(() => {
//     const savedCart = localStorage.getItem('cart');
//     return savedCart ? JSON.parse(savedCart) : [];
//   });
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [isNavOpen, setIsNavOpen] = useState(false);

//   const [cartItems, setCartItems] = useState([]);
//   const [showCart, setShowCart] = useState(false);

//   useEffect(() => {
//     const storedCart = localStorage.getItem('cart');
//     if (storedCart) {
//       setCartItems(JSON.parse(storedCart));
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('cart', JSON.stringify(cartItems));
//   }, [cartItems]);

//   const addToCart = (product, pack) => {
//     setCartItems(prevItems => {
//       const existingItemIndex = prevItems.findIndex(
//         item => item.product._id === product._id && item.packIndex === product.packs.indexOf(pack)
//       );

//       if (existingItemIndex !== -1) {
//         const updatedItems = [...prevItems];
//         updatedItems[existingItemIndex].quantity += 1;
//         return updatedItems;
//       } else {
//         return [...prevItems, { product, packIndex: product.packs.indexOf(pack), quantity: 1 }];
//       }
//     });
//     setShowCart(true);
//   };

//   const handleCloseCart = () => setShowCart(false);

//   const controlNavbar = () => {
//     if (window.scrollY > lastScrollY) {
//       setShowNav(false);
//     } else {
//       setShowNav(true);
//     }
//     setLastScrollY(window.scrollY);
//   };

//   useEffect(() => {
//     window.addEventListener('scroll', controlNavbar);
//     return () => {
//       window.removeEventListener('scroll', controlNavbar);
//     };
//   }, [lastScrollY]);

//   // useEffect(() => {
//   //   localStorage.setItem('cart', JSON.stringify(cart));
//   // }, [cart]);

//   useEffect(() => {
//     if (isNavOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'auto';
//     }
//   }, [isNavOpen]);

//   // const addToCart = (product, selectedPack) => {
//   //   setCart((prevCart) => {
//   //     const existingProductIndex = prevCart.findIndex(
//   //       item => item._id === product._id && item.selectedPack.ml === selectedPack.ml
//   //     );

//   //     if (existingProductIndex !== -1) {
//   //       const updatedCart = [...prevCart];
//   //       updatedCart[existingProductIndex].quantity += 1;
//   //       return updatedCart;
//   //     } else {
//   //       return [...prevCart, { ...product, selectedPack, quantity: 1 }];
//   //     }
//   //   });
//   //   setIsCartOpen(true);
//   // };

//   // const updateQuantity = (productId, packMl, change) => {
//   //   setCart((prevCart) => {
//   //     return prevCart.map(item => {
//   //       if (item._id === productId && item.selectedPack.ml === packMl) {
//   //         const newQuantity = item.quantity + change;
//   //         return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
//   //       }
//   //       return item;
//   //     }).filter(Boolean);
//   //   });
//   // };


//   return (
//     <Router>
//       <div className="App">
//         <nav className={`navbar ${showNav ? 'visible' : 'hidden'}`}>
//           <div className="navbar-header">
//             {isNavOpen ? (
//               <FaTimes className="hamburger-icon" onClick={() => setIsNavOpen(!isNavOpen)} />
//             ) : (
//               <FaBars className="hamburger-icon" onClick={() => setIsNavOpen(!isNavOpen)} />
//             )}
//           </div>
//           <ul className={`navbar-links ${isNavOpen ? 'open' : ''}`}>
//             {!isLoggedIn ? (
//               <>
//                 <li><a href="/#home" onClick={() => setIsNavOpen(false)}>Home</a></li>
//                 <li><a href="/#about" onClick={() => setIsNavOpen(false)}>About Us</a></li>
//                 <li><a href="/#products" onClick={() => setIsNavOpen(false)}>Products</a></li>
//                 <li><a href="/admin" onClick={() => setIsNavOpen(false)}>Login</a></li>
//                 <li>
//                   <Link onClick={() => setIsCartOpen(true)} className="cart-link">
//                     <BsCart2 />
//                     ({cart.reduce((total, item) => total + item.quantity, 0)})
//                   </Link>
//                 </li>
//               </>
//             ) : null}
//             {isLoggedIn ? (
//               <>
//                 <li><a href="/admin/product" onClick={() => setIsNavOpen(false)}>Products</a></li>
//                 <li><a href="/admin/order" onClick={() => setIsNavOpen(false)}>Order Summary</a></li>
//                 <li><a href="/#products" onClick={() => setIsNavOpen(false)}>Location Filter</a></li>
//                 <li><a href="/logout" onClick={() => setIsNavOpen(false)}>Logout</a></li>
//                 <li><a href="/#products" onClick={() => setIsNavOpen(false)}>Home</a></li>
//               </>
//             ) : null}
//           </ul>
//         </nav>
//         <Routes>
//           <Route path="/" element={
//             <>
//               <Home />
//               <About />
//               {/* <Product addToCart={addToCart} /> */}
//               <Product addToCart={addToCart} />
//               <Offcanvas show={showCart} onHide={handleCloseCart} placement="end">
//                 <Offcanvas.Header closeButton>
//                   <Offcanvas.Title>Cart</Offcanvas.Title>
//                 </Offcanvas.Header>
//                 <Offcanvas.Body>
//                   <Cart cartItems={cartItems} setCartItems={setCartItems} />
//                 </Offcanvas.Body>
//               </Offcanvas>
//             </>
//           } />
//           <Route path="/admin" element={<Admin />} />
//           <Route path="/logout" element={<Logout />} />
//           <Route path="/admin/product" element={<Admin_product />} />
//           <Route path="/admin/order" element={<Admin_order />} />
//           <Route path="/admin/product/:_id/update" element={<UpdateProduct />} />
//           <Route path="/admin/addproduct" element={<AddProduct />} />
//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
//         {/* <Cart
//           cart={cart}
//           updateQuantity={updateQuantity}
//           calculateTotal={calculateTotal}
//           closeCart={() => setIsCartOpen(false)}
//           showCart={isCartOpen}
//         /> */}

//         {/* 
// <Cart /> */}
//       </div>
//       <ToastContainer
//         position="top-center"
//         autoClose={10000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />
//     </Router>
//   );
// }

// export default App;
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './components/home/Home';
import About from './components/about/About';
import Product from './components/product/Product';
import './App.css';
import Admin from './components/admin/login/Admin';
import { useAuth } from './store/Auth';
import { Logout } from './components/logout/Logout';
import 'rsuite/dist/rsuite.min.css';
import Admin_product from './components/admin/product/Admin_product';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddProduct from './components/admin/product/AddProduct';
import UpdateProduct from './components/admin/product/UpdateProduct';
import Cart from './components/cart/Cart';
import { HiMiniShoppingCart } from 'react-icons/hi2';
import { FaBars, FaTimes } from 'react-icons/fa';
import Admin_order from './components/admin/order/Admin_order';
import Location_filter from './components/admin/location/Location_filter';

function App() {
  // const [showNav, setShowNav] = useState(true);
  // const [lastScrollY, setLastScrollY] = useState(0);
  // const { isLoggedIn } = useAuth();
  // const [isNavOpen, setIsNavOpen] = useState(false);
  // const [showCart, setShowCart] = useState(false);

  // const [cartItems, setCartItems] = useState(() => {
  //   const savedCart = localStorage.getItem('cart');
  //   return savedCart ? JSON.parse(savedCart) : [];
  // });

  // useEffect(() => {
  //   localStorage.setItem('cart', JSON.stringify(cartItems));
  // }, [cartItems]);

  // const addToCart = (product, packIndex, quantity) => {
  //   setCartItems(prevItems => {
  //     const existingItemIndex = prevItems.findIndex(
  //       item => item.product._id === product._id && item.packIndex === packIndex
  //     );

  //     if (existingItemIndex !== -1) {
  //       const updatedItems = [...prevItems];
  //       updatedItems[existingItemIndex].quantity += quantity;
  //       return updatedItems;
  //     } else {
  //       return [...prevItems, { product, packIndex, quantity }];
  //     }
  //   });
  // };

  // const controlNavbar = () => {
  //   if (window.scrollY > lastScrollY) {
  //     setShowNav(false);
  //   } else {
  //     setShowNav(true);
  //   }
  //   setLastScrollY(window.scrollY);
  // };

  // useEffect(() => {
  //   window.addEventListener('scroll', controlNavbar);
  //   return () => {
  //     window.removeEventListener('scroll', controlNavbar);
  //   };
  // }, [lastScrollY]);

  // useEffect(() => {
  //   if (isNavOpen) {
  //     document.body.style.overflow = 'hidden';
  //   } else {
  //     document.body.style.overflow = 'auto';
  //   }
  // }, [isNavOpen]);


  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { isLoggedIn } = useAuth();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, packIndex, quantity) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item.product._id === product._id && item.packIndex === packIndex
      );

      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        return [...prevItems, { product, packIndex, quantity }];
      }
    });
  };

  const controlNavbar = () => {
    if (window.scrollY > lastScrollY) {
      setShowNav(false);
    } else {
      setShowNav(true);
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', controlNavbar);
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  useEffect(() => {
    if (isNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isNavOpen]);

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  return (
    <Router>
      <div className="App">
        <nav className={`navbar ${showNav ? 'visible' : 'hidden'}`}>
          <div className="navbar-header">
            {isNavOpen ? (
              <FaTimes className="hamburger-icon" onClick={() => setIsNavOpen(!isNavOpen)} />
            ) : (
              <FaBars className="hamburger-icon" onClick={() => setIsNavOpen(!isNavOpen)} />
            )}
          </div>
          <img src="/img/logo.png" className='' height={80} alt="" />
          <ul className={`navbar-links ${isNavOpen ? 'open' : ''}`}>
            {!isLoggedIn ? (
              <>
                <li><a href="/#home" onClick={() => setIsNavOpen(false)}>Home</a></li>
                <li><a href="/#about" onClick={() => setIsNavOpen(false)}>About Us</a></li>
                <li><a href="/#products" onClick={() => setIsNavOpen(false)}>Products</a></li>
                <li><a href="/admin" onClick={() => setIsNavOpen(false)}>Login</a></li>
              </>
            ) : null}
            {isLoggedIn ? (
              <>
                <li><a href="/admin/product" onClick={() => setIsNavOpen(false)}>Products</a></li>
                <li><a href="/admin/order" onClick={() => setIsNavOpen(false)}>Order Summary</a></li>
                <li><a href="/admin/location" onClick={() => setIsNavOpen(false)}>Location Filter</a></li>
                <li><a href="/logout" onClick={() => setIsNavOpen(false)}>Logout</a></li>
                <li><a href="/#products" onClick={() => setIsNavOpen(false)}>Home</a></li>
              </>
            ) : null}
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={
            <>
              <Home />
              <About />
              <Product addToCart={addToCart} />
            </>
          } />
          <Route path="/admin" element={<Admin />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/admin/product" element={<Admin_product />} />
          <Route path="/admin/order" element={<Admin_order />} />
          <Route path="/admin/product/:_id/update" element={<UpdateProduct />} />
          <Route path="/admin/addproduct" element={<AddProduct />} />
          <Route path="/admin/location" element={<Location_filter />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        
        <div className="cart-container">
          <div className="cart_icon" onClick={toggleCart}>
            <HiMiniShoppingCart size={42} className='cart_bottom' />
            <span className="cart-count">{cartItems.reduce((total, item) => total + item.quantity, 0)}</span>
          </div>
          {showCart && (
            <div className="cart-popup">
              {/* <button className="close-cart" onClick={() => setShowCart(false)}>
                <FaTimes />
              </button> */}
              <Cart cartItems={cartItems} setCartItems={setCartItems} />
            </div>
          )}
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}

export default App;