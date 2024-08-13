import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, Link } from 'react-router-dom';
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
import Testimonials from './components/testimonials/Testimonials';
import Admin_order from './components/admin/order/Admin_order';
import Location_filter from './components/admin/location/Location_filter';
import AdminSidebar from './components/admin/AdminSidebar';
import AgencySidebar from './components/admin/AgencySidebar';
import DeliveryPersonSidebar from './components/admin/DeliveryPersonSidebar';
import { Element } from 'react-scroll';
import { AnimatePresence } from 'framer-motion';
import AdminTestimonials from './components/admin/tesimonails/AdminTesimonails';
import Admin_user from './components/admin/user/Admin_user';
import BlockDate from './components/admin/blockdate/BlockDate';
import Admin_agency from './components/admin/user/Admin_agency';
import Agency_orders from './components/agency/orders/Agency_order';
import Agency_location from './components/agency/orders/Agency_location';
import DeliveryPerson_orders from './components/delivery/DeliveryPerson_orders';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link as ScrollLink } from 'react-scroll';

function AppContent() {
  const { isLoggedIn, role, isLoading } = useAuth();
  const location = useLocation();
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    if (isLoggedIn && role) {
      if (location.pathname === '/admin') {
        switch (role) {
          case 'owner':
            window.location.href = '/admin/product';
            break;
          case 'agency':
            window.location.href = '/agency/orders';
            break;
          case 'delivery_person':
            window.location.href = '/delivery/orders';
            break;
          default:
            window.location.href = '/';
        }
      }
    }
  }, [isLoggedIn, role, location.pathname]);

  const renderSidebar = () => {
    switch (role) {
      case 'owner':
        return <AdminSidebar />;
      case 'agency':
        return <AgencySidebar />;
      case 'delivery_person':
        return <DeliveryPersonSidebar />;
      default:
        return null;
    }
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const NavBar = () => {
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
                  <ScrollLink to="products" smooth={true} duration={500} className="nav-link" onClick={() => setIsNavOpen(false)}>Products</ScrollLink>
                </li>
                <li className="nav-item">
                  <ScrollLink to="about" smooth={true} duration={500} className="nav-link" onClick={() => setIsNavOpen(false)}>Our Philosophy</ScrollLink>
                </li>
                <li className="nav-item">
                  <ScrollLink to="testimonials" smooth={true} duration={500} className="nav-link" onClick={() => setIsNavOpen(false)}>Success Stories</ScrollLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app-container">
      <AnimatePresence>
        {isLoggedIn ? renderSidebar() : <NavBar />}
        <div className={`main-content ${isLoggedIn ? 'logged-in-page' : ''}`}>
          <Routes>
            <Route path="/" element={
              <>
                <Element name="home"><Home /></Element>
                <Element name="about"><About /></Element>
                <Element name="products"><Product /></Element>
                <Element name="testimonials"><Testimonials /></Element>
              </>
            } />
            <Route path="/admin" element={!isLoggedIn ? <Admin /> : <Navigate to={`/${role === 'owner' ? 'admin/product' : role === 'agency' ? 'agency/orders' : 'delivery/orders'}`} replace />} />
            <Route path="/logout" element={<Logout />} />

            {/* Admin Routes */}
            <Route path="/admin/product" element={isLoggedIn && role === 'owner' ? <Admin_product /> : <Navigate to="/admin" replace />} />
            <Route path="/admin/order" element={isLoggedIn && role === 'owner' ? <Admin_order /> : <Navigate to="/admin" replace />} />
            <Route path="/admin/product/:_id/update" element={isLoggedIn && role === 'owner' ? <UpdateProduct /> : <Navigate to="/admin" replace />} />
            <Route path="/admin/addproduct" element={isLoggedIn && role === 'owner' ? <AddProduct /> : <Navigate to="/admin" replace />} />
            <Route path="/admin/location" element={isLoggedIn && role === 'owner' ? <Location_filter /> : <Navigate to="/admin" replace />} />
            <Route path="/admin/testimonail" element={isLoggedIn && role === 'owner' ? <AdminTestimonials /> : <Navigate to="/admin" replace />} />
            <Route path="/admin/user" element={isLoggedIn && role === 'owner' ? <Admin_user /> : <Navigate to="/admin" replace />} />
            <Route path="/admin/agency" element={isLoggedIn && role === 'owner' ? <Admin_agency /> : <Navigate to="/admin" replace />} />
            <Route path="/admin/date" element={isLoggedIn && role === 'owner' ? <BlockDate /> : <Navigate to="/admin" replace />} />

            {/* Agency Routes */}
            <Route path="/agency/orders" element={isLoggedIn && role === 'agency' ? <Agency_orders /> : <Navigate to="/admin" replace />} />
            <Route path="/agency/location" element={isLoggedIn && role === 'agency' ? <Agency_location /> : <Navigate to="/admin" replace />} />

            {/* Delivery Person Routes */}
            <Route path="/delivery/orders" element={isLoggedIn && role === 'delivery_person' ? <DeliveryPerson_orders /> : <Navigate to="/admin" replace />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AnimatePresence>
      <ToastContainer position="top-center" autoClose={10000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;