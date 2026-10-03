import { useEffect, useState } from "react";
import api from "../../lib/api/api";

function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await api.get("/messages");
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error("Failed to fetch messages:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to load messages."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading messages...</p>;
  }

  return (
    <div>
      <div className="page-heading">
        <h2>Messages</h2>
        <p>
          View messages submitted through your portfolio
          contact form.
        </p>
      </div>

      {message && (
        <div className="admin-message">
          {message}
        </div>
      )}

      <div className="dashboard-card messages-list-card">
        <div className="messages-header">
          <h3>Contact Messages</h3>

          <button onClick={fetchMessages}>
            Refresh
          </button>
        </div>

        {messages.length === 0 ? (
          <div className="empty-messages">
            <p>No messages received yet.</p>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((item) => (
              <div
                className="message-admin-card"
                key={item.id}
              >
                <div className="message-admin-header">
                  <div>
                    <h3>{item.name}</h3>

                    <a
                      href={`mailto:${item.email}`}
                    >
                      {item.email}
                    </a>
                  </div>

                  <small>
                    {item.created_at
                      ? new Date(
                          item.created_at
                        ).toLocaleString()
                      : ""}
                  </small>
                </div>

                {item.subject && (
                  <div className="message-subject">
                    <strong>Subject:</strong>{" "}
                    {item.subject}
                  </div>
                )}

                <div className="message-content">
                  <p>{item.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;