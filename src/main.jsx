import React, { useEffect, useRef, useState, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { ArrowUpRight, GithubLogo, XLogo } from "@phosphor-icons/react";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/jetbrains-mono";
import "./styles.css";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    id: "01",
    tag: "Low-resource NLP · Research",
    title: "Telugu Diffusion LM",
    punch:
      "82 million speakers.\nZero diffusion language models.\nI built the first one.",
    story:
      "Converted AI4Bharat/IndicBERT into a diffusion architecture for Telugu — an approach that didn't exist for any Indian language. Building V2: 90M params, runs on a 6-year-old phone, with tool calling.",
    numbers: [
      { v: "1st", l: "Indic diffusion LM" },
      { v: "11", l: "downloads" },
      { v: "V2", l: "in progress" },
    ],
    stack: ["HuggingFace", "IndicBERT", "Diffusion LM", "Indic NLP"],
    link: "https://huggingface.co/Prahaladha/telugu-diffusion-lm",
    dotColor: "#c44a2a",
  },
  {
    id: "02",
    tag: "Neuromarketing · Computer Vision",
    title: "VinD — Neural Focus Group",
    punch:
      "Your brain knows which frame grabbed you.\nNow I can measure it.",
    story:
      "Built on Meta FAIR's TRIBE v2 fMRI foundation model. Maps 20K+ predicted brain points into 400 regions, tracks 7 networks, classifies every second: eyes locked, feeling it, zoning out. Replaces costly focus groups.",
    numbers: [
      { v: "20K+", l: "brain points" },
      { v: "7", l: "networks" },
      { v: "400", l: "regions" },
    ],
    stack: ["TRIBE v2", "fMRI Data", "Python", "Brain Networks"],
    link: "https://github.com/Prahaladha-Reddy/VinD",
    dotColor: "#5a7b99",
  },
  {
    id: "03",
    tag: "Developer Tools · EdTech",
    title: "TeachMe",
    punch:
      "You don't learn to code by reading.\nYou learn by breaking things.",
    story:
      "A VS Code extension that teaches inside the editor. Debug Labs pulls real open-source repos, injects bugs, dares you to find them. Spaced repetition from your own syllabus. No passive reading — production-grade code from day one.",
    numbers: [
      { v: "3", l: "learning modes" },
      { v: "∞", l: "real repos" },
      { v: "0", l: "passive reading" },
    ],
    stack: ["VS Code API", "TypeScript", "Spaced Repetition", "Git"],
    link: "https://github.com/Prahaladha-Reddy/Teach-Me",
    dotColor: "#3a8a4a",
  },
];

const WORK = [
  {
    id: "kairos",
    co: "Kairos.Computer",
    badge: "Backed by Afore Capital",
    role: "AI Engineering Intern",
    period: "Dec 2025 – Present",
    bullets: [
      "Production agentic workflows: browser agent, presentation agent, eval suite built from real production failures",
      "LiveKit voice agent with Gemini Live + OpenAI Realtime APIs, Twilio/SIP, Pinecone task search",
      "LanceDB code-artifact storage with Gemini embeddings; OpenCode CLI supervisor with SSE streaming + Convex backend",
      "Talked with customers, ran demos for leaders",
    ],
  },
  {
    id: "noble",
    co: "Noble Thoughts",
    badge: "EdTech",
    role: "AI Intern",
    period: "Mar – Jun 2025",
    bullets: [
      "LangGraph agentic memory systems for personalized education — 35% improvement in recommendations",
      "Multimodal RAG pipeline for YouTube: transcript + image chunking, context-aware QA using FAISS + ChromaDB",
    ],
  },
];

const STACK_GROUPS = [
  {
    label: "Languages",
    items: ["Python", "JavaScript", "TypeScript", "React", "Next.js"],
  },
  {
    label: "AI / LLMs",
    items: [
      "LangGraph",
      "LangChain",
      "OpenAI",
      "Anthropic",
      "Gemini",
      "HuggingFace",
    ],
  },
  {
    label: "Vector / Storage",
    items: ["FAISS", "ChromaDB", "LanceDB", "Pinecone", "Qdrant"],
  },
  {
    label: "Infra",
    items: ["AWS S3+SQS", "Convex", "LiveKit", "Twilio", "Docker", "Playwright"],
  },
  {
    label: "Agentic",
    items: ["Multi-agent", "MCP/A2A", "SSE Streaming", "Browser Agents", "OSWorld"],
  },
  {
    label: "Research",
    items: ["spaCy", "Docling", "Indic NLP", "fMRI / TRIBE v2", "Diffusion LMs"],
  },
];

