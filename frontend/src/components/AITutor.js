import { useState, useRef, useEffect } from "react";

const TOPICS = [
  {
    id: "binary",
    label: "Binary & Data Representation",
    emoji: "💾",
    colour: "#00e5a0",
  },
  {
    id: "algorithms",
    label: "Algorithms & Flowcharts",
    emoji: "🔄",
    colour: "#0099ff",
  },
  {
    id: "programming",
    label: "Programming Constructs",
    emoji: "⚙️",
    colour: "#a78bfa",
  },
  {
    id: "boolean",
    label: "Boolean Logic & Gates",
    emoji: "🔀",
    colour: "#ffd166",
  },
  {
    id: "python",
    label: "Python / Small Basic",
    emoji: "🐍",
    colour: "#ff6b6b",
  },
];

const BLOOMS_LABELS = {
  1: "Remember",
  2: "Understand",
  3: "Apply",
  4: "Analyse",
  5: "Evaluate",
};

const getBloomsLevel = (mastery) => {
  if (mastery >= 85) return 5;
  if (mastery >= 70) return 4;
  if (mastery >= 55) return 3;
  if (mastery >= 40) return 2;
  return 1;
};

const buildSystemPrompt = (topic, bloomsLevel, masteryPct) => {
  const topicLabel = TOPICS.find((t) => t.id === topic)?.label || topic;
  const bloomsLabel = BLOOMS_LABELS[bloomsLevel];

  const basePersonality = `You are an encouraging, friendly Computer Science tutor inside Learning Pulse, an app for KS3 students in England. You are talking to a Year 7 student (age 11-12). Always use simple, everyday language. Never use jargon without immediately explaining it. Be warm, patient, and encouraging — never make the student feel stupid. Keep responses concise (3-5 sentences max unless showing code or a worked example). Use real-world analogies that a 12-year-old would relate to (football, YouTube, phones, food, gaming etc.).`;

  const topicContext = {
    binary: `The topic is Binary & Data Representation. Key concepts: binary digits (bits), converting between binary and denary, bytes, why computers use binary. Common misconceptions: students think binary is just "on/off switches" without understanding WHY, or they confuse bit and byte.`,
    algorithms: `The topic is Algorithms & Flowcharts. Key concepts: what an algorithm is, sequence, selection, iteration, flowchart symbols (start/end oval, process rectangle, decision diamond, input/output parallelogram), pseudocode basics. Common misconceptions: students think algorithms are just computer programs, or they mix up flowchart shapes.`,
    programming: `The topic is Programming Constructs. Key concepts: sequence (lines run in order), selection (if/else decisions), iteration (loops — for and while), variables (storing data). Common misconceptions: students think loops run simultaneously rather than one at a time, or they confuse = (assignment) with == (comparison).`,
    boolean: `The topic is Boolean Logic & Logic Gates. Key concepts: TRUE/FALSE values, AND gate, OR gate, NOT gate, truth tables. Common misconceptions: students confuse AND (both must be true) with OR (at least one must be true), and struggle to see real-world applications.`,
    python: `The topic is Python / Small Basic coding. Key concepts: print(), input(), variables, if/elif/else, for loops, while loops, basic syntax rules. Common misconceptions: students forget colons after if/for/while, indent errors, confusing str and int types.`,
  };

  const adaptationByLevel = {
    1: `The student has ${masteryPct}% mastery — they are at the REMEMBER stage. Explain from absolute scratch. Use the simplest possible analogy. Check understanding with a very basic question at the end. Never assume prior knowledge. Think: how would you explain this to someone who has never touched a computer before?`,
    2: `The student has ${masteryPct}% mastery — they are at the UNDERSTAND stage. They know the basics but can't explain it yet. Help them make sense of WHY things work, not just what they are. Use an analogy and then connect it back to the concept. End with a question that tests understanding.`,
    3: `The student has ${masteryPct}% mastery — they are at the APPLY stage. They understand the concept, now they need to use it. Give a worked example or small challenge. Encourage them to try something themselves. Ask them to predict what would happen if something changed.`,
    4: `The student has ${masteryPct}% mastery — they are at the ANALYSE stage. They can apply it, now push them to spot patterns and connections. Ask them to compare, spot errors, or explain what would break. Use slightly more technical language but keep it accessible.`,
    5: `The student has ${masteryPct}% mastery — they are at the EVALUATE stage. They have strong mastery. Challenge them with edge cases, real-world design decisions, or "what would you do differently and why?" questions. Treat them as a capable thinker.`,
  };

  return `${basePersonality}

TOPIC CONTEXT:
${topicContext[topic] || ""}

STUDENT LEVEL:
Bloom's taxonomy level ${bloomsLevel} (${bloomsLabel}). ${adaptationByLevel[bloomsLevel]}

RULES:
- Always stay on topic: ${topicLabel}
- If a student asks something off-topic, gently redirect them back
- If they seem frustrated, acknowledge it and try a different angle
- Use UK English spelling throughout (colour not color, programme not program)
- When showing code, always use Python unless they ask for something else
- Never give the full answer to a homework/test question — guide them to the answer instead
- End most responses with a question or small challenge to keep them engaged`;
};

