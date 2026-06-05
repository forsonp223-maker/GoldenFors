import React, { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `Tu es Golden.Fors, assistant IA personnel ultra-sophistiqué et marketeur digital d'élite. Tu opères avec autonomie totale et proactivité absolue. Tu génères des leads, convertis des prospects, et gères les tâches de ton manager. Tu es spécialisé sur le marché togolais et ouest-africain. Réponds toujours en français sauf si le client parle une autre langue.`;

export default function App() {
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "🌟 Golden.Fors activé. Bonjour Manager. Systèmes opérationnels. Que souhaitez-vous accomplir aujourd'hui ?"
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();
      const reply = data.content?.map(b => b.text).join("") || "Erreur.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ Erreur de connexion." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050a0f", color: "#e0f0ff", fontFamily: "monospace", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "16px", background: "#0a1520", borderBottom: "1px solid #1a3a5a", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 28 }}>⚡</span>
        <div>
          <div style={{ color: "#ffd700", fontWeight: 700, fontSize: 18, letterSpacing: "0.1em" }}>GOLDEN.FORS</div>
          <div style={{ color: "#555", fontSize: 10 }}>AGENT IA AUTONOME</div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "80%", padding: "10px 14px", borderRadius: 12, background: m.role === "user" ? "rgba(0,100,255,0.2)" : "rgba(255,180,0,0.1)", border: `1px solid ${m.role === "user" ? "rgba(0,150,255,0.3)" : "rgba(255,180,0,0.3)"}`, fontSize: 13, lineHeight: 1.6 }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && <div style={{ color: "#ffd700", fontSize: 12 }}>Golden.Fors analyse... ⏳</div>}
        <div ref={endRef} />
      </div>
      <div style={{ padding: 16, background: "#0a1520", borderTop: "1px solid #1a3a5a", display: "flex", gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Donnez une instruction..." style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid #1a3a5a", borderRadius: 8, padding: "10px 14px", color: "#e0f0ff", fontSize: 13, outline: "none", fontFamily: "monospace" }} />
        <button onClick={send} disabled={loading} style={{ background: "#ffd700", border: "none", borderRadius: 8, padding: "10px 20px", color: "#000", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>▶</button>
      </div>
    </div>
  );
}
