import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "./services/api";
import "./auth/Auth.css";

function ForgotPassword() {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
    setSuccess(false);

    try {
      await authAPI.forgotPassword(formData.email);
      setSuccess(true);
    } catch (error) {
      setErrors({ submit: error.message || "Failed to send reset email. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-bg-animation">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <div className="auth-content">
        <div className="auth-left">
          <div className="auth-illustration">
            <div className="illustration-content">
              <div className="illustration-circle large"></div>
              <div className="illustration-circle medium"></div>
              <div className="illustration-circle small"></div>
              <div className="illustration-icon">🔑</div>
            </div>
          </div>
          <div className="auth-left-text">
            <h2>Forgot Password?</h2>
            <p>No worries! Enter your email address and we'll send you a link to reset your password.</p>
          </div>
        </div>

        <div className="auth-right">
          <div className="form-container">
            <div className="auth-header">
              <div className="header-icon">
                <span>🔐</span>
              </div>
              <h1>Reset Password</h1>
              <p>Enter your email to receive reset instructions</p>
            </div>

            {success ? (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <h3>Email Sent!</h3>
                <p>If an account exists with this email, a password reset link has been sent. Please check your inbox.</p>
                <Link to="/login" className="link">
                  Back to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="auth-form">
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

                {errors.submit && (
                  <div className="error-alert">
                    <span className="alert-icon">⚠️</span>
                    {errors.submit}
                  </div>
                )}

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isLoading}
                >
                  <span className="btn-text">
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </span>
                  {isLoading && <span className="loader"></span>}
                </button>
              </form>
            )}

            <div className="auth-footer">
              <p>
                Remember your password?{" "}
                <Link to="/login" className="link">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
