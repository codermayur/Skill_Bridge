import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "./services/api";
import "./auth/Auth.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("email");
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.login(formData.email, formData.password);

      // Store token and user data
      localStorage.setItem("userToken", response.token);
      localStorage.setItem("userData", JSON.stringify(response.user));

      // Show success message
      alert("✓ Login successful! Welcome back!");
      navigate("/profile");
    } catch (error) {
      setErrors({ submit: error.message || "Login failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Animated Background */}
      <div className="auth-bg-animation">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <div className="auth-content">
        {/* Left Side - Illustration */}
        <div className="auth-left">
          <div className="auth-illustration">
            <div className="illustration-content">
              <div className="illustration-circle large"></div>
              <div className="illustration-circle medium"></div>
              <div className="illustration-circle small"></div>
              <div className="illustration-icon">🔐</div>
            </div>
          </div>
          <div className="auth-left-text">
            <h2>Welcome Back!</h2>
            <p>Log in to continue your coding journey and compete with developers worldwide</p>
            <div className="features-list">
              <div className="feature">
                <span className="feature-icon">✓</span>
                <span>Track your progress</span>
              </div>
              <div className="feature">
                <span className="feature-icon">✓</span>
                <span>Compete on leaderboard</span>
              </div>
              <div className="feature">
                <span className="feature-icon">✓</span>
                <span>Unlock achievements</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-right">
          <div className="form-container">
            {/* Header */}
            <div className="auth-header">
              <div className="header-icon">
                <span>🚀</span>
              </div>
              <h1>Skill Bridge</h1>
              <p>Sign in to your account</p>
            </div>

            {/* Tabs */}
            <div className="auth-tabs">
              <button
                className={`tab-btn ${activeTab === "email" ? "active" : ""}`}
                onClick={() => setActiveTab("email")}
              >
                <span>📧</span> Email
              </button>
              <button
                className={`tab-btn ${activeTab === "phone" ? "active" : ""}`}
                onClick={() => setActiveTab("phone")}
                disabled
              >
                <span>📱</span> Phone
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="auth-form">
              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={errors.email ? "input-error" : ""}
                    autoComplete="email"
                  />
                  <span className="input-icon">📧</span>
                </div>
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <div className="label-row">
                  <label htmlFor="password">Password</label>
                  <Link to="/forgot-password" className="forgot-link">
                    Forgot?
                  </Link>
                </div>
                <div className="input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={errors.password ? "input-error" : ""}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="input-icon-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>

              {/* Remember Me */}
              <div className="checkbox-group">
                <input
                  id="rememberMe"
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <label htmlFor="rememberMe">Remember me for 30 days</label>
              </div>

              {/* Error Alert */}
              {errors.submit && (
                <div className="error-alert">
                  <span className="alert-icon">⚠️</span>
                  {errors.submit}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="submit-btn"
                disabled={isLoading}
              >
                <span className="btn-text">
                  {isLoading ? "Signing in..." : "Sign In"}
                </span>
                {isLoading && <span className="loader"></span>}
              </button>
            </form>

            {/* Divider */}
            <div className="form-divider">
              <span>Or continue with</span>
            </div>

            {/* Social Login */}
            <div className="social-login">
              <button className="social-btn google">
                <span>🔍</span>
              </button>
              <button className="social-btn github">
                <span>🐙</span>
              </button>
              <button className="social-btn linkedin">
                <span>💼</span>
              </button>
            </div>

            {/* Footer */}
            <div className="auth-footer">
              <p>
                Don't have an account?{" "}
                <Link to="/signup" className="link">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
