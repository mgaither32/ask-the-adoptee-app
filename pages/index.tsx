import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const scenarios = {
  "Hair and Appearance": [
    "How do I start learning to care for my child's hair?",
    "My child's hair looks different from when we see other Black children. Should I be concerned?",
    "Where do I find a good barber or stylist for my child?",
  ],
  "Identity and Belonging": [
    "My child asked why they look different from me. What do I say?",
    "How do I help my child feel like they belong at home and at school?",
    "My child seems to be struggling with who they are. How can I help?",
  ],
  "Race and Racism": [
    "My child came home saying kids made fun of their skin. How do I respond?",
    "How do I talk to my child about racism when I've never experienced it?",
    "My child doesn't want to talk about race. Should I push the conversation?",
  ],
  "Culture and Community": [
    "We don't have many Black people in our community. How does that affect my child?",
    "How do I expose my child to Black culture and community?",
    "My child wants to spend time with their biological family. How do I support that?",
  ],
  "School and Teachers": [
    "My child is the only Black kid in their classroom. How do I help them navigate that?",
    "A teacher said my child needs to 'work on their attitude.' Should I be concerned?",
    "My child's school doesn't have any Black teachers. Does that matter?",
  ],
};

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleScenarioClick = (scenario: string) => {
    setInput(scenario);
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;
    const newMessages = [...messages, { role: "user" as const, content: messageText }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await response.json();
      if (data.message) {
        setMessages([...newMessages, { role: "assistant" as const, content: data.message }]);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) sendMessage(input);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#2C1810", color: "#F5EFE8", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "20px", textAlign: "center", borderBottom: "1px solid #C4922A" }}>
        <h1 style={{ fontSize: "24px", marginBottom: "10px" }}>Ask the Adoptee</h1>
        <button
          onClick={() => setShowAbout(!showAbout)}
          style={{ backgroundColor: "transparent", color: "#C4922A", border: "1px solid #C4922A", padding: "8px 16px" }}
        >
          {showAbout ? "Back to Chat" : "Who is Behind This"}
        </button>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", maxWidth: "680px", width: "100%", margin: "0 auto", padding: "40px 20px" }}>
        {showAbout ? (
          <AboutSection onBack={() => setShowAbout(false)} />
        ) : (
          <>
            {messages.length === 0 ? (
              <div style={{ textAlign: "center", marginBottom: "40px", marginTop: "20px" }}>
                <p style={{ fontSize: "18px", marginBottom: "30px" }}>
                  Ask Michael Gaither for guidance on a real situation you're facing with your Black child. Choose a scenario below or type your own question.
                </p>
              </div>
            ) : (
              <div style={{ marginBottom: "30px", flex: 1 }}>
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    style={{
                      marginBottom: "20px",
                      padding: "15px",
                      backgroundColor: msg.role === "user" ? "#C4922A" : "transparent",
                      color: msg.role === "user" ? "#2C1810" : "#F5EFE8",
                      borderLeft: msg.role === "assistant" ? "3px solid #C4922A" : "none",
                      paddingLeft: msg.role === "assistant" ? "20px" : "15px",
                    }}
                  >
                    <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.8" }}>{msg.content}</p>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}

            {messages.length === 0 && (
              <div style={{ marginBottom: "30px" }}>
                {Object.entries(scenarios).map(([category, items]) => (
                  <div key={category} style={{ marginBottom: "25px" }}>
                    <h3 style={{ color: "#C4922A", fontSize: "16px", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
                      {category}
                    </h3>
                    {items.map((scenario, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleScenarioClick(scenario)}
                        style={{ display: "block", width: "100%", textAlign: "left", marginBottom: "10px", backgroundColor: "transparent", border: "1px solid #C4922A", color: "#F5EFE8", padding: "12px 16px", cursor: "pointer", fontSize: "14px" }}
                      >
                        {scenario}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ marginTop: "auto" }}>
              <div style={{ display: "flex", gap: "10px" }}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question or situation here..."
                  style={{ flex: 1, minHeight: "100px", resize: "vertical" }}
                />
                <button type="submit" disabled={loading} style={{ alignSelf: "flex-end", opacity: loading ? 0.5 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
                  {loading ? "..." : "Send"}
                </button>
              </div>
            </form>

            <div style={{ marginTop: "30px", fontSize: "13px", padding: "15px", backgroundColor: "rgba(196, 146, 42, 0.1)", borderLeft: "2px solid #C4922A", lineHeight: "1.6" }}>
              <p>The responses in this tool are generated by AI, trained on my voice, my framework, and 49 years of lived experience as a Black adoptee raised in a white family. I did not type each answer by hand. The perspective behind every response is mine. The technology makes it available to you at any hour of the day, for any situation you are facing. I believe in being honest about that, because the parents who come here deserve honesty above everything else.</p>
              <p style={{ marginTop: "10px" }}>— Michael Gaither</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function AboutSection({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ maxWidth: "680px", lineHeight: "1.8" }}>
      <h2 style={{ fontSize: "22px", marginBottom: "8px", color: "#C4922A" }}>About This Tool</h2>
      <h3 style={{ fontSize: "18px", marginBottom: "24px", fontWeight: "normal" }}>Who is behind Ask the Adoptee</h3>

      <p style={{ marginBottom: "20px" }}>
        My name is Michael Gaither. I am a Black transracial adoptee who was raised by a white family in Lincoln, Nebraska. I spent 30 years as a teacher and school principal. At 49 years old, I reunited with my biological family for the first time.
      </p>

      <p style={{ marginBottom: "20px" }}>
        I built Beyond the Moment Adoption Studio because I know what it costs a child when their white parents are not equipped for the conversations that matter most. I lived those costs. I also know what it feels like when a parent gets it right, and I want more children to have that experience.
      </p>

      <p style={{ marginBottom: "32px" }}>
        Ask the Adoptee exists because white parents raising Black children deserve more than books and good intentions. They deserve to be able to describe a real moment, at any hour of the day, and get guidance from someone who has been on the other side of it.
      </p>

      <h3 style={{ fontSize: "18px", marginBottom: "16px", color: "#C4922A" }}>A note on how this works</h3>

      <p style={{ marginBottom: "32px" }}>
        The responses in this tool are generated by AI, trained on my voice, my framework, and 49 years of lived experience as a Black adoptee raised in a white family. I did not type each answer by hand. The perspective behind every response is mine. The technology makes it available to you at any hour of the day, for any situation you are facing. I believe in being honest about that, because the parents who come here deserve honesty above everything else.
      </p>

      <button
        onClick={onBack}
        style={{ backgroundColor: "#C4922A", color: "#2C1810", border: "none", padding: "14px 32px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", width: "100%", marginBottom: "30px" }}
      >
        Get Guidance
      </button>

      <div style={{ padding: "20px", backgroundColor: "rgba(196, 146, 42, 0.1)", borderLeft: "2px solid #C4922A" }}>
        <p style={{ marginBottom: "10px" }}>
          <Link href="https://beyondthemomentadoptionstudio.com" style={{ color: "#C4922A" }}>Beyond the Moment Adoption Studio</Link>
        </p>
        <p>
          <Link href="https://beyondthemomentadoptionstudio.com/#community" style={{ color: "#C4922A" }}>Free guide: 7 Conversations Every White Parent Must Have With Their Black Child</Link>
        </p>
      </div>
    </div>
  );
                   }
