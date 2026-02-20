import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "./services/api";
import "./auth/Auth.css";

function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Calculate password strength
  useEffect(() => {
    const password = formData.password;
    let strength = 0;

    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    setPasswordStrength(strength);
  }, [formData.password]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Name must be at least 3 characters";
    }

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

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms";
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
      const response = await authAPI.signup(
        formData.fullName,
        formData.email,
        formData.password
      );

      // Store token and user data
      localStorage.setItem("userToken", response.token);
      localStorage.setItem("userData", JSON.stringify(response.user));

      alert("✓ Account created successfully! Welcome to Skill Bridge!");
      navigate("/profile");
    } catch (error) {
      setErrors({ submit: error.message || "Sign up failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthLabel = () => {
    const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    return labels[passwordStrength - 1] || "Enter password";
  };

  const getPasswordStrengthColor = () => {
    const colors = ["#f5576c", "#f5576c", "#ffa502", "#00d4ff", "#00ff00"];
    return colors[passwordStrength - 1] || "#ccc";
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
              <div className="illustration-icon">🎓</div>
            </div>
          </div>
          <div className="auth-left-text">
            <h2>Start Your Journey!</h2>
            <p>Join thousands of developers mastering programming and landing their dream jobs</p>
            <div className="stats-grid">
              <div className="stat">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Active Learners</div>
              </div>
              <div className="stat">
                <div className="stat-number">500+</div>
                <div className="stat-label">Problems</div>
              </div>
              <div className="stat">
                <div className="stat-number">12+</div>
                <div className="stat-label">Languages</div>
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
                <span>⭐</span>
              </div>
              <h1>Create Account</h1>
              <p>Start learning and grow with us</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="auth-form">
              {/* Full Name */}
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <div className="input-wrapper">
                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={errors.fullName ? "input-error" : ""}
                    autoComplete="name"
                  />
                  <span className="input-icon">👤</span>
                </div>
                {errors.fullName && (
                  <span className="error-message">{errors.fullName}</span>
                )}
              </div>

              {/* Email */}
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

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={errors.password ? "input-error" : ""}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="input-icon-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="password-strength">
                    <div className="strength-bar-container">
                      <div
                        className="strength-bar"
                        style={{
                          width: `${(passwordStrength / 5) * 100}%`,
                          backgroundColor: getPasswordStrengthColor(),
                        }}
                      ></div>
                    </div>
                    <span
                      className="strength-label"
                      style={{ color: getPasswordStrengthColor() }}
                    >
                      {getPasswordStrengthLabel()}
                    </span>
                  </div>
                )}

                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={errors.confirmPassword ? "input-error" : ""}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="input-icon-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="error-message">{errors.confirmPassword}</span>
                )}
              </div>

              {/* Terms Agreement */}
              <div className="checkbox-group">
                <input
                  id="agreeToTerms"
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                />
                <label htmlFor="agreeToTerms">
                  I agree to the{" "}
                  <a href="#terms" className="link">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#privacy" className="link">
                    Privacy Policy
                  </a>
                </label>
              </div>
              {errors.agreeToTerms && (
                <span className="error-message">{errors.agreeToTerms}</span>
              )}

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
                  {isLoading ? "Creating Account..." : "Create Account"}
                </span>
                {isLoading && <span className="loader"></span>}
              </button>
            </form>

            {/* Divider */}
            <div className="form-divider">
              <span>Or sign up with</span>
            </div>

            {/* Social Signup */}
            <div className="social-login">
              <button className="social-btn google" title="Sign up with Google">
                <span>🔍</span>
              </button>
              <button className="social-btn github" title="Sign up with GitHub">
                <span>🐙</span>
              </button>
              <button className="social-btn linkedin" title="Sign up with LinkedIn">
                <span>💼</span>
              </button>
            </div>

            {/* Footer */}
            <div className="auth-footer">
              <p>
                Already have an account?{" "}
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

export default SignUp;
