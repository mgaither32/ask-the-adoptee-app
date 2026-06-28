import { useState, useRef, useEffect } from "react";

const QUOTE =
  "I was 49 years old before I knew what it felt like to look at someone and see myself.";

const CATEGORIES = [
  {
    id: "hair",
    label: "Hair & Appearance",
    questions: [
      "How do I start learning to care for my child's hair properly?",
      "Where do I find a barber or stylist who knows Black hair?",
      "My child is embarrassed about their hair at school. What do I do?",
    ],
  },
  {
    id: "identity",
    label: "Identity & Belonging",
    questions: [
      "My child asked why they look different from me. What do I say?",
      "How do I help my child feel like they truly belong in our family?",
      "My child says they don't feel Black or white. How do I respond?",
    ],
  },
  {
    id: "race",
    label: "Race & Racism",
    questions: [
      "My child came home saying kids made fun of their skin. How do I handle this?",
      "How do I talk about racism when I have never experienced it personally?",
      "My child does not want to talk about race at all. Should I push?",
    ],
  },
  {
    id: "culture",
    label: "Culture & Community",
    questions: [
      "We live in a mostly white community. How does this affect my child?",
      "How do I give my child real connections to Black culture?",
      "My child wants to spend time with their biological family. How do I support that?",
    ],
  },
  {
    id: "school",
    label: "School & Teachers",
    questions: [
      "My child is the only Black student in their class. How do I help them navigate that?",
      "A teacher described my child in a way that felt racially coded. What do I do?",
      "My child's school has no Black teachers. Does that matter?",
    ],
  },
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

function parseContent(text: string) {
  return text
    .split(/\n+/)
    .filter((p) => p.trim())
    .map((para, pi) => {
      const parts = para.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={pi} style={{ marginBottom: "16px", lineHeight: "1.85" }}>
          {parts.map((part, i) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={i} style={{ color: "#C4922A" }}>
                {part.slice(2, -2)}
              </strong>
            ) : (
              part
            )
          )}
        </p>
      );
    });
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [showAbout, setShowAbout] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const inChat = messages.length > 0;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const r = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const d = await r.json();
      if (d.message)
        setMessages([...next, { role: "assistant" as const, content: d.message }]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (showAbout) return <AboutPage onBack={() => setShowAbout(false)} />;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#2C1810",
        color: "#F5EFE8",
        fontFamily: "Georgia, 'Times New Roman', serif",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <header
          style={{
            padding: "18px 24px 16px",
            borderBottom: "1px solid rgba(196,146,42,0.4)",
            position: "sticky",
            top: 0,
            backgroundColor: "#2C1810",
            zIndex: 20,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  color: "#F5EFE8",
                }}
              >
                Ask the Adoptee
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#C4922A",
                  letterSpacing: "1.5px",
                  marginTop: "4px",
                }}
              >
                by Michael Gaither &middot; Beyond the Moment Studio
              </div>
            </div>
            <button
              onClick={() => setShowAbout(true)}
              style={{
                background: "none",
                border: "none",
                color: "#C4922A",
                fontSize: "14px",
                cursor: "pointer",
                padding: "8px",
                minHeight: "44px",
                fontFamily: "Georgia, serif",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              About
            </button>
          </div>
        </header>

        {/* Welcome screen — only when no messages */}
        {!inChat && (
          <>
            {/* Michael's quote */}
            <div
              style={{
                padding: "32px 24px 26px",
                borderBottom: "1px solid rgba(196,146,42,0.2)",
              }}
            >
              <p
                style={{
                  fontSize: "19px",
                  lineHeight: "1.75",
                  fontStyle: "italic",
                  color: "#F5EFE8",
                  marginBottom: "14px",
                }}
              >
                &ldquo;{QUOTE}&rdquo;
              </p>
              <p style={{ fontSize: "13px", color: "#C4922A", letterSpacing: "0.3px" }}>
                &mdash; Michael Gaither &nbsp;&middot;&nbsp; Black transracial adoptee &nbsp;&middot;&nbsp; reunited with biological family at 49
              </p>
            </div>

            {/* Category pills */}
            <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", padding: "20px 24px 0" }}>
              <div style={{ display: "flex", gap: "8px", paddingBottom: "16px", width: "max-content" }}>
                {CATEGORIES.map((cat, i) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(i)}
                    style={{
                      padding: "9px 18px",
                      borderRadius: "100px",
                      fontSize: "14px",
                      fontFamily: "Georgia, serif",
                      cursor: "pointer",
                      border: activeCategory === i ? "none" : "1px solid rgba(196,146,42,0.4)",
                      backgroundColor: activeCategory === i ? "#C4922A" : "transparent",
                      color: activeCategory === i ? "#2C1810" : "#F5EFE8",
                      fontWeight: activeCategory === i ? "bold" : "normal",
                      minHeight: "40px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Question cards */}
            <div style={{ padding: "4px 24px 180px" }}>
              <p
                style={{
                  fontSize: "11px",
                  color: "rgba(196,146,42,0.6)",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                  marginTop: "6px",
                }}
              >
                Common situations
              </p>
              {CATEGORIES[activeCategory].questions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(q);
                    setTimeout(() => taRef.current?.focus(), 80);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    backgroundColor: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(196,146,42,0.22)",
                    color: "#F5EFE8",
                    padding: "16px 20px",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontFamily: "Georgia, serif",
                    lineHeight: "1.6",
                    borderRadius: "8px",
                    marginBottom: "10px",
                    minHeight: "56px",
                  }}
                >
                  {q}
                </button>
              ))}
              <p
                style={{
                  fontSize: "14px",
                  color: "rgba(245,239,232,0.35)",
                  textAlign: "center",
                  marginTop: "20px",
                }}
              >
                Or type your own situation below
              </p>
            </div>
          </>
        )}

        {/* Chat view — shows ONLY when there are messages */}
        {inChat && (
          <div
            style={{
              flex: 1,
              padding: "24px 24px 180px",
              display: "flex",
              flexDirection: "column",
              gap: "22px",
            }}
          >
            {messages.map((msg, i) =>
              msg.role === "user" ? (
                <div key={i} style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div
                    style={{
                      backgroundColor: "#C4922A",
                      color: "#2C1810",
                      padding: "13px 17px",
                      borderRadius: "18px 18px 4px 18px",
                      fontSize: "17px",
                      lineHeight: "1.65",
                      maxWidth: "88%",
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      border: "1.5px solid #C4922A",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      color: "#C4922A",
                      fontSize: "14px",
                      fontWeight: "bold",
                      marginTop: "3px",
                    }}
                  >
                    M
                  </div>
                  <div style={{ flex: 1, fontSize: "17px", color: "#F5EFE8" }}>
                    {parseContent(msg.content)}
                  </div>
                </div>
              )
            )}

            {loading && (
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    border: "1.5px solid #C4922A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: "#C4922A",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  M
                </div>
                <span style={{ color: "#C4922A", fontSize: "15px", fontStyle: "italic" }}>
                  Michael is responding&nbsp;&nbsp;&bull;&nbsp;&nbsp;&bull;&nbsp;&nbsp;&bull;
                </span>
              </div>
            )}

            <div ref={endRef} />
          </div>
        )}
      </div>

      {/* Fixed input at bottom */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "#2C1810",
          borderTop: "1px solid rgba(196,146,42,0.3)",
          padding: "14px 20px 32px",
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <textarea
            ref={taRef}
            value={input}
            rows={3}
            placeholder={inChat ? "Ask a follow-up..." : "Describe your situation here..."}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            style={{
              width: "100%",
              backgroundColor: "rgba(245,239,232,0.06)",
              color: "#F5EFE8",
              border: "1.5px solid rgba(196,146,42,0.45)",
              borderRadius: "10px",
              padding: "13px 16px",
              fontSize: "17px",
              fontFamily: "Georgia, serif",
              lineHeight: "1.6",
              resize: "none",
              display: "block",
              marginBottom: "10px",
              outline: "none",
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{
              width: "100%",
              backgroundColor: !loading && input.trim() ? "#C4922A" : "rgba(196,146,42,0.2)",
              color: !loading && input.trim() ? "#2C1810" : "rgba(245,239,232,0.3)",
              border: "none",
              borderRadius: "10px",
              padding: "15px",
              fontSize: "17px",
              fontWeight: "bold",
              fontFamily: "Georgia, serif",
              cursor: !loading && input.trim() ? "pointer" : "not-allowed",
              transition: "all 0.2s ease",
            }}
          >
            {loading ? "Responding..." : "Get Guidance"}
          </button>
        </form>
      </div>
    </div>
  );
}

function AboutPage({ onBack }: { onBack: () => void }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#2C1810",
        color: "#F5EFE8",
        fontFamily: "Georgia, serif",
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <header
          style={{
            padding: "18px 24px 16px",
            borderBottom: "1px solid rgba(196,146,42,0.35)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            backgroundColor: "#2C1810",
            zIndex: 20,
          }}
        >
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              color: "#C4922A",
              fontSize: "14px",
              cursor: "pointer",
              fontFamily: "Georgia, serif",
              padding: "8px 0",
              minHeight: "44px",
            }}
          >
            &larr; Back
          </button>
          <div style={{ fontSize: "13px", fontWeight: "bold", letterSpacing: "3px", textTransform: "uppercase" }}>
            About
          </div>
          <div style={{ width: "60px" }} />
        </header>

        <div style={{ padding: "36px 24px 60px" }}>
          <p style={{ fontSize: "11px", color: "#C4922A", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "18px" }}>
            Who built this
          </p>

          <p style={{ fontSize: "19px", lineHeight: "1.85", marginBottom: "22px" }}>
            My name is Michael Gaither. I am a Black transracial adoptee who was raised by a white family in Lincoln, Nebraska. I spent 30 years as a teacher and school principal. At 49 years old, I reunited with my biological family for the first time.
          </p>
          <p style={{ fontSize: "19px", lineHeight: "1.85", marginBottom: "22px" }}>
            I built Beyond the Moment Adoption Studio because I know what it costs a child when their white parents are not equipped for the conversations that matter most. I lived those costs. I also know what it feels like when a parent gets it right, and I want more children to have that experience.
          </p>
          <p style={{ fontSize: "19px", lineHeight: "1.85", marginBottom: "40px" }}>
            Ask the Adoptee exists because white parents raising Black children deserve more than books and good intentions. They deserve to be able to describe a real moment, at any hour of the day, and get guidance from someone who has been on the other side of it.
          </p>

          <div style={{ width: "100%", height: "1px", backgroundColor: "rgba(196,146,42,0.3)", marginBottom: "40px" }} />

          <p style={{ fontSize: "11px", color: "#C4922A", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "18px" }}>
            How this works
          </p>
          <p style={{ fontSize: "19px", lineHeight: "1.85", marginBottom: "40px" }}>
            The responses in this tool are generated by AI, trained on my voice, my framework, and 49 years of lived experience as a Black adoptee raised in a white family. I did not type each answer by hand. The perspective behind every response is mine. The technology makes it available to you at any hour of the day, for any situation you are facing. I believe in being honest about that, because the parents who come here deserve honesty above everything else.
          </p>

          <button
            onClick={onBack}
            style={{
              width: "100%",
              backgroundColor: "#C4922A",
              color: "#2C1810",
              border: "none",
              borderRadius: "10px",
              padding: "17px",
              fontSize: "18px",
              fontWeight: "bold",
              fontFamily: "Georgia, serif",
              cursor: "pointer",
              marginBottom: "32px",
            }}
          >
            Get Guidance
          </button>

          <div style={{ borderTop: "1px solid rgba(196,146,42,0.25)", paddingTop: "28px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <a href="https://beyondthemomentadoptionstudio.com" style={{ color: "#C4922A", fontSize: "16px" }}>
              beyondthemomentadoptionstudio.com &rarr;
            </a>
            <a href="https://beyondthemomentadoptionstudio.com/#community" style={{ color: "#C4922A", fontSize: "15px", lineHeight: "1.6" }}>
              Free guide: 7 Conversations Every White Parent Must Have With Their Black Child &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
