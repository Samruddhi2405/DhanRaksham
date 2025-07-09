import React from 'react';
import './Home.css'; 
import logo from "../../assets/logo.png";
import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="container">
          <div className="hero-content">
            <h1>Manage Your Finances Like Never Before</h1>
            <p>Take control of your wealth with DhanRaksham. Track investments, get insurance advice, and secure your financial future with ease.</p>
            <button className="btn">Explore Now</button>
          </div>
          <div className="hero-image"></div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services">
        <div className="section-header">
          <h2 className="section-title">Services We Provide</h2>
          <p className="section-subtitle">
            Predict stocks, optimize budgets, secure insurance, and get your questions answered instantly with our intelligent chatbot.
          </p>
        </div>
        <div className="services-grid">
          <Link to="/insurance" className="service-card">
            <div className="service-icon">
              <div style={{ color: '#3e92cc', fontSize: '28px', fontWeight: 'bold' }}>🛡</div>
            </div>
            <h3 className="service-title">Insurance Predictor</h3>
            <p className="service-description">Get AI-powered insurance suggestions tailored to your unique needs</p>
          </Link>

          <Link to="/stock" className="service-card">
            <div className="service-icon">
              <div style={{ color: '#3e92cc', fontSize: '28px', fontWeight: 'bold' }}>📈</div>
            </div>
            <h3 className="service-title">Stock Predictor</h3>
            <p className="service-description">Predict stock trends and make better investment decisions with smart AI insights</p>
          </Link>

          <Link to="/chatbot" className="service-card">
            <div className="service-icon">
              <div style={{ color: '#3e92cc', fontSize: '28px', fontWeight: 'bold' }}>💼</div>
            </div>
            <h3 className="service-title">ChatBot Advisor</h3>
            <p className="service-description">Got questions? Get instant answers 24/7 from our intelligent AI chatbot</p>
          </Link>

          <Link to="/budget" className="service-card">
            <div className="service-icon">
              <div style={{ color: '#3e92cc', fontSize: '28px', fontWeight: 'bold' }}>🔍</div>
            </div>
            <h3 className="service-title">Budget Optimizer</h3>
            <p className="service-description">Take control of your spending. Receive personalized tips to optimize your budget</p>
          </Link>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us">
        <div className="container">
          <h2 className="section-title">Why Choose DhanRaksham?</h2>
          <p className="section-subtitle">
            We’re committed to helping you secure, grow, and optimize your finances with powerful AI tools, expert advice, and unmatched security.
          </p>
          <div className="why-grid">
            <div className="why-card">
              <h3>Secure & Private</h3>
              <p>Your data stays safe with industry-leading security and encryption protocols.</p>
            </div>
            <div className="why-card">
              <h3>AI-Powered Insights</h3>
              <p>Smart predictions and tailored recommendations help you make better decisions.</p>
            </div>
            <div className="why-card">
              <h3>24/7 Chatbot</h3>
              <p>Get instant answers to your finance questions, any time you need.</p>
            </div>
            <div className="why-card">
              <h3>Easy to Use</h3>
              <p>Simple, intuitive tools designed for everyone — no finance degree required!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="call-to-action">
        <h2 className="cta-title">Have questions? Shoot us an email!</h2>
        <p className="cta-description">
          For any inquiries, collaborations, or support, please feel free to contact us. We look forward to connecting with you.
        </p>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="section-header">
          <h2 className="section-title">About Us</h2>
          <p className="section-subtitle">Meet the Minds Behind the Mission to Simplify Finance for Everyone.</p>
        </div>
        <div className="testimonial-cards">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p className="testimonial-text">“Enthusiastic full stack developer skilled at creating seamless user interfaces and efficient backend systems. Focused on delivering user-friendly solutions that make financial tools easy to use and accessible</p>
              <div className="testimonial-author">
                <div className="author-avatar"></div>
                <div className="author-info">
                  <h4>Khushi Kshatriya</h4>
                  <p>FullStack Developer</p>
                </div>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p className="testimonial-text">Passionate full stack developer with a keen eye for design, user experience, and robust backend logic. Dedicated to building intuitive, responsive interfaces that make financial tools simple and accessible</p>
              <div className="testimonial-author">
                <div className="author-avatar"></div>
                <div className="author-info">
                  <h4>Samruddhi Narkhede</h4>
                  <p>FullStack Developer</p>
                </div>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p className="testimonial-text">Passionate frontend developer with a keen eye for design and user experience. Dedicated to building intuitive and responsive interfaces that make financial tools simple and accessible.</p>
              <div className="testimonial-author">
                <div className="author-avatar"></div>
                <div className="author-info">
                  <h4>Prachi Mehetre</h4>
                  <p>Frontend Developer</p>
                </div>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p className="testimonial-text">Passionate frontend developer with a keen eye for design and user experience. Dedicated to building intuitive and responsive interfaces that make financial tools simple and accessible.</p>
              <div className="testimonial-author">
                <div className="author-avatar"></div>
                <div className="author-info">
                  <h4>Divya Bhavsar</h4>
                  <p>Frontend Developer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
