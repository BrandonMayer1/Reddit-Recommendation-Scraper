import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [querySent, setQuerySent] = useState(false);

  async function handleSubmit() {
    if (!userMessage) return;

    setMessages(prev => [...prev, { sender: "user", text: userMessage }]);
    setQuerySent(true);

    const res = await fetch("http://127.0.0.1:8000", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: userMessage }),
    });

    const data = await res.json();
    setMessages(prev => [...prev, { sender: "ai", text: data.ai_result }]);
    setQuerySent(false);
    setUserMessage("");
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f9f9f9",
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>Reddit AI RAG Agent</h1>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "#DCF8C6" : "#E6E6FA",
              color: "#333",
              padding: "10px 15px",
              borderRadius: 15,
              maxWidth: "80%",
              wordWrap: "break-word",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            {msg.sender === "ai" ? (
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            ) : (
              msg.text
            )}
        </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          marginTop: 10,
          position: "sticky",
          bottom: 0,
          backgroundColor: "#f9f9f9",
          paddingTop: 10,
        }}
      >
        <input
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Enter a query..."
          style={{
            flex: 1,
            padding: "10px 15px",
            borderRadius: "20px",
            border: "1px solid #ccc",
            marginRight: "10px",
          }}
        />
        {!querySent && (
          <button
            onClick={handleSubmit}
            style={{
              borderRadius: "20px",
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Analyze
          </button>
        )}
      </div>
    </div>
  );
}
