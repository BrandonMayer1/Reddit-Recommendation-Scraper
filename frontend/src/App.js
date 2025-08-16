import { useState } from "react";

export default function App() {
  const [userMessage, setUserMessage] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  async function handleSubmit() {
    const res = await fetch("http://127.0.0.1:8000", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: userMessage }),
    });

    const data = await res.json();
    setAiResponse(data.ai_result);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Reddit AI RAG Agent</h1>
      <input
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        placeholder="Enter a query"
        style={{ width: 300, marginRight: 10 }}
      />
      <button onClick={handleSubmit}>Analyze</button>
      <pre style={{ marginTop: 20 }}>{aiResponse}</pre>
    </div>
  );
}