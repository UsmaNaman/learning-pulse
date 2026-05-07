import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("teachers");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const teacherFeatures = [
    {
      icon: "⚡",
      title: "Risk Flagging",
      desc: "Students automatically flagged Low / Medium / High risk based on performance and engagement. Know who needs intervention before it's too late.",
    },
    {
      icon: "📊",
      title: "Class At A Glance",
      desc: "See every student's mastery %, points, streaks, and skill level in one dashboard. No spreadsheets. No guesswork.",
    },
    {
      icon: "🎯",
      title: "Topic Drill-Down",
      desc: "Expand any student to see exactly which topics they're struggling with — Algorithms, Boolean Logic, Networks and more.",
    },
    {
      icon: "📋",
      title: "Ofsted-Ready Reports",
      desc: "Individual student profiles with topic-by-topic breakdowns. Evidence of intervention at your fingertips.",
    },
  ];

  const studentFeatures = [
    {
      icon: "🏆",
      title: "Points & Streaks",
      desc: "Earn mastery points and keep your daily learning streak alive. CS doesn't have to be boring.",
    },
    {
      icon: "🧠",
      title: "Bloom's Taxonomy Quizzes",
      desc: "Assessments that build from recall all the way up to evaluation — so you actually understand it, not just memorise it.",
    },
    {
      icon: "📈",
      title: "See Your Progress",
      desc: "Watch your mastery grow across every KS3/KS4 topic. Know exactly where you're strong and where to focus.",
    },
    {
      icon: "📚",
      title: "Resources That Make Sense",
      desc: "Videos, interactive activities, and worksheets for every topic — designed for how you actually learn.",
    },
  ];

  const topics = [
    "Algorithms",
    "Programming Constructs",
    "Data Representation",
    "Computer Systems",
    "Networks",
    "Boolean Logic",
    "E-Safety & Ethics",
    "Problem Solving",
    "Data Handling",
    "Programming Languages",
  ];

  return (
    <div style={styles.root}>
      {/* Animated background grid */}
      <div style={styles.gridBg} />

      {/* Nav */}
      <nav style={{ ...styles.nav, ...(scrolled ? styles.navScrolled : {}) }}>
        <div style={styles.navInner}>
          <div style={styles.logo}>
            <span style={styles.logoPulse}>Learning</span>
            <span style={styles.logoAccent}>Pulse</span>
            <span style={styles.betaBadge}>BETA</span>
          </div>
          <div style={styles.navLinks}>
            <a href="#features" style={styles.navLink}>Features</a>
            <a href="#topics" style={styles.navLink}>Topics</a>
            <button style={styles.navCta} onClick={() => navigate('/login')}>
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={styles.hero}>
        <div
          style={{
            ...styles.heroContent,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(32px)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div style={styles.heroBadge}>
            🇬🇧 Built for KS3 & KS4 Computer Science in England
          </div>

          <h1 style={styles.heroTitle}>
            Know exactly who
            <br />
            <span style={styles.heroTitleAccent}>gets it</span> — and who
            doesn't.
          </h1>

          <p style={styles.heroSub}>
            Learning Pulse gives CS teachers real-time visibility into every
            student's understanding. For students, it makes Computer Science
            actually make sense.
          </p>

          <div style={styles.heroCtas}>
            <button
              style={styles.ctaPrimary}
              onClick={() => navigate('/register?role=teacher')}
            >
              I'm a Teacher →
            </button>
            <button
              style={styles.ctaSecondary}
              onClick={() => navigate('/register?role=student')}
            >
              I'm a Student →
            </button>
          </div>

          <p style={styles.heroSmall}>
            Free during beta · No credit card · OCR & AQA aligned
          </p>
        </div>

        {/* Hero visual */}
        <div
          style={{
            ...styles.heroVisual,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(40px)",
            transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
          }}
        >
          <div style={styles.dashCard}>
            <div style={styles.dashHeader}>
              <span style={styles.dashTitle}>Class Overview</span>
              <span style={styles.dashMeta}>Year 9 CS · Period 3</span>
            </div>
            {[
              { name: "Aisha K.", mastery: 84, risk: "low", streak: 7 },
              { name: "Tyler M.", mastery: 41, risk: "high", streak: 0 },
              { name: "Priya S.", mastery: 67, risk: "medium", streak: 3 },
              { name: "Josh B.", mastery: 92, risk: "low", streak: 12 },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  ...styles.studentRow,
                  animationDelay: `${0.4 + i * 0.1}s`,
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateX(0)" : "translateX(20px)",
                  transition: `all 0.6s ease ${0.5 + i * 0.1}s`,
                }}
              >
                <div style={styles.studentAvatar}>
                  {s.name.charAt(0)}
                </div>
                <div style={styles.studentInfo}>
                  <span style={styles.studentName}>{s.name}</span>
                  <div style={styles.progressBar}>
                    <div
                      style={{
                        ...styles.progressFill,
                        width: `${s.mastery}%`,
                        background:
                          s.mastery > 70
                            ? "#00e5a0"
                            : s.mastery > 50
                            ? "#ffd166"
                            : "#ff6b6b",
                      }}
                    />
                  </div>
                </div>
                <span style={styles.masteryPct}>{s.mastery}%</span>
                <span
                  style={{
                    ...styles.riskBadge,
                    background:
                      s.risk === "low"
                        ? "#00e5a022"
                        : s.risk === "medium"
                        ? "#ffd16622"
                        : "#ff6b6b22",
                    color:
                      s.risk === "low"
                        ? "#00e5a0"
                        : s.risk === "medium"
                        ? "#ffd166"
                        : "#ff6b6b",
                  }}
                >
                  {s.risk}
                </span>
                <span style={styles.streak}>🔥 {s.streak}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div style={styles.statsBar}>
        {[
          { val: "10", label: "CS Topics Covered" },
          { val: "OCR", label: "& AQA Aligned" },
          { val: "KS3", label: "& KS4 Ready" },
          { val: "Free", label: "During Beta" },
        ].map((s, i) => (
          <div key={i} style={styles.statItem}>
            <span style={styles.statVal}>{s.val}</span>
            <span style={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Features */}
      <section id="features" style={styles.section}>
        <div style={styles.sectionInner}>
          <div style={styles.sectionTag}>Features</div>
          <h2 style={styles.sectionTitle}>Built for both sides of the classroom</h2>

          {/* Tab toggle */}
          <div style={styles.tabRow}>
            <button
              style={{
                ...styles.tab,
                ...(activeTab === "teachers" ? styles.tabActive : {}),
              }}
              onClick={() => setActiveTab("teachers")}
            >
              👩‍🏫 For Teachers
            </button>
            <button
              style={{
                ...styles.tab,
                ...(activeTab === "students" ? styles.tabActive : {}),
              }}
              onClick={() => setActiveTab("students")}
            >
              🎓 For Students
            </button>
          </div>

          <div style={styles.featureGrid}>
            {(activeTab === "teachers" ? teacherFeatures : studentFeatures).map(
              (f, i) => (
                <div key={i} style={styles.featureCard}>
                  <span style={styles.featureIcon}>{f.icon}</span>
                  <h3 style={styles.featureTitle}>{f.title}</h3>
                  <p style={styles.featureDesc}>{f.desc}</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Topics */}
      <section id="topics" style={styles.topicsSection}>
        <div style={styles.sectionInner}>
          <div style={styles.sectionTag}>Curriculum</div>
          <h2 style={styles.sectionTitle}>Full KS3 & KS4 coverage</h2>
          <p style={styles.sectionSub}>
            Every topic mapped to OCR and AQA specifications — so it fits straight into your scheme of work.
          </p>
          <div style={styles.topicGrid}>
            {topics.map((t, i) => (
              <div key={i} style={styles.topicChip}>
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaInner}>
          <div style={styles.ctaGlow} />
          <h2 style={styles.ctaTitle}>
            Ready to see who's actually keeping up?
          </h2>
          <p style={styles.ctaSub}>
            Free during beta. No setup fee. No commitment.
            <br />
            Just sign up and see your class differently.
          </p>
          <div style={styles.heroCtas}>
            <button
              style={styles.ctaPrimary}
              onClick={() => navigate('/register?role=teacher')}
            >
              Get Started as a Teacher →
            </button>
            <button
              style={styles.ctaSecondary}
              onClick={() => navigate('/register?role=student')}
            >
              Join as a Student →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div style={styles.logo}>
            <span style={styles.logoPulse}>Learning</span>
            <span style={styles.logoAccent}>Pulse</span>
          </div>
          <p style={styles.footerText}>
            Built by a CS teacher, for CS teachers. 🇬🇧
          </p>
          <p style={styles.footerSmall}>
            Aligned with OCR J277 & AQA 8525 · KS3 & KS4 · England
          </p>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  root: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    background: "#0a0e1a",
    color: "#e8eaf0",
    minHeight: "100vh",
    overflowX: "hidden",
    position: "relative",
  },
  gridBg: {
    position: "fixed",
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(99, 179, 237, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99, 179, 237, 0.03) 1px, transparent 1px)
    `,
    backgroundSize: "48px 48px",
    pointerEvents: "none",
    zIndex: 0,
  },
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    padding: "20px 0",
    transition: "all 0.3s ease",
  },
  navScrolled: {
    background: "rgba(10, 14, 26, 0.92)",
    backdropFilter: "blur(12px)",
    padding: "14px 0",
    borderBottom: "1px solid rgba(99, 179, 237, 0.1)",
  },
  navInner: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: "-0.5px",
  },
  logoPulse: {
    color: "#e8eaf0",
  },
  logoAccent: {
    color: "#00e5a0",
  },
  betaBadge: {
    marginLeft: 8,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1.5,
    color: "#00e5a0",
    background: "rgba(0, 229, 160, 0.12)",
    border: "1px solid rgba(0, 229, 160, 0.3)",
    borderRadius: 4,
    padding: "2px 6px",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: 32,
  },
  navLink: {
    color: "rgba(232, 234, 240, 0.6)",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
    transition: "color 0.2s",
  },
  navCta: {
    background: "rgba(0, 229, 160, 0.1)",
    border: "1px solid rgba(0, 229, 160, 0.4)",
    color: "#00e5a0",
    borderRadius: 8,
    padding: "8px 20px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  hero: {
    position: "relative",
    zIndex: 1,
    maxWidth: 1100,
    margin: "0 auto",
    padding: "140px 32px 80px",
    display: "flex",
    alignItems: "center",
    gap: 60,
  },
  heroContent: {
    flex: "0 0 480px",
  },
  heroBadge: {
    display: "inline-block",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: 0.5,
    color: "rgba(232,234,240,0.5)",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: "6px 14px",
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 52,
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: "-1.5px",
    margin: "0 0 20px",
    color: "#f0f2f8",
  },
  heroTitleAccent: {
    color: "#00e5a0",
    position: "relative",
  },
  heroSub: {
    fontSize: 17,
    lineHeight: 1.7,
    color: "rgba(232,234,240,0.6)",
    margin: "0 0 36px",
    maxWidth: 420,
  },
  heroCtas: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 20,
  },
  ctaPrimary: {
    background: "#00e5a0",
    color: "#0a0e1a",
    border: "none",
    borderRadius: 10,
    padding: "14px 28px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s",
    letterSpacing: "-0.3px",
  },
  ctaSecondary: {
    background: "rgba(255,255,255,0.06)",
    color: "#e8eaf0",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 10,
    padding: "14px 28px",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
    letterSpacing: "-0.3px",
  },
  heroSmall: {
    fontSize: 12,
    color: "rgba(232,234,240,0.35)",
    margin: 0,
    letterSpacing: 0.3,
  },
  heroVisual: {
    flex: 1,
    minWidth: 0,
  },
  dashCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 24,
    backdropFilter: "blur(8px)",
    boxShadow: "0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,229,160,0.05)",
  },
  dashHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottom: "1px solid rgba(255,255,255,0.07)",
  },
  dashTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#e8eaf0",
    letterSpacing: "-0.3px",
  },
  dashMeta: {
    fontSize: 11,
    color: "rgba(232,234,240,0.4)",
    fontWeight: 500,
  },
  studentRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 0",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
  },
  studentAvatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #00e5a0, #0099ff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 700,
    color: "#0a0e1a",
    flexShrink: 0,
  },
  studentInfo: {
    flex: 1,
    minWidth: 0,
  },
  studentName: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#e8eaf0",
    marginBottom: 5,
  },
  progressBar: {
    height: 4,
    background: "rgba(255,255,255,0.08)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
    transition: "width 1s ease",
  },
  masteryPct: {
    fontSize: 13,
    fontWeight: 700,
    color: "#e8eaf0",
    flexShrink: 0,
    width: 36,
    textAlign: "right",
  },
  riskBadge: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    borderRadius: 4,
    padding: "3px 8px",
    flexShrink: 0,
  },
  streak: {
    fontSize: 12,
    flexShrink: 0,
    color: "rgba(232,234,240,0.5)",
  },
  statsBar: {
    position: "relative",
    zIndex: 1,
    borderTop: "1px solid rgba(255,255,255,0.06)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(255,255,255,0.02)",
    display: "flex",
    justifyContent: "center",
    gap: 0,
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "28px 60px",
    borderRight: "1px solid rgba(255,255,255,0.06)",
  },
  statVal: {
    fontSize: 28,
    fontWeight: 800,
    color: "#00e5a0",
    letterSpacing: "-1px",
    lineHeight: 1,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(232,234,240,0.4)",
    fontWeight: 500,
    letterSpacing: 0.3,
  },
  section: {
    position: "relative",
    zIndex: 1,
    padding: "100px 0",
  },
  topicsSection: {
    position: "relative",
    zIndex: 1,
    padding: "100px 0",
    background: "rgba(255,255,255,0.01)",
  },
  sectionInner: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 32px",
  },
  sectionTag: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#00e5a0",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 40,
    fontWeight: 800,
    letterSpacing: "-1px",
    margin: "0 0 16px",
    color: "#f0f2f8",
    lineHeight: 1.15,
  },
  sectionSub: {
    fontSize: 16,
    color: "rgba(232,234,240,0.5)",
    marginBottom: 48,
    maxWidth: 560,
    lineHeight: 1.7,
  },
  tabRow: {
    display: "flex",
    gap: 8,
    marginBottom: 48,
  },
  tab: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "rgba(232,234,240,0.5)",
    borderRadius: 8,
    padding: "10px 24px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  tabActive: {
    background: "rgba(0, 229, 160, 0.1)",
    border: "1px solid rgba(0, 229, 160, 0.4)",
    color: "#00e5a0",
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 20,
  },
  featureCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: 28,
    transition: "all 0.2s",
  },
  featureIcon: {
    fontSize: 28,
    display: "block",
    marginBottom: 14,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: "#f0f2f8",
    margin: "0 0 10px",
    letterSpacing: "-0.4px",
  },
  featureDesc: {
    fontSize: 14,
    color: "rgba(232,234,240,0.5)",
    lineHeight: 1.7,
    margin: 0,
  },
  topicGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
  },
  topicChip: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: "8px 18px",
    fontSize: 13,
    fontWeight: 600,
    color: "rgba(232,234,240,0.7)",
    letterSpacing: "-0.2px",
  },
  ctaSection: {
    position: "relative",
    zIndex: 1,
    padding: "120px 32px",
    textAlign: "center",
  },
  ctaInner: {
    maxWidth: 640,
    margin: "0 auto",
    position: "relative",
  },
  ctaGlow: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    height: 400,
    background: "radial-gradient(circle, rgba(0,229,160,0.08) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  ctaTitle: {
    fontSize: 40,
    fontWeight: 800,
    letterSpacing: "-1px",
    margin: "0 0 20px",
    color: "#f0f2f8",
    lineHeight: 1.2,
    position: "relative",
  },
  ctaSub: {
    fontSize: 16,
    color: "rgba(232,234,240,0.5)",
    lineHeight: 1.7,
    marginBottom: 40,
    position: "relative",
  },
  footer: {
    position: "relative",
    zIndex: 1,
    borderTop: "1px solid rgba(255,255,255,0.06)",
    padding: "48px 32px",
    textAlign: "center",
  },
  footerInner: {
    maxWidth: 1100,
    margin: "0 auto",
  },
  footerText: {
    fontSize: 14,
    color: "rgba(232,234,240,0.35)",
    margin: "16px 0 8px",
  },
  footerSmall: {
    fontSize: 12,
    color: "rgba(232,234,240,0.2)",
    margin: 0,
    letterSpacing: 0.3,
  },
};

export default HomePage;