const AITutor = ({ studentMastery = {}, studentName = "Student" }) => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [masteryOverride, setMasteryOverride] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const currentMastery =
    masteryOverride ??
    (selectedTopic ? studentMastery[selectedTopic] ?? 25 : 25);
  const bloomsLevel = getBloomsLevel(currentMastery);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectTopic = (topicId) => {
    setSelectedTopic(topicId);
    setMasteryOverride(null);
    const topic = TOPICS.find((t) => t.id === topicId);
    const mastery = studentMastery[topicId] ?? 25;
    const level = getBloomsLevel(mastery);
    const greeting =
      level === 1
        ? `Hi ${studentName}! Let's start from the very beginning with ${topic.label}. There's no such thing as a silly question here — ask me anything! What would you like to know first?`
        : level <= 2
        ? `Hey ${studentName}! You've made a start with ${topic.label}. Let's build on what you know. What's been confusing you, or shall I explain something specific?`
        : `Great to see you, ${studentName}! You're doing well with ${topic.label}. Let's go deeper — what would you like to explore or practise?`;

    setMessages([{ role: "assistant", content: greeting }]);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading || !selectedTopic) return;

    const userMessage = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const systemPrompt = buildSystemPrompt(
        selectedTopic,
        bloomsLevel,
        currentMastery
      );

      const apiMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: apiMessages,
        }),
      });

      const data = await response.json();
      const assistantMessage =
        data.content?.[0]?.text ||
        "Sorry, I couldn't get a response. Try again!";

      setMessages([
        ...newMessages,
        { role: "assistant", content: assistantMessage },
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            "Hmm, something went wrong on my end. Give it another go!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetTopic = () => {
    setSelectedTopic(null);
    setMessages([]);
    setInput("");
    setMasteryOverride(null);
  };

  const topic = TOPICS.find((t) => t.id === selectedTopic);

  return (
    <div style={styles.root}>
      {!selectedTopic ? (
        <div style={styles.topicSelect}>
          <div style={styles.tutorHeader}>
            <div style={styles.tutorAvatar}>AI</div>
            <div>
              <h2 style={styles.tutorTitle}>AI Tutor</h2>
              <p style={styles.tutorSub}>
                Choose a topic and I'll explain it at exactly your level
              </p>
            </div>
          </div>

          <div style={styles.topicGrid}>
            {TOPICS.map((t) => {
              const mastery = studentMastery[t.id] ?? 25;
              const level = getBloomsLevel(mastery);
              return (
                <button
                  key={t.id}
                  style={{ ...styles.topicCard, "--accent": t.colour }}
                  onClick={() => selectTopic(t.id)}
                >
                  <span style={styles.topicEmoji}>{t.emoji}</span>
                  <span style={styles.topicName}>{t.label}</span>
                  <div style={styles.topicMeta}>
                    <div style={styles.topicBar}>
                      <div
                        style={{
                          ...styles.topicBarFill,
                          width: `${mastery}%`,
                          background: t.colour,
                        }}
                      />
                    </div>
                    <span style={styles.topicLevel}>
                      {BLOOMS_LABELS[level]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={styles.chatPane}>
          <div style={styles.chatHeader}>
            <button style={styles.backBtn} onClick={resetTopic}>
              ← Topics
            </button>
            <div style={styles.chatTopicInfo}>
              <span style={{ fontSize: 18 }}>{topic.emoji}</span>
              <span style={styles.chatTopicName}>{topic.label}</span>
            </div>
            <div style={styles.levelBadge}>
              <span
                style={{
                  ...styles.levelDot,
                  background: topic.colour,
                }}
              />
              {BLOOMS_LABELS[bloomsLevel]}
            </div>
          </div>

          <div style={styles.masterySlider}>
            <span style={styles.sliderLabel}>
              Mastery: {masteryOverride ?? currentMastery}%
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={masteryOverride ?? currentMastery}
              onChange={(e) => setMasteryOverride(Number(e.target.value))}
              style={styles.slider}
            />
            <span style={styles.sliderHint}>
              Adjust to preview different levels
            </span>
          </div>

          <div style={styles.messages}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  ...styles.messageBubble,
                  ...(m.role === "user"
                    ? styles.userBubble
                    : styles.assistantBubble),
                }}
              >
                {m.role === "assistant" && (
                  <div style={styles.aiBadge}>AI</div>
                )}
                <p style={styles.messageText}>{m.content}</p>
              </div>
            ))}
            {loading && (
              <div style={{ ...styles.messageBubble, ...styles.assistantBubble }}>
                <div style={styles.aiBadge}>AI</div>
                <div style={styles.typingDots}>
                  <span style={styles.dot} />
                  <span style={{ ...styles.dot, animationDelay: "0.2s" }} />
                  <span style={{ ...styles.dot, animationDelay: "0.4s" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={styles.inputRow}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about this topic..."
              style={styles.textarea}
              rows={2}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              style={{
                ...styles.sendBtn,
                opacity: !input.trim() || loading ? 0.4 : 1,
              }}
            >
              →
            </button>
          </div>

          <div style={styles.quickPrompts}>
            {[
              "Explain this from scratch",
              "Give me an example",
              "Why does this matter?",
              "Test me on this",
            ].map((p) => (
              <button
                key={p}
                style={styles.quickBtn}
                onClick={() => {
                  setInput(p);
                  inputRef.current?.focus();
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  root: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    background: "#0a0e1a",
    color: "#e8eaf0",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.08)",
    overflow: "hidden",
    minHeight: 500,
  },
  topicSelect: {
    padding: 28,
  },
  tutorHeader: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 28,
  },
  tutorAvatar: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #00e5a0, #0099ff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    fontWeight: 700,
    color: "#0a0e1a",
    flexShrink: 0,
  },
  tutorTitle: {
    fontSize: 22,
    fontWeight: 700,
    margin: "0 0 4px",
    color: "#f0f2f8",
    letterSpacing: "-0.5px",
  },
  tutorSub: {
    fontSize: 14,
    color: "rgba(232,234,240,0.5)",
    margin: 0,
  },
  topicGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: 12,
  },
  topicCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: "16px",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.2s",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    color: "#e8eaf0",
  },
  topicEmoji: {
    fontSize: 24,
    display: "block",
    marginBottom: 4,
  },
  topicName: {
    fontSize: 14,
    fontWeight: 600,
    color: "#f0f2f8",
    lineHeight: 1.4,
    letterSpacing: "-0.2px",
  },
  topicMeta: {
    marginTop: 4,
  },
  topicBar: {
    height: 3,
    background: "rgba(255,255,255,0.08)",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 6,
  },
  topicBarFill: {
    height: "100%",
    borderRadius: 2,
    transition: "width 0.6s ease",
  },
  topicLevel: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 0.5,
    color: "rgba(232,234,240,0.4)",
    textTransform: "uppercase",
  },
  chatPane: {
    display: "flex",
    flexDirection: "column",
    height: 600,
  },
  chatHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 20px",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    background: "rgba(255,255,255,0.02)",
  },
  backBtn: {
    background: "none",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "rgba(232,234,240,0.6)",
    borderRadius: 8,
    padding: "6px 12px",
    fontSize: 13,
    cursor: "pointer",
    flexShrink: 0,
  },
  chatTopicInfo: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  chatTopicName: {
    fontSize: 14,
    fontWeight: 600,
    color: "#f0f2f8",
    letterSpacing: "-0.2px",
  },
  levelBadge: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    fontWeight: 600,
    color: "rgba(232,234,240,0.5)",
    letterSpacing: 0.3,
    flexShrink: 0,
  },
  levelDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    flexShrink: 0,
  },
  masterySlider: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 20px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    background: "rgba(255,255,255,0.01)",
  },
  sliderLabel: {
    fontSize: 12,
    color: "rgba(232,234,240,0.5)",
    flexShrink: 0,
    width: 90,
  },
  slider: {
    flex: 1,
    accentColor: "#00e5a0",
    cursor: "pointer",
  },
  sliderHint: {
    fontSize: 11,
    color: "rgba(232,234,240,0.3)",
    flexShrink: 0,
    width: 140,
    textAlign: "right",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  messageBubble: {
    maxWidth: "80%",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  userBubble: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  assistantBubble: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  aiBadge: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1,
    color: "#00e5a0",
    background: "rgba(0,229,160,0.1)",
    border: "1px solid rgba(0,229,160,0.2)",
    borderRadius: 4,
    padding: "2px 6px",
    width: "fit-content",
  },
  messageText: {
    fontSize: 14,
    lineHeight: 1.7,
    margin: 0,
    padding: "10px 14px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#e8eaf0",
    whiteSpace: "pre-wrap",
  },
  typingDots: {
    display: "flex",
    gap: 4,
    padding: "12px 16px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#00e5a0",
    display: "inline-block",
    animation: "bounce 1.2s infinite",
  },
  inputRow: {
    display: "flex",
    gap: 8,
    padding: "12px 20px",
    borderTop: "1px solid rgba(255,255,255,0.07)",
    background: "rgba(255,255,255,0.02)",
  },
  textarea: {
    flex: 1,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: "10px 14px",
    color: "#e8eaf0",
    fontSize: 14,
    lineHeight: 1.5,
    resize: "none",
    outline: "none",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },
  sendBtn: {
    background: "#00e5a0",
    color: "#0a0e1a",
    border: "none",
    borderRadius: 10,
    width: 44,
    fontSize: 20,
    fontWeight: 700,
    cursor: "pointer",
    transition: "opacity 0.2s",
    flexShrink: 0,
  },
  quickPrompts: {
    display: "flex",
    gap: 8,
    padding: "10px 20px 16px",
    flexWrap: "wrap",
  },
  quickBtn: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: "6px 14px",
    fontSize: 12,
    color: "rgba(232,234,240,0.6)",
    cursor: "pointer",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    transition: "all 0.2s",
  },
};

export default AITutor;
