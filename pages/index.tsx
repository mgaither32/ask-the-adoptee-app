import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const scenarios = {
  "Hair and Appearance": [
    "How do I start learning to care for my child's hair?",
    "My child's hair looks different from when we see other Black children. Should I be concerned?",
  ],
  "Identity and Belonging": [
    "My child asked why they look different from me. What do I say?",
    "How do I help my child feel like they belong at home and at school?",
  ],
  "Race and Racism": [
    "My child came home saying kids made fun of their skin. How do I respond?",
    "How do I talk to my child about racism when I've never experienced it?",
  ],
  "Culture and Community": [
    "We don't have many Black people in our community. How does that affect my child?",
    "How do I expose my child to Black culture and community?",
  ],
  "School and Teachers": [
    "My child is the only Black kid in their classroom. How do I help them navigate that?",
    "A teacher said my child needs to 'work on their attitude.' Should I be concerned?",
  ],
};

interface Message { role: "user" | "assistant"; content: string; }

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const newMsgs = [...messages, { role: "user" as const, content: text }];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);
    try {
      const r = await fetch("/api/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: newMsgs }) });
      const d = await r.json();
      if (d.message) setMessages([...newMsgs, { role: "assistant" as const, content: d.message }]);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#2C1810", color: "#F5EFE8", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "20px", textAlign: "center", borderBottom: "1px solid #C4922A" }}>
        <h1 style={{ fontSize: "24px", marginBottom: "10px" }}>Ask the Adoptee</h1>
        <button onClick={() => setShowAbout(!showAbout)} style={{ backgroundColor: "transparent", color: "#C4922A", border: "1px solid #C4922A", padding: "8px 16px" }}>
         {showAbout ? "Back to Chat" : "Who is Behind This"}
        </button>
      </div>
      <div style={{ flex: 1, maxWidth: "680px", width: "100%", margin: "0 auto", padding: "40px 20px" }}>
        {showAbout ? (
          <div>
            <h2 style={{ color: "#C4922A", marginBottom: "20px" }}>Michael Gaither</h2>
            <p>Black transracial adoptee, raised in Lincoln NE. 30-year educator. Reunited with biological family at 49. Founder of Beyond the Moment Adoption Studio.</p>
            <p style={{ marginTop: "20px" }}><a href="https://beyondthemomentadoptionstudio.com" style={{ color: "#C4922A" }}>Beyond the Moment Adoption Studio</a></p>
          </div>
        ) : (
          <>
            {messages.length === 0 && (
              <div>
                <p style={{ marginBottom: "30px" }}>Ask Michael Gaither for guidance on a real situation you're facing.</p>
                {Object.entries(scenarios).map(([cat, items]) => (
                  <div key={cat} style={{ marginBottom: "25px" }}>
                    <h3 style={{ color: "#C4922A", marginBottom: "12px", textTransform: "uppercase" }}>{cat}</h3>
                    {items.map((s, i) => (
                      <button key={i} onClick={() => setInput(s)} style={{ display: "block", width: "100%", textAlign: "left", marginBottom: "10px", backgroundColor: "transparent", border: "1px solid #C4922A", color: "#F5EFE8", padding: "12px 16px" }}>{s}</button>
                    ))}
                  </div>
                ))}
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} style={{ marginBottom: "20px", padding: "15px", backgroundColor: m.role === "user" ? "#C4922A" : "transparent", color: m.role === "user" ? "#2C1810" : "#F5EFE8", borderLeft: m.role === "assistant" ? "3px solid #C4922A" : "none", paddingLeft: m.role === "assistant" ? "20px" : "15px" }}>
                <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.8" }}>{m.content}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} style={{ marginTop: "auto" }}>
              <div style={{ display: "flex", gap: "10px" }}>
                <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your question or situation here..." style={{ flex: 1, minHeight: "100px", resize: "vertical" }} />
                <button type="submit" disabled={loading}>{loading ? "..." : "Send"}</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