// ─── DOT FIELD — generates the scattered dots pattern (ASCII art inspiration)
// Lightweight: just CSS box-shadows via inline styles, no canvas
function DotField({ color = "#c44a2a", density = 0.25, seed = 1 }) {
  const dots = useMemo(() => {
    const cols = 28;
    const rows = 16;
    const result = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Seeded pseudo-random
        const hash =
          (((r * cols + c + 1) * 2246822519 + seed * 2654435761) >>> 0) % 1000;
        const v = hash / 1000;
        if (v > 1 - density) {
          result.push({
            x: `${(c / cols) * 100}%`,
            y: `${(r / rows) * 100}%`,
            op: 0.15 + v * 0.5,
            size: 1.5 + v * 2,
          });
        }
      }
    }
    return result;
  }, [color, density, seed]);

  return (
    <div className="bento-dots" aria-hidden="true">
      {dots.map((d, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: d.x,
            top: d.y,
            width: d.size + "px",
            height: d.size + "px",
            borderRadius: "50%",
            background: color,
            opacity: d.op,
            transition: "transform 0.5s, opacity 0.5s",
          }}
        />
      ))}
    </div>
  );
}

// ─── TEXT SCRAMBLE ─────────────────────────────────────────────────────────────
function useScramble(text, active) {
  const [out, setOut] = useState(text);
  const CHARS = "@#%&*=+-<>?/|~;:01";

  useEffect(() => {
    if (!active) {
      setOut(text);
      return;
    }
    let it = 0;
    const total = text.length * 2;
    const iv = setInterval(() => {
      setOut(
        text
          .split("")
          .map((ch, i) => {
            if (ch === " " || ch === "\n") return ch;
            if (i < it / 2) return text[i];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );
      it++;
      if (it >= total) clearInterval(iv);
    }, 25);
    return () => clearInterval(iv);
  }, [active, text]);

  return out;
}

// ─── REVEAL HOOK ──────────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll("[data-reveal]");
    if (!nodes.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        });
      },
      { threshold: 0.06 }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
}

