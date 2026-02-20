import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (!userToken) {
      navigate("/login");
      return;
    }

    const storedData = localStorage.getItem("userData");
    if (storedData) {
      setUserData(JSON.parse(storedData));
      setEditData(JSON.parse(storedData));
    }
  }, [navigate]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    localStorage.setItem("userData", JSON.stringify(editData));
    setUserData(editData);
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  if (!userData) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-banner"></div>
        <div className="profile-content">
          <div className="profile-avatar">
            <div className="avatar-circle">👤</div>
          </div>
          <div className="profile-info">
            <h1>{userData.fullName || userData.email}</h1>
            <p className="email">{userData.email}</p>
            <p className="joined">
              Joined {new Date(userData.joinDate).toLocaleDateString()}
            </p>
          </div>
          <button
            className="edit-profile-btn"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>

      <div className="profile-body">
        {isEditing ? (
          <div className="edit-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={editData.fullName || ""}
                onChange={handleEditChange}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={editData.email || ""}
                onChange={handleEditChange}
              />
            </div>
            <button className="save-btn" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        ) : (
          <div className="profile-stats">
            <div className="stat-card">
              <h3>500+</h3>
              <p>Problems Solved</p>
            </div>
            <div className="stat-card">
              <h3>12</h3>
              <p>Languages Learned</p>
            </div>
            <div className="stat-card">
              <h3>78%</h3>
              <p>Average Score</p>
            </div>
            <div className="stat-card">
              <h3>Gold</h3>
              <p>Current Badge</p>
            </div>
          </div>
        )}

        <div className="profile-section">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-icon">✅</span>
              <div className="activity-info">
                <p>Completed JavaScript Challenge</p>
                <small>2 hours ago</small>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">🔥</span>
              <div className="activity-info">
                <p>7-day streak achieved!</p>
                <small>1 day ago</small>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">🏆</span>
              <div className="activity-info">
                <p>Reached #100 on leaderboard</p>
                <small>3 days ago</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
