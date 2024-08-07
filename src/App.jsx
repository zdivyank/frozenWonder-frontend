import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './components/home/Home';
import About from './components/about/About';
import Product from './components/product/Product';
import './App.css';
import Admin from './components/admin/login/Admin';
import { useAuth } from './store/Auth';
import Logout from './components/logout/Logout';
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
import AdminSidebar from './components/admin/AdminSidebar';
import { Link as ScrollLink, Element } from 'react-scroll';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { isLoggedIn } = useAuth();
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

  useEffect(() => {
    if (isNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isNavOpen]);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  const NavBar = () => {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
      <nav className={`navbar ${isNavOpen ? 'open' : ''}`}>
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <img src="/img/logo.png" alt="Logo" />
          </Link>
          <div className="menu-icon" onClick={toggleNav}>
            {isNavOpen ? <FaTimes /> : <FaBars />}
          </div>
          <ul className={`nav-menu ${isNavOpen ? 'active' : ''}`}>
            {!isAdminRoute && (
              <>
                <li className="nav-item">
                  <ScrollLink to="home" smooth={true} duration={500} className="nav-link" onClick={() => setIsNavOpen(false)}>Home</ScrollLink>
                </li>
                <li className="nav-item">
                  <ScrollLink to="about" smooth={true} duration={500} className="nav-link" onClick={() => setIsNavOpen(false)}>About Us</ScrollLink>
                </li>
                <li className="nav-item">
                  <ScrollLink to="products" smooth={true} duration={500} className="nav-link" onClick={() => setIsNavOpen(false)}>Products</ScrollLink>
                </li>
              </>
            )}
            {/* <li className="nav-item">
              {isLoggedIn ? (
                <Link to="/logout" className="nav-link" onClick={() => setIsNavOpen(false)}>Logout</Link>
              ) : (
                <Link to="/admin" className="nav-link" onClick={() => setIsNavOpen(false)}>Login</Link>
              )}
            </li> */}
          </ul>
        </div>
      </nav>
    );
  };

  return (
    <Router>
      <div className="app-container">
      <AnimatePresence>
        {isLoggedIn && <AdminSidebar />}
        <div className={`main-content ${isLoggedIn ? 'admin-page' : ''}`}>
          <NavBar />

          <Routes>
            <Route path="/" element={
              <>
                <Element name="home">
                  <Home />
                </Element>
                <Element name="about">
                  <About />
                </Element>
                <Element name="products">
                  <Product addToCart={addToCart} />
                </Element>
              </>
            } />
            <Route path="/admin" element={<Admin />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/admin/product" element={isLoggedIn ? <Admin_product /> : <Navigate to="/admin" />} />
            <Route path="/admin/order" element={isLoggedIn ? <Admin_order /> : <Navigate to="/admin" />} />
            <Route path="/admin/product/:_id/update" element={isLoggedIn ? <UpdateProduct /> : <Navigate to="/admin" />} />
            <Route path="/admin/addproduct" element={isLoggedIn ? <AddProduct /> : <Navigate to="/admin" />} />
            <Route path="/admin/location" element={isLoggedIn ? <Location_filter /> : <Navigate to="/admin" />} />
            <Route path="*" element={<Navigate to={isLoggedIn ? "/admin/product" : "/"} />} />
          </Routes>
          {!isLoggedIn && (
            <div className="cart-container">
              <div className="cart_icon" onClick={toggleCart}>
                <HiMiniShoppingCart size={42} className='cart_bottom' />
                <span className="cart-count">{cartItems.reduce((total, item) => total + item.quantity, 0)}</span>
              </div>
              {showCart && (
                <div className="cart-popup">
                  <Cart cartItems={cartItems} setCartItems={setCartItems} />
                </div>
              )}
            </div>
          )}
        </div>
      </AnimatePresence>
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