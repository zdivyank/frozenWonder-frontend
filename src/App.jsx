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
import AdminSidebar from './components/admin/AdminSidebar';

function App() {
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

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  return (
    <Router>
      <div className="app-container">
        {isLoggedIn && <AdminSidebar />}
        <div className={`main-content ${isLoggedIn ? 'admin-page' : ''}`}>
          {!isLoggedIn && (
            <nav className={`navbar ${showNav ? 'visible' : 'hidden'} ${isNavOpen ? 'open' : ''}`}>
              <div className="navbar-header">
                <button className="navbar-toggle" onClick={toggleNav}>
                  {isNavOpen ? <FaTimes /> : <FaBars />}
                </button>
              </div>
              <ul className={`navbar-links ${isNavOpen ? 'open' : ''} stroke`}>
                <img src="/img/logo.png" className='navbar-logo' alt="" />
                <div className="space">
                  <li><a href="/#home" onClick={() => setIsNavOpen(false)}>Home</a></li>
                  <li><a href="/#about" onClick={() => setIsNavOpen(false)}>About Us</a></li>
                  <li><a href="/#products" onClick={() => setIsNavOpen(false)}>Products</a></li>
                  <li><a href="/admin" onClick={() => setIsNavOpen(false)}>Login</a></li>
                </div>
              </ul>
            </nav>
          )}

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