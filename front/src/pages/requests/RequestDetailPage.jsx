import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { requestAPI, messageAPI, reviewAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../hooks/useSocket";

const STATUS_COLORS = {
  pending: "#f59e0b", accepted: "#3b82f6",
  in_progress: "#8b5cf6", completed: "#10b981", cancelled: "#6b7280",
};

const STATUS_FLOW = {
  pending: "accepted",
  accepted: "in_progress",
  in_progress: "completed",
};

function ReviewForm({ requestId, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await reviewAPI.create({ requestId, rating, comment });
      onSubmit();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "1.5rem", background: "#1e1e2e", borderRadius: "10px", border: "1px solid #2d2d3f" }}>
      <h3 style={{ margin: 0, color: "#e2e8f0" }}>Leave a Review</h3>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {[1,2,3,4,5].map((n) => (
          <button key={n} type="button" onClick={() => setRating(n)} style={{
            fontSize: "1.5rem", background: "none", border: "none", cursor: "pointer",
            opacity: n <= rating ? 1 : 0.3,
          }}>⭐</button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this helper..."
        rows={3}
        style={{ padding: "0.75rem", background: "#12121a", border: "1px solid #2d2d3f", borderRadius: "8px", color: "#e2e8f0", resize: "vertical", fontFamily: "inherit" }}
      />
      <button type="submit" disabled={loading} style={{
        padding: "0.6rem", background: "#6366f1", border: "none", borderRadius: "8px",
        color: "#fff", cursor: "pointer", fontWeight: 600,
      }}>
        {loading ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}

export default function RequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const socket = useSocket();

  const [request, setRequest] = useState(null);
  const [messages, setMessages] = useState([]);
  const [matches, setMatches] = useState([]);
  const [review, setReview] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const messagesEndRef = useRef(null);

  const isRequester = user && request?.requester?._id === user.id;
  const isHelper = user && request?.helper?._id === user.id;
  const isParticipant = isRequester || isHelper;

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [reqRes] = await Promise.all([requestAPI.getById(id)]);
      setRequest(reqRes.data);

      if (reqRes.data.status === "completed") {
        reviewAPI.getRequestReview(id).then((r) => setReview(r.data)).catch(() => {});
      }
    } catch {
      navigate("/requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [id]);

  useEffect(() => {
    if (!isParticipant) return;
    messageAPI.getMessages(id)
      .then((res) => setMessages(res.data || []))
      .catch(() => {});
  }, [id, isParticipant]);

  useEffect(() => {
    if (!request || request.status !== "pending") return;
    requestAPI.getMatches(id)
      .then((res) => setMatches(res.data || []))
      .catch(() => {});
  }, [id, request?.status]);

  // Socket.io — real-time messages
  useEffect(() => {
    if (!socket || !isParticipant) return;
    socket.emit("join_request", id);
    socket.on("new_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.emit("leave_request", id);
      socket.off("new_message");
    };
  }, [socket, isParticipant, id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    setSendingMessage(true);
    try {
      await messageAPI.sendMessage(id, messageInput);
      setMessageInput("");
    } catch (err) {
      alert(err.message);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleAccept = async () => {
    try {
      await requestAPI.accept(id);
      fetchAll();
    } catch (err) { alert(err.message); }
  };

  const advanceStatus = async () => {
    const next = STATUS_FLOW[request.status];
    if (!next) return;
    try {
      await requestAPI.updateStatus(id, next);
      fetchAll();
    } catch (err) { alert(err.message); }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>Loading…</div>;
  if (!request) return null;

  const tabs = ["details"];
  if (isParticipant) tabs.push("chat");
  if (request.status === "pending") tabs.push("matches");

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <Link to="/requests" style={{ color: "#6366f1", textDecoration: "none", fontSize: "0.9rem" }}>← Back to Requests</Link>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: "1rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ margin: 0, color: "#e2e8f0", fontSize: "1.5rem" }}>{request.title}</h1>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
              <span style={{
                background: STATUS_COLORS[request.status] + "22",
                color: STATUS_COLORS[request.status],
                padding: "0.2rem 0.7rem", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 600,
              }}>{request.status.replace("_", " ")}</span>
              <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>{request.category}</span>
              <span style={{ color: "#4b5563", fontSize: "0.8rem" }}>
                {new Date(request.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {isLoggedIn && request.status === "pending" && !isRequester && (
              <button onClick={handleAccept} style={{
                padding: "0.6rem 1.4rem", background: "#6366f1", border: "none",
                borderRadius: "8px", color: "#fff", cursor: "pointer", fontWeight: 600,
              }}>Accept & Help</button>
            )}
            {isHelper && STATUS_FLOW[request.status] && (
              <button onClick={advanceStatus} style={{
                padding: "0.6rem 1.4rem", background: "#10b981", border: "none",
                borderRadius: "8px", color: "#fff", cursor: "pointer", fontWeight: 600,
              }}>
                Mark as {STATUS_FLOW[request.status].replace("_", " ")}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0", borderBottom: "1px solid #2d2d3f", marginBottom: "1.5rem" }}>
        {tabs.map((t) => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding: "0.6rem 1.2rem", background: "none", border: "none",
            borderBottom: activeTab === t ? "2px solid #6366f1" : "2px solid transparent",
            color: activeTab === t ? "#818cf8" : "#6b7280", cursor: "pointer",
            textTransform: "capitalize", fontWeight: activeTab === t ? 600 : 400,
          }}>{t}</button>
        ))}
      </div>

      {/* Details Tab */}
      {activeTab === "details" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ background: "#1e1e2e", border: "1px solid #2d2d3f", borderRadius: "10px", padding: "1.5rem" }}>
            <h3 style={{ margin: "0 0 1rem", color: "#9ca3af", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Description</h3>
            <p style={{ color: "#d1d5db", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>{request.description}</p>
          </div>

          {request.skills?.length > 0 && (
            <div>
              <h3 style={{ color: "#9ca3af", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 0.75rem" }}>Skills Needed</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {request.skills.map((s) => (
                  <span key={s} style={{ background: "#6366f133", color: "#818cf8", padding: "0.25rem 0.75rem", borderRadius: "20px", fontSize: "0.85rem" }}>{s}</span>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={{ background: "#1e1e2e", border: "1px solid #2d2d3f", borderRadius: "10px", padding: "1rem" }}>
              <p style={{ color: "#6b7280", fontSize: "0.8rem", margin: "0 0 0.25rem" }}>REQUESTER</p>
              <p style={{ color: "#e2e8f0", margin: 0, fontWeight: 600 }}>{request.requester?.fullName}</p>
            </div>
            {request.helper && (
              <div style={{ background: "#1e1e2e", border: "1px solid #2d2d3f", borderRadius: "10px", padding: "1rem" }}>
                <p style={{ color: "#6b7280", fontSize: "0.8rem", margin: "0 0 0.25rem" }}>HELPER</p>
                <p style={{ color: "#e2e8f0", margin: 0, fontWeight: 600 }}>{request.helper?.fullName}</p>
                {request.helper?.reputation?.totalReviews > 0 && (
                  <p style={{ color: "#f59e0b", fontSize: "0.8rem", margin: "0.25rem 0 0" }}>
                    ⭐ {request.helper.reputation.score} ({request.helper.reputation.totalReviews} reviews)
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Review section */}
          {request.status === "completed" && isRequester && !review && (
            <ReviewForm requestId={id} onSubmit={fetchAll} />
          )}
          {review && (
            <div style={{ background: "#1e1e2e", border: "1px solid #2d2d3f", borderRadius: "10px", padding: "1.5rem" }}>
              <h3 style={{ margin: "0 0 0.75rem", color: "#9ca3af", fontSize: "0.85rem", textTransform: "uppercase" }}>Review</h3>
              <div style={{ display: "flex", gap: "0.25rem", marginBottom: "0.5rem" }}>
                {"⭐".repeat(review.rating)}
              </div>
              {review.comment && <p style={{ color: "#d1d5db", margin: 0 }}>{review.comment}</p>}
            </div>
          )}
        </div>
      )}

      {/* Chat Tab */}
      {activeTab === "chat" && (
        <div style={{ display: "flex", flexDirection: "column", height: "500px" }}>
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.75rem", padding: "0.5rem 0", marginBottom: "1rem" }}>
            {messages.length === 0
              ? <p style={{ color: "#4b5563", textAlign: "center", padding: "2rem" }}>No messages yet. Start the conversation!</p>
              : messages.map((msg, i) => {
                  const isMine = msg.sender?._id === user?.id || msg.sender === user?.id;
                  return (
                    <div key={i} style={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start" }}>
                      <div style={{
                        maxWidth: "70%", padding: "0.75rem 1rem",
                        background: isMine ? "#6366f1" : "#1e1e2e",
                        borderRadius: isMine ? "12px 12px 0 12px" : "12px 12px 12px 0",
                        border: isMine ? "none" : "1px solid #2d2d3f",
                      }}>
                        {!isMine && <p style={{ margin: "0 0 0.25rem", fontSize: "0.75rem", color: "#9ca3af" }}>{msg.sender?.fullName}</p>}
                        <p style={{ margin: 0, color: "#e2e8f0", lineHeight: 1.5 }}>{msg.content}</p>
                        <p style={{ margin: "0.25rem 0 0", fontSize: "0.7rem", color: isMine ? "#c7d2fe" : "#4b5563", textAlign: "right" }}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  );
                })
            }
            <div ref={messagesEndRef} />
          </div>

          {["accepted", "in_progress"].includes(request.status) ? (
            <form onSubmit={handleSendMessage} style={{ display: "flex", gap: "0.5rem" }}>
              <input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message…"
                style={{ flex: 1, padding: "0.75rem 1rem", background: "#1e1e2e", border: "1px solid #2d2d3f", borderRadius: "8px", color: "#e2e8f0" }}
              />
              <button type="submit" disabled={sendingMessage || !messageInput.trim()} style={{
                padding: "0.75rem 1.2rem", background: "#6366f1", border: "none",
                borderRadius: "8px", color: "#fff", cursor: "pointer",
              }}>Send</button>
            </form>
          ) : (
            <p style={{ color: "#4b5563", textAlign: "center", fontSize: "0.9rem" }}>
              Chat is available once the request is accepted.
            </p>
          )}
        </div>
      )}

      {/* Matches Tab */}
      {activeTab === "matches" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <p style={{ color: "#6b7280", margin: 0 }}>Top helpers matched by AI based on skills and profile:</p>
          {matches.length === 0
            ? <p style={{ color: "#4b5563" }}>No matches found yet — invite helpers by sharing this link.</p>
            : matches.map((m, i) => (
                <div key={i} style={{ background: "#1e1e2e", border: "1px solid #2d2d3f", borderRadius: "10px", padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                  <div>
                    <p style={{ margin: "0 0 0.25rem", color: "#e2e8f0", fontWeight: 600 }}>{m.helper.fullName}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                      {m.helper.skills?.slice(0, 5).map((s) => (
                        <span key={s} style={{ background: "#6366f133", color: "#818cf8", padding: "0.1rem 0.4rem", borderRadius: "4px", fontSize: "0.75rem" }}>{s}</span>
                      ))}
                    </div>
                    {m.helper.reputation?.totalReviews > 0 && (
                      <p style={{ margin: "0.25rem 0 0", color: "#f59e0b", fontSize: "0.8rem" }}>
                        ⭐ {m.helper.reputation.score} ({m.helper.reputation.totalReviews} reviews)
                      </p>
                    )}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ color: "#818cf8", fontWeight: 700, margin: 0 }}>{Math.round(m.score * 100)}%</p>
                    <p style={{ color: "#4b5563", fontSize: "0.75rem", margin: 0 }}>match</p>
                  </div>
                </div>
              ))
          }
        </div>
      )}
    </div>
  );
}
