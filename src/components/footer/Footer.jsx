import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            {/* Left section */}
            <div className="footer-left">
              <img src="/img/logo.png" className="footer-logo" height={150} alt="Company Logo" />
              <p className="footer-company-profile">
                Fresh, Fruity, and Flavorful thickshakes for a Healthier You!
              </p>
            </div>

            {/* Middle section */}
            <div className="footer-middle">
              <div className="footer-links">
                <div className="footer-links-column">
                  <h3 className="footer-links-title">Useful Links</h3>
                  <ul className="footer-links-list">
                    <li className="footer-links-item"><a href="#about">About Us</a></li>
                    <li className="footer-links-item"><a href="#products">Products</a></li>
                    {/* <li className="footer-links-item"><a href="#inquiries">Contact</a></li> */}
                    <li className="footer-links-item"><a href="/inquiries">Trade Inquiries</a></li>
                    <li className="footer-links-item"><a href="/review">Reviewes</a></li>
                  </ul>
                </div>
                <div className="footer-links-column">
                  <h3 className="footer-links-title">Policies</h3>
                  <ul className="footer-links-list">
                    <li className="footer-links-item"><a href="/privacy">Privacy Policy</a></li>
                    <li className="footer-links-item"><a href="/terms" target="_blank" >Terms & Condition</a></li>
                    <li className="footer-links-item"><a href="/faq">FAQ</a></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right section */}
            <div className="footer-right">
              <h3 className="footer-links-title">Contact Us</h3>
              <address className="footer-address">
                C1B-145/146 Icchapore GIDC,<br />
                Near ONGC, Bhatpore,<br />
                Surat, Gujarat-394510<br />
              </address>
              <div className="footer-contact">
                Email: info@frozenwonders.in
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div className="footer-copyright">
        <p>&copy; {new Date().getFullYear()} Digital Creatorz. All rights reserved.</p>
        <p>Made with ❤️ in India</p>
      </div>
    </>
  );
};

export default Footer;