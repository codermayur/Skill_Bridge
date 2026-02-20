import { Link, useEffect, useState } from "react-router-dom";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Footer Top Section */}
        <div className="footer-top">
          <div className="footer-section">
            <h3 className="footer-title">
              <span className="logo-icon">🚀</span> Skill Bridge
            </h3>
            <p className="footer-description">
              Master programming languages and ace your technical interviews with our comprehensive learning platform.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon" title="Facebook">
                <span>f</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon" title="Twitter">
                <span>𝕏</span>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon" title="LinkedIn">
                <span>in</span>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon" title="GitHub">
                <span>gh</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/practice">Practice</Link>
              </li>
              <li>
                <a href="#leaderboard">Leaderboard</a>
              </li>
              <li>
                <a href="#blog">Blog</a>
              </li>
            </ul>
          </div>

          {/* Languages */}
          <div className="footer-section">
            <h4 className="footer-heading">Languages</h4>
            <ul className="footer-links">
              <li>
                <a href="#javascript">JavaScript</a>
              </li>
              <li>
                <a href="#python">Python</a>
              </li>
              <li>
                <a href="#java">Java</a>
              </li>
              <li>
                <a href="#cpp">C++</a>
              </li>
              <li>
                <a href="#react">React</a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-section">
            <h4 className="footer-heading">Resources</h4>
            <ul className="footer-links">
              <li>
                <a href="#documentation">Documentation</a>
              </li>
              <li>
                <a href="#faq">FAQ</a>
              </li>
              <li>
                <a href="#community">Community</a>
              </li>
              <li>
                <a href="#support">Support</a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer-section">
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              <li>
                <a href="#about">About Us</a>
              </li>
              <li>
                <a href="#careers">Careers</a>
              </li>
              <li>
                <a href="#privacy">Privacy Policy</a>
              </li>
              <li>
                <a href="#terms">Terms of Service</a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-section newsletter-section">
            <h4 className="footer-heading">Subscribe</h4>
            <p className="newsletter-desc">
              Get weekly tips and updates on new courses
            </p>
            <form className="newsletter-form" onSubmit={(e) => {
              e.preventDefault();
              alert("Thanks for subscribing!");
            }}>
              <input
                type="email"
                placeholder="your@email.com"
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-btn">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider"></div>

        {/* Footer Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              © {currentYear} Skill Bridge. All rights reserved. | Built with{" "}
              <span className="heart">❤️</span> for learners worldwide.
            </p>
            <div className="footer-bottom-links">
              <a href="#privacy">Privacy</a>
              <span className="separator">•</span>
              <a href="#terms">Terms</a>
              <span className="separator">•</span>
              <a href="#cookies">Cookies</a>
              <span className="separator">•</span>
              <a href="#contact">Contact</a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        className={`scroll-to-top ${showScrollTop ? "show" : ""}`}
        onClick={scrollToTop}
        title="Scroll to top"
        aria-label="Scroll to top"
      >
        ↑
      </button>
    </footer>
  );
}

export default Footer;
