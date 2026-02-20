import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("userToken"); // Check if user is logged in

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    setIsDropdownOpen(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        Skill Bridge <span className="rocket-icon">🚀</span>
      </Link>

      <div className="navbar-menu">
        <Link to="/" className="navbar-link">
          Home
        </Link>

        <div className="navbar-actions">
          {isLoggedIn ? (
            <div className="profile-dropdown">
              <button
                className="profile-btn"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                title="Profile"
              >
                👤
              </button>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">
                    My Profile
                  </Link>
                  <Link to="/practice" className="dropdown-item">
                    Practice
                  </Link>
                  <Link to="/stats" className="dropdown-item">
                    Statistics
                  </Link>
                  <hr className="dropdown-divider" />
                  <button onClick={handleLogout} className="dropdown-item logout-btn">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="navbar-login">
                Login
              </Link>

            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
