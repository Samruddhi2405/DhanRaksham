import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <footer>
    <div className="container">
      <div className="footer-container">
        <div className="footer-col">
          <h4>FinanceHub</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Our Services</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">Careers</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Get Help</h4>
          <ul>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Customer Support</a></li>
            <li><a href="#">Account Recovery</a></li>
            <li><a href="#">Payment Options</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Financial Tools</h4>
          <ul>
            <li><a href="#">Stock Market</a></li>
            <li><a href="#">Insurance Compare</a></li>
            <li><a href="#">Budget Planner</a></li>
            <li><a href="#">Retirement Calculator</a></li>
            <li><a href="#">Tax Filing</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Contact Us</h4>
          <ul>
            <li><a href="#">info@dhanraksham.com</a></li>
            <li><a href="#">+1 800 555 0123</a></li>
            <li><a href="#">500 Financial Ave, Suite 400</a></li>
            <li><a href="#">New York, NY 10001</a></li>
          </ul>
        </div>
      </div>
      <div className="copyright">
        © 2025 DhanRaksham. All rights reserved.
      </div>
    </div>
  </footer>
  )
}

export default Footer