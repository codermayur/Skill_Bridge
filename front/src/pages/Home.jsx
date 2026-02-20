import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse position for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const languages = [
    {
      id: "javascript",
      name: "JavaScript",
      icon: "🟨",
      color: "#F7DF1E",
      path: "/practice/javascript",
      description: "Master JS fundamentals & advanced concepts",
      difficulty: "Beginner",
    },
    {
      id: "python",
      name: "Python",
      icon: "🐍",
      color: "#3776AB",
      path: "/practice/python",
      description: "Learn Python for data science & automation",
      difficulty: "Beginner",
    },
    {
      id: "java",
      name: "Java",
      icon: "☕",
      color: "#007396",
      path: "/practice/java",
      description: "Build robust Java applications",
      difficulty: "Intermediate",
    },
    {
      id: "cpp",
      name: "C++",
      icon: "⚙️",
      color: "#00599C",
      path: "/practice/cpp",
      description: "Master system programming with C++",
      difficulty: "Advanced",
    },
    {
      id: "react",
      name: "React",
      icon: "⚛️",
      color: "#61DAFB",
      path: "/practice/react",
      description: "Build modern UIs with React",
      difficulty: "Intermediate",
    },
    {
      id: "sql",
      name: "SQL",
      icon: "🗄️",
      color: "#336791",
      path: "/practice/sql",
      description: "Master database queries & optimization",
      difficulty: "Beginner",
    },
    {
      id: "typescript",
      name: "TypeScript",
      icon: "📘",
      color: "#3178C6",
      path: "/practice/typescript",
      description: "Build scalable apps with TypeScript",
      difficulty: "Intermediate",
    },
    {
      id: "golang",
      name: "Go",
      icon: "🔵",
      color: "#00ADD8",
      path: "/practice/golang",
      description: "Build fast concurrent applications",
      difficulty: "Intermediate",
    },
    {
      id: "rust",
      name: "Rust",
      icon: "🦀",
      color: "#CE422B",
      path: "/practice/rust",
      description: "Memory safety without garbage collection",
      difficulty: "Advanced",
    },
    {
      id: "csharp",
      name: "C#",
      icon: "💜",
      color: "#239120",
      path: "/practice/csharp",
      description: "Develop with .NET and modern C#",
      difficulty: "Intermediate",
    },
    {
      id: "php",
      name: "PHP",
      icon: "🐘",
      color: "#777BB4",
      path: "/practice/php",
      description: "Build web applications with PHP",
      difficulty: "Beginner",
    },
    {
      id: "kotlin",
      name: "Kotlin",
      icon: "📱",
      color: "#7F52FF",
      path: "/practice/kotlin",
      description: "Modern Android & JVM development",
      difficulty: "Intermediate",
    },
    {
      id: "dsa-java",
      name: "DSA - Java",
      icon: "📊",
      color: "#ED8B00",
      path: "/practice/dsa-java",
      description: "Data Structures & Algorithms in Java",
      difficulty: "Advanced",
    },
    {
      id: "dsa-python",
      name: "DSA - Python",
      icon: "🐍",
      color: "#4B8BBE",
      path: "/practice/dsa-python",
      description: "Data Structures & Algorithms in Python",
      difficulty: "Advanced",
    },
    {
      id: "dsa-cpp",
      name: "DSA - C++",
      icon: "⚙️",
      color: "#00599C",
      path: "/practice/dsa-cpp",
      description: "Data Structures & Algorithms in C++",
      difficulty: "Advanced",
    },
    {
      id: "machine-learning",
      name: "Machine Learning",
      icon: "🤖",
      color: "#FF6F00",
      path: "/practice/machine-learning",
      description: "ML algorithms, models & techniques",
      difficulty: "Advanced",
    },
    {
      id: "data-analytics",
      name: "Data Analytics",
      icon: "📈",
      color: "#00BCD4",
      path: "/practice/data-analytics",
      description: "Data analysis, visualization & insights",
      difficulty: "Intermediate",
    },
  ];

  return (
    <div className="home-container">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="gradient-blur" style={{
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
        }}></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Skill Bridge <span className="rocket">🚀</span>
            </h1>
            <p className="hero-subtitle">
              Train for Placement & Logical Thinking
            </p>
            <p className="hero-description">
              Master 18+ programming languages and topics including DSA, ML, and Data Analytics. Ace your technical interviews with real-world problems
            </p>
            <Link to="/practice" className="cta-button">
              <span className="button-text">Start Learning Now</span>
              <span className="button-icon">→</span>
            </Link>
          </div>
          <div className="hero-image">
            <div className="animated-circle"></div>
            <div className="animated-square"></div>
            <div className="animated-triangle"></div>
            <div className="animated-hexagon"></div>
          </div>
        </div>
      </div>

      {/* Language Cards Section */}
      <div className="languages-section">
        <h2 className="section-title">
          Choose Your Language
          <span className="title-accent">🎯</span>
        </h2>
        <p className="section-subtitle">
          Select from 18+ programming languages and topics to start practicing
        </p>

        <div className="languages-grid">
          {languages.map((language) => (
            <Link
              key={language.id}
              to={language.path}
              className="language-card-link"
            >
              <div
                className={`language-card ${
                  hoveredCard === language.id ? "active" : ""
                }`}
                style={{
                  "--card-color": language.color,
                }}
                onMouseEnter={() => setHoveredCard(language.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="card-glow"></div>
                <div className="card-icon">{language.icon}</div>
                <h3 className="card-title">{language.name}</h3>
                <p className="card-description">{language.description}</p>
                <div className="difficulty-badge">{language.difficulty}</div>
                <div className="card-footer">
                  <span className="practice-btn">Start Practice</span>
                  <span className="arrow">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Statistics Section */}
      <div className="stats-section">
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-number">500+</div>
            <p className="stat-label">Practice Problems</p>
          </div>
          <div className="stat-card">
            <div className="stat-number">12+</div>
            <p className="stat-label">Programming Languages</p>
          </div>
          <div className="stat-card">
            <div className="stat-number">24/7</div>
            <p className="stat-label">Learning Access</p>
          </div>
          <div className="stat-card">
            <div className="stat-number">10K+</div>
            <p className="stat-label">Active Learners</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2 className="section-title">
          Why Choose Skill Bridge?
          <span className="title-accent">✨</span>
        </h2>
        <div className="features-grid">
          <div className="feature-item">
            <span className="feature-icon">📚</span>
            <h4>Comprehensive Content</h4>
            <p>Learn from beginner to advanced levels with structured paths</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⚡</span>
            <h4>Real-time Feedback</h4>
            <p>Instant feedback on your solutions with detailed explanations</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎯</span>
            <h4>Interview Ready</h4>
            <p>Questions curated for FAANG and top companies</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <h4>Progress Tracking</h4>
            <p>Monitor your learning journey with detailed analytics</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🏆</span>
            <h4>Leaderboards</h4>
            <p>Compete with peers and climb the global rankings</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🤝</span>
            <h4>Community Support</h4>
            <p>Connect with learners and get help from experts</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="final-cta-section">
        <h2>Ready to Boost Your Skills?</h2>
        <p>Join thousands of learners preparing for their dream jobs</p>
        <Link to="/practice" className="primary-button">
          Start Practicing Now
        </Link>
      </div>
    </div>
  );
}

export default Home;
