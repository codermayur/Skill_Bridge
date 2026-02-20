import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { authAPI } from "./services/api";
import "./auth/Auth.css";

function ResetPassword() {
  const { resetToken } = useParams();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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

    try {
      const response = await authAPI.resetPassword(resetToken, formData.password);
      
      localStorage.setItem("userToken", response.token);
      localStorage.setItem("userData", JSON.stringify(response.user));
      
      setSuccess(true);
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (error) {
      setErrors({ submit: error.message || "Failed to reset password. The link may have expired." });
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
              <div className="illustration-icon">🔒</div>
            </div>
          </div>
          <div className="auth-left-text">
            <h2>Set New Password</h2>
            <p>Create a strong password to secure your account</p>
          </div>
        </div>

        <div className="auth-right">
          <div className="form-container">
            <div className="auth-header">
              <div className="header-icon">
                <span>🔑</span>
              </div>
              <h1>Reset Password</h1>
              <p>Enter your new password</p>
            </div>

            {success ? (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <h3>Password Reset Successful!</h3>
                <p>Redirecting to your profile...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="password">New Password</label>
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
                    {isLoading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
