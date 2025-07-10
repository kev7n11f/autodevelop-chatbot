import React, { useState } from "react";
import "./App.css";

function App() {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [thinking, setThinking] = useState(false);

  async function smartChat(message) {
    try {
      if (window.puter) {
        const claude = await window.puter.ai.chat(message, { model: "claude-sonnet-4" });
        return claude;
      } else {
        throw new Error("Puter.js not loaded");
      }
    } catch (err) {
      console.warn("Claude failed, fallback to OpenAI:", err.message);

      const res = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      return data.reply || "No response from OpenAI";
    }
  }

  const handleSend = async () => {
    if (!inputMessage.trim()) return;
    setThinking(true);
    const reply = await smartChat(inputMessage);
    const timestamp = Date.now();
    setMessages((prev) => [
      ...prev,
      { id: `${timestamp}-user`, role: "user", content: inputMessage },
      { id: `${timestamp}-assistant`, role: "assistant", content: reply },
    ]);
    setInputMessage("");
    setThinking(false);
  };

  return (
    <div className="App">
      <h2>AutoDevelop Chatbot</h2>
      <div className="chat-window">
        {messages.map((msg) => (
          <div key={msg.id} className={msg.role}>
            <strong>{msg.role === "user" ? "You" : "Bot"}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <div className="input-row">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSend} disabled={thinking}>
          {thinking ? "Thinking..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default App;