// ─── APP ──────────────────────────────────────────────────────────────────────
function App() {
  useReveal();
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <main id="main">
        <Nav />
        <Hero />
        <ProjectsSec />
        <WorkSec />
        <StackSec />
        <ContactSec />
        <Footer />
      </main>
    </>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav() {
  return (
    <nav className="nav">
      <a className="nav-brand" href="#main">
        PRAHALAD REDDY
      </a>
      <div className="nav-links">
        <a href="#projects">Work</a>
        <a href="#experience">Experience</a>
        <a href="#stack">Stack</a>
        <a
          href="https://github.com/Prahaladha-Reddy"
          target="_blank"
          rel="noopener"
          aria-label="GitHub"
        >
          <GithubLogo weight="bold" />
        </a>
        <a
          href="https://x.com/PrahaladReddyB"
          target="_blank"
          rel="noopener"
          aria-label="X"
        >
          <XLogo weight="bold" />
        </a>
        <a
          className="nav-contact"
          href="mailto:prahaladhareddyboreddy@gmail.com"
        >
          Contact
        </a>
      </div>
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="hero">
      {/* Left: Identity */}
      <div className="hero-left">
        <div className="hero-dots" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />

        <div data-reveal>
          <p className="hero-tag">AI Engineer · ECE '26 · RGUKT</p>
          <h1 className="hero-name">
            Prahalad
            <br />
            Reddy
            <span className="hero-name-sub">
              building things that don't exist yet
            </span>
          </h1>
          <p className="hero-bio">
            Voice agents at Kairos.Computer, backed by Afore Capital. A neural
            focus group simulator. The first Telugu diffusion LM. In production,
            as a student.
          </p>
          <div className="hero-ctas">
            <a className="btn btn-fill" href="#projects" id="hero-cta">
              See the work <ArrowUpRight weight="bold" />
            </a>
            <a
              className="btn btn-ghost"
              href="mailto:prahaladhareddyboreddy@gmail.com"
            >
              prahaladhareddyboreddy@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Right: Contemplative — poem + data */}
      <div className="hero-right">
        <div className="hero-poem" data-reveal style={{ "--delay": "200ms" }}>
          <p>
            the screen glows.
            <br />
            behind it, <em>an ocean</em>.
            <br />
            82 million voices
            <br />
            without a language model.
            <br />
            <br />
            20,000 points in the brain
            <br />
            mapping what an ad makes you <em>feel</em>.
            <br />
            <br />
            a voice agent that listens,
            <br />
            thinks, <em>acts</em>.
            <br />
            <br />
            all shipped before graduation.
          </p>
        </div>

        <div className="hero-stats" data-reveal style={{ "--delay": "400ms" }}>
          <div className="hero-stat">
            <div className="hero-stat-value">1st</div>
            <div className="hero-stat-label">Indic Diffusion LM</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">20K+</div>
            <div className="hero-stat-label">Brain Points Mapped</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">35%</div>
            <div className="hero-stat-label">Better Recs</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PROJECTS (Bento Grid) ────────────────────────────────────────────────────
function BentoCard({ p, i }) {
  const [hovered, setHovered] = useState(false);
  const title = useScramble(p.title, hovered);

  return (
    <article
      className="bento-card"
      id={`proj-${p.id}`}
      data-reveal
      style={{ "--delay": `${i * 120}ms`, "--accent-color": p.dotColor }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <DotField color={p.dotColor} density={0.2} seed={parseInt(p.id) * 7} />

      <div className="bento-content">
        <span className="bento-eyebrow">{p.tag}</span>
        <span className="bento-id">{p.id}</span>

        <h3 className="bento-title">{title}</h3>
        <p className="bento-punch">{p.punch}</p>
        <p className="bento-story">{p.story}</p>

        <div className="bento-footer">
          <div className="bento-numbers">
            {p.numbers.map((n) => (
              <div key={n.l} className="bnum">
                <span className="bnum-value">{n.v}</span>
                <span className="bnum-label">{n.l}</span>
              </div>
            ))}
          </div>
          <div className="bento-tags">
            {p.stack.map((s) => (
              <span key={s} className="btag">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <a
        href={p.link}
        target="_blank"
        rel="noopener"
        className="bento-link"
        aria-label={`View ${p.title}`}
      >
        View <ArrowUpRight weight="bold" />
      </a>
    </article>
  );
}

function ProjectsSec() {
  return (
    <section className="projects-sec" id="projects">
      <div className="projects-head">
        <div className="projects-head-left" data-reveal>
          <p
            className="bento-eyebrow"
            style={{ color: "var(--ember)", marginBottom: "0.8rem" }}
          >
            Selected Work
          </p>
          <h2>
            Things I built
            <br />
            that didn't exist.
          </h2>
        </div>
        <div className="projects-head-right" data-reveal style={{ "--delay": "150ms" }}>
          <p className="projects-head-note">
            Not side projects. Not tutorials. Real research, real production,
            real impact.
          </p>
        </div>
      </div>

      <div className="bento">
        {PROJECTS.map((p, i) => (
          <BentoCard key={p.id} p={p} i={i} />
        ))}
      </div>
    </section>
  );
}

// ─── WORK ─────────────────────────────────────────────────────────────────────
function WorkSec() {
  return (
    <section className="work-sec" id="experience">
      <div className="work-left" data-reveal>
        <p
          className="bento-eyebrow"
          style={{ color: "var(--ember)", marginBottom: "0.8rem" }}
        >
          Experience
        </p>
        <h2>
          Where I've
          <br />
          shipped.
        </h2>
      </div>

      <div className="work-right">
        {WORK.map((w) => (
          <div className="work-role" key={w.id} data-reveal>
            <div className="work-role-header">
              <div>
                <div className="work-role-co">{w.co}</div>
                <div className="work-role-title">{w.role}</div>
                <div className="work-role-badge">{w.badge}</div>
              </div>
              <div className="work-role-period">{w.period}</div>
            </div>
            <ul className="work-bullets">
              {w.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── STACK ────────────────────────────────────────────────────────────────────
function StackSec() {
  return (
    <section className="stack-sec" id="stack">
      <div className="stack-head">
        <div className="stack-head-left" data-reveal>
          <p
            className="bento-eyebrow"
            style={{ color: "var(--ember)", marginBottom: "0.8rem" }}
          >
            Technical Stack
          </p>
          <h2>
            The tools
            <br />I think in.
          </h2>
        </div>
        <div className="stack-head-right" />
      </div>

      <div className="stack-list">
        {STACK_GROUPS.map((g, i) => (
          <div
            className="stack-group"
            key={g.label}
            data-reveal
            style={{ "--delay": `${i * 60}ms` }}
          >
            <p className="stack-group-label">{g.label}</p>
            <div className="stack-items">
              {g.items.map((item) => (
                <span key={item} className="stack-item">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────
function ContactSec() {
  return (
    <section className="contact-sec">
      <div className="contact-left" data-reveal>
        <p
          className="bento-eyebrow"
          style={{ color: "var(--ember)", marginBottom: "0.8rem" }}
        >
          Let's build
        </p>
        <h2 className="contact-h2">
          Got something
          <br />
          <em>ambitious?</em>
        </h2>
        <p className="contact-sub">
          I'm a final-year ECE student who ships production AI. Voice agents,
          LLMs for underrepresented languages, neuromarketing tools — I'm not
          afraid of the impossible.
        </p>
        <div className="contact-links">
          <a
            className="btn btn-fill"
            href="mailto:prahaladhareddyboreddy@gmail.com"
            id="contact-cta"
          >
            Send an email <ArrowUpRight weight="bold" />
          </a>
          <a
            className="btn btn-ghost"
            href="https://github.com/Prahaladha-Reddy"
            target="_blank"
            rel="noopener"
          >
            <GithubLogo weight="bold" /> GitHub
          </a>
          <a
            className="btn btn-ghost"
            href="https://x.com/PrahaladReddyB"
            target="_blank"
            rel="noopener"
          >
            <XLogo weight="bold" /> X
          </a>
        </div>
      </div>

      <div className="contact-right" data-reveal style={{ "--delay": "200ms" }}>
        <div className="terminal">
          <div className="term-bar">
            <div className="term-dots">
              <span style={{ background: "#6a2820" }} />
              <span style={{ background: "#6a5418" }} />
              <span style={{ background: "#1e5a2a" }} />
            </div>
            <span className="term-title">prahalad — ~/</span>
          </div>
          <div className="term-body">
            <div className="tl">
              <span className="tp">❯</span>
              <span className="tc">
                git log --oneline --since="6m ago"
              </span>
            </div>
            <div className="tl mt">
              <span className="th">a3f2c1d</span>
              <span className="td">
                {" "}
                feat: livekit voice agent · gemini live + pinecone rag
              </span>
            </div>
            <div className="tl">
              <span className="th">b8e91fa</span>
              <span className="td">
                {" "}
                feat: lancedb artifact store + convex backend
              </span>
            </div>
            <div className="tl">
              <span className="th">c4d72bb</span>
              <span className="td">
                {" "}
                feat: opencode cli supervisor w/ sse streaming
              </span>
            </div>
            <div className="tl">
              <span className="th">d1a930e</span>
              <span className="td">
                {" "}
                research: telugu diffusion lm → huggingface.co
              </span>
            </div>
            <div className="tl">
              <span className="th">e7f44c2</span>
              <span className="td">
                {" "}
                feat: vind · fmri 20k brain state classifier
              </span>
            </div>
            <div className="tl">
              <span className="th">f2b1180</span>
              <span className="td">
                {" "}
                feat: langgraph memory · +35% rec accuracy
              </span>
            </div>
            <div className="tl mt">
              <span className="tp">❯</span>
              <span className="tc blink">_</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <span>© 2025 Prahalad Reddy</span>
      <span>Built with obsession</span>
    </footer>
  );
}

// ─── MOUNT ────────────────────────────────────────────────────────────────────
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
