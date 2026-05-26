import React, {
  useEffect, useRef, useState, useMemo, useCallback,
} from "react";
import { createRoot } from "react-dom/client";
import { ArrowUpRight, GithubLogo, XLogo } from "@phosphor-icons/react";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/jetbrains-mono";
import "./styles.css";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const TICKER_ITEMS = [
  "SHIPPING VOICE AGENTS @ KAIROS.COMPUTER",
  "BUILDING FIRST TELUGU LLM THAT RUNS ON YOUR OLD PHONE",
  "VIND: READING 20K BRAIN POINTS WHILE YOU WATCH ADS",
  "35% BETTER RECOMMENDATIONS · LANGGRAPH MEMORY SYSTEMS",
  "SSE STREAMING · CONVEX BACKEND · OPENCODE CLI SUPERVISOR",
  "BACKED BY AFORE CAPITAL · ECE '26 @ RGUKT",
];

const PROJECTS = [
  {
    id: "01",
    tag: "Low-resource NLP · Research",
    title: "Telugu Diffusion LM",
    punch: "82 million speakers. Zero diffusion language models.\nI built the first one.",
    story:
      "Converted AI4Bharat/IndicBERT into a diffusion architecture for Telugu — an approach that didn't exist for any Indian language. Building V2: 90M params, runs on a 6-year-old phone, with tool calling.",
    numbers: [{ v: "1st", l: "Indic diffusion LM" }, { v: "11", l: "downloads so far" }, { v: "V2", l: "coming soon" }],
    stack: ["HuggingFace", "IndicBERT", "Diffusion LM", "Indic NLP"],
    link: "https://huggingface.co/Prahaladha/telugu-diffusion-lm",
    accent: "#bf3d1c",
    muted:  "#3a1208",
    seed: 7,
  },
  {
    id: "02",
    tag: "Neuromarketing · Computer Vision",
    title: "VinD — Neural Focus Group",
    punch: "Your brain knows which frame of the ad grabbed you.\nNow I can measure it.",
    story:
      "Built on Meta FAIR's TRIBE v2 fMRI foundation model. Maps 20K+ predicted brain points into 400 regions, tracks 7 networks (visual, emotional, attention, social, cognitive, default mode, limbic), classifies every second: eyes locked, feeling it, zoning out. Replaces costly focus groups.",
    numbers: [{ v: "20K+", l: "brain points" }, { v: "7", l: "networks tracked" }, { v: "400", l: "brain regions" }],
    stack: ["TRIBE v2", "fMRI Data", "Python", "Brain Networks"],
    link: "https://github.com/Prahaladha-Reddy/VinD",
    accent: "#2a6660",
    muted:  "#0a2220",
    seed: 13,
  },
  {
    id: "03",
    tag: "Developer Tools · EdTech",
    title: "TeachMe — VS Code Extension",
    punch: "You don't learn to code by reading.\nYou learn by breaking things.",
    story:
      "An extension that teaches inside the editor. Debug Labs pulls real open-source repos, injects bugs, dares you to find them. Spaced repetition from your own syllabus. No passive reading — production-grade code from day one.",
    numbers: [{ v: "3", l: "learning modes" }, { v: "∞", l: "real repos" }, { v: "0", l: "passive reading" }],
    stack: ["VS Code API", "TypeScript", "Spaced Repetition", "Git"],
    link: "https://github.com/Prahaladha-Reddy/Teach-Me",
    accent: "#3d5218",
    muted:  "#151c08",
    seed: 21,
  },
];

const WORK = [
  {
    id: "kairos",
    co: "Kairos.Computer",
    badge: "Backed by Afore Capital · US",
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
  { label: "Languages", items: ["Python", "JavaScript", "TypeScript", "React", "Next.js"] },
  { label: "AI / LLMs", items: ["LangGraph", "LangChain", "OpenAI", "Anthropic", "Gemini", "HuggingFace"] },
  { label: "Vector / Storage", items: ["FAISS", "ChromaDB", "LanceDB", "Pinecone", "Qdrant"] },
  { label: "Infra", items: ["AWS S3+SQS", "Convex", "LiveKit", "Twilio", "Docker", "Playwright"] },
  { label: "Agentic", items: ["Multi-agent", "MCP/A2A", "SSE Streaming", "Browser Agents", "OSWorld"] },
  { label: "Research", items: ["spaCy", "Docling", "Indic NLP", "fMRI / TRIBE v2", "Diffusion LMs"] },
];

// ─── CHAR CANVAS — the showpiece ─────────────────────────────────────────────
// Stolen directly from the ASCII character art pin.
// Characters (@, S, X, 8, t, :, ;, .) form the visual texture.
// Near your cursor: they bloom into brick red, grow, cycle faster.
// Far away: barely visible dim grey. The canvas IS the background.

const CHARSET = ["·",".",":",";"," ","~","+","=","-","|","@","#","%","8","S","X",">","<","!","*","^","&"];
const CHARSET_ACTIVE = ["@","#","%","!","*","^","&","8","S","X",">","<","=","+","~"];

function CharCanvas() {
  const ref = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const raf = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const COLS = 52, ROWS = 28;
    let cells = [], W = 0, H = 0;

    function resize() {
      const el = canvas.parentElement;
      W = el.clientWidth; H = el.clientHeight;
      const dpr = devicePixelRatio || 1;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.scale(dpr, dpr);
      build();
    }

    function build() {
      cells = [];
      const gx = W / COLS, gy = H / ROWS;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          cells.push({
            x: gx * (c + 0.5),
            y: gy * (r + 0.5),
            phase: Math.random() * Math.PI * 2,
            spd: 0.35 + Math.random() * 0.9,
            charOff: Math.random() * CHARSET.length,
            charSpd: 0.004 + Math.random() * 0.008,
          });
        }
      }
    }

    function frame(t) {
      ctx.clearRect(0, 0, W, H);
      const mx = mouse.current.x, my = mouse.current.y;
      const MAX = 170;

      for (const c of cells) {
        const dx = c.x - mx, dy = c.y - my;
        const dist = Math.hypot(dx, dy);
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.0007 * c.spd + c.phase);

        // Character selection — near cursor: active set, far: ambient set
        const ci = (c.charOff + t * c.charSpd) % 1;
        const charIdx = Math.floor(ci * CHARSET.length) % CHARSET.length;
        let char = CHARSET[charIdx];
        let fontSize = 9 + pulse * 2;
        let alpha = 0.055 + pulse * 0.04;
        let cr = 78, cg = 74, cb = 70;

        if (dist < MAX) {
          const ratio = 1 - dist / MAX;
          const s = ratio * ratio * (3 - 2 * ratio);
          fontSize = fontSize + s * 16;
          alpha = Math.max(alpha, s * 0.9);

          // Very near: use active chars like the ASCII art figure
          if (dist < 45) {
            const ai = Math.floor((t * 0.018 + c.charOff * 3)) % CHARSET_ACTIVE.length;
            char = CHARSET_ACTIVE[ai];
          }

          // Warm grey → brick red
          cr = Math.round(78 + s * (192 - 78));
          cg = Math.round(74 + s * (61 - 74));
          cb = Math.round(70 + s * (26 - 70));
        }

        ctx.globalAlpha = alpha;
        ctx.fillStyle = `rgb(${cr},${cg},${cb})`;
        ctx.font = `${fontSize}px "JetBrains Mono Variable", monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(char, c.x, c.y);
      }
      ctx.globalAlpha = 1;
      raf.current = requestAnimationFrame(frame);
    }

    resize();
    raf.current = requestAnimationFrame(frame);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);

    const mv = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const ml = () => { mouse.current = { x: -9999, y: -9999 }; };
    canvas.addEventListener("mousemove", mv);
    canvas.addEventListener("mouseleave", ml);

    return () => {
      cancelAnimationFrame(raf.current);
      ro.disconnect();
      canvas.removeEventListener("mousemove", mv);
      canvas.removeEventListener("mouseleave", ml);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="char-canvas"
      aria-hidden="true"
    />
  );
}

// ─── PIXEL MOSAIC — stolen from the red grid pin ──────────────────────────────
// Fills full project panels. The grid IS the image.

function Mosaic({ cols = 36, rows = 20, seed = 1, accent = "#bf3d1c", style, className }) {
  const cells = useMemo(() => {
    return Array.from({ length: cols * rows }, (_, i) => {
      const h = (((i + 1) * 2246822519 + seed * 2654435761) >>> 0) % 1000;
      const v = h / 1000;
      return v > 0.38 ? v : 0;
    });
  }, [cols, rows, seed]);

  return (
    <div
      className={`mosaic${className ? " " + className : ""}`}
      style={{ "--cols": cols, "--accent": accent, ...style }}
      aria-hidden="true"
    >
      {cells.map((v, i) => (
        <div
          key={i}
          className="mc"
          style={{ "--v": v, "--i": i }}
        />
      ))}
    </div>
  );
}

// ─── TEXT SCRAMBLE — stolen from the char-art vibe ───────────────────────────

function useScramble(text, active) {
  const [out, setOut] = useState(text);
  const CHARS = "!@#$%^&*=+-<>?/|~;:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  useEffect(() => {
    if (!active) { setOut(text); return; }
    let it = 0;
    const total = text.length * 2.8;
    const iv = setInterval(() => {
      setOut(
        text.split("").map((ch, i) => {
          if (ch === " " || ch === "\n") return ch;
          if (i < it / 2.8) return text[i];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join("")
      );
      it++;
      if (it >= total) clearInterval(iv);
    }, 28);
    return () => clearInterval(iv);
  }, [active, text]);

  return out;
}

// ─── MARQUEE ──────────────────────────────────────────────────────────────────

function Marquee() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="marquee-wrap" aria-hidden="true">
      <div className="marquee-track">
        {items.map((item, i) => (
          <span key={i} className="marquee-item">
            {item}
            <span className="marquee-sep">·</span>
          </span>
        ))}
      </div>
    </div>
  );
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
      { threshold: 0.04 }
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
      <a className="skip" href="#main">Skip to content</a>
      <main id="main">
        <Nav />
        <Hero />
        <Marquee />
        <ProjectsSec />
        <WorkSec />
        <StackSec />
        <ContactSec />
      </main>
    </>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav className="nav">
      <a className="nav-brand" href="#main">PR.</a>
      <div className="nav-right">
        <a href="#projects">Projects</a>
        <a href="#work">Work</a>
        <a href="#stack">Stack</a>
        <a
          href="https://github.com/Prahaladha-Reddy"
          target="_blank" rel="noopener"
          aria-label="GitHub"
        >
          <GithubLogo weight="bold" />
        </a>
        <a
          href="https://x.com/PrahaladReddyB"
          target="_blank" rel="noopener"
          aria-label="X"
        >
          <XLogo weight="bold" />
        </a>
        <a className="nav-hire" href="mailto:prahaladhareddyboreddy@gmail.com">
          Hire me <ArrowUpRight weight="bold" />
        </a>
      </div>
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
// Full viewport. CharCanvas is the background. Text floats on top.
// No panel borders — it's one dark cinematic frame.

function Hero() {
  return (
    <section className="hero">
      {/* Full-background character art canvas */}
      <div className="hero-canvas-wrap" aria-hidden="true">
        <CharCanvas />
        {/* Halftone image overlay — blends with canvas like clouds */}
        <img
          src="/halftone.png"
          alt=""
          className="hero-halftone"
        />
      </div>

      {/* Content floats above canvas */}
      <div className="hero-content">
        <div className="hero-top">
          <div className="hero-badge">
            <span className="badge-dot" />
            AI ENGINEER · ECE '26 · RGUKT
          </div>
          <div className="hero-badge hero-badge-right">
            KAIROS.COMPUTER · AFORE CAPITAL
          </div>
        </div>

        <div className="hero-main">
          <h1 className="hero-name">
            <span>PRAHALAD</span>
            <span className="hero-name-indent">REDDY.</span>
          </h1>

          <p className="hero-desc">
            Building things that don't exist yet. Voice agents, a neural
            focus group simulator, the first Telugu diffusion LM — in
            production, as a student.
          </p>

          <div className="hero-actions">
            <a className="cta-primary" href="#projects" id="hero-cta">
              See the work <ArrowUpRight weight="bold" />
            </a>
            <a className="cta-secondary" href="mailto:prahaladhareddyboreddy@gmail.com">
              prahaladhareddyboreddy@gmail.com
            </a>
          </div>
        </div>

        <div className="hero-bottom">
          <div className="hero-nums">
            <div className="hnum">
              <strong>1st</strong><span>Indic diffusion LM</span>
            </div>
            <div className="hnum-sep" />
            <div className="hnum">
              <strong>20K+</strong><span>brain points mapped</span>
            </div>
            <div className="hnum-sep" />
            <div className="hnum">
              <strong>35%</strong><span>better recs (LangGraph)</span>
            </div>
          </div>
          <p className="hero-hover-hint" aria-hidden="true">
            [ move cursor to interact ]
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
// Cinematic full-bleed panels. Pixel mosaic fills the panel.
// Big project number in outline text behind content.
// Text scrambles on hover. Stolen from pin 5 aesthetic.

function ProjectCard({ p, i }) {
  const [hovered, setHovered] = useState(false);
  const title = useScramble(p.title, hovered);

  return (
    <article
      id={`proj-${p.id}`}
      className="proj-panel"
      style={{ "--accent": p.accent, "--muted": p.muted }}
      data-reveal
      style2={{ "--delay": `${i * 60}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Full-bleed pixel mosaic — the grid IS the art */}
      <div className="proj-mosaic-bg">
        <Mosaic cols={40} rows={22} seed={p.seed} accent={p.accent} />
      </div>

      {/* Huge outline number behind content */}
      <div className="proj-num-bg" aria-hidden="true">{p.id}</div>

      {/* Content */}
      <div className="proj-inner">
        <div className="proj-top-row">
          <span className="eyebrow" style={{ color: p.accent }}>{p.tag}</span>
          <a
            href={p.link}
            target="_blank"
            rel="noopener"
            className="proj-link-btn"
            aria-label={`View ${p.title} on GitHub`}
            onClick={(e) => e.stopPropagation()}
          >
            View project <ArrowUpRight weight="bold" />
          </a>
        </div>

        <h3 className="proj-title">{title}</h3>
        <p className="proj-punch">{p.punch}</p>
        <p className="proj-story">{p.story}</p>

        <div className="proj-foot">
          <div className="proj-numbers">
            {p.numbers.map((n) => (
              <div key={n.l} className="pnum">
                <strong>{n.v}</strong>
                <span>{n.l}</span>
              </div>
            ))}
          </div>
          <div className="proj-stack">
            {p.stack.map((s) => (
              <span key={s} className="stag">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function ProjectsSec() {
  return (
    <section className="projects-sec" id="projects">
      <div className="sec-head" data-reveal>
        <p className="eyebrow">Selected Work</p>
        <h2>Things I built<br />that didn't exist.</h2>
        <p className="sec-sub">
          Not side projects. Not tutorials. Real research, real production, real impact.
        </p>
      </div>
      <div className="proj-list">
        {PROJECTS.map((p, i) => <ProjectCard key={p.id} p={p} i={i} />)}
      </div>
    </section>
  );
}

// ─── WORK ─────────────────────────────────────────────────────────────────────

function WorkSec() {
  const [open, setOpen] = useState("kairos");
  const role = WORK.find((w) => w.id === open);

  return (
    <section className="work-sec" id="work">
      <div className="sec-head" data-reveal>
        <p className="eyebrow">Experience</p>
        <h2>Where I've shipped.</h2>
      </div>

      <div className="work-layout">
        <div className="work-tabs" role="tablist">
          {WORK.map((w) => (
            <button
              key={w.id}
              role="tab"
              aria-selected={open === w.id}
              className={`work-tab${open === w.id ? " active" : ""}`}
              onClick={() => setOpen(w.id)}
              type="button"
            >
              <span className="wt-co">{w.co}</span>
              <span className="wt-badge">{w.badge}</span>
            </button>
          ))}
        </div>

        <div className="work-detail" data-reveal key={open}>
          <div className="wd-meta">
            <div>
              <p className="eyebrow" style={{ marginBottom: ".2rem" }}>{role.role}</p>
              <h3 style={{ margin: 0 }}>{role.co}</h3>
            </div>
            <code className="wd-period">{role.period}</code>
          </div>
          <ul className="wd-bullets">
            {role.bullets.map((b, i) => (
              <li key={i}>
                <span className="bd" aria-hidden="true">—</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ─── STACK ────────────────────────────────────────────────────────────────────

function StackSec() {
  return (
    <section className="stack-sec" id="stack">
      <div className="sec-head" data-reveal>
        <p className="eyebrow">Technical Stack</p>
        <h2>The tools I<br />think in.</h2>
      </div>

      <div className="stack-grid">
        {STACK_GROUPS.map((g, i) => (
          <div key={g.label} className="stack-group" data-reveal style={{ "--delay": `${i * 45}ms` }}>
            <p className="sg-label eyebrow">{g.label}</p>
            <div className="sg-items">
              {g.items.map((item) => (
                <span key={item} className="sg-item">{item}</span>
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
      <div className="contact-inner" data-reveal>

        {/* Left: big CTA text */}
        <div className="contact-copy">
          <p className="eyebrow">Let's build</p>
          <h2 className="contact-h2">
            Got something<br />
            <em>ambitious?</em>
          </h2>
          <p className="contact-sub">
            I'm a final-year ECE student who ships production AI.
            Voice agents, LLMs for underrepresented languages,
            neuromarketing tools — I'm not afraid of the impossible.
            If you are building something big, let's talk.
          </p>
          <div className="contact-links">
            <a className="cta-primary" href="mailto:prahaladhareddyboreddy@gmail.com" id="contact-cta">
              Send an email <ArrowUpRight weight="bold" />
            </a>
            <a className="cta-outline" href="https://github.com/Prahaladha-Reddy" target="_blank" rel="noopener">
              <GithubLogo weight="bold" /> GitHub
            </a>
            <a className="cta-outline" href="https://x.com/PrahaladReddyB" target="_blank" rel="noopener">
              <XLogo weight="bold" /> X / Twitter
            </a>
          </div>
        </div>

        {/* Right: terminal */}
        <div className="terminal">
          <div className="term-bar">
            <div className="term-dots">
              <span style={{ background: "#6a2820" }} />
              <span style={{ background: "#6a5418" }} />
              <span style={{ background: "#1e5a2a" }} />
            </div>
            <code className="term-title">prahalad@kairos — ~</code>
          </div>
          <div className="term-body">
            <div className="tl"><span className="tp">❯</span><span className="tc">git log --oneline --since="6m ago"</span></div>
            <div className="tl mt"><span className="th">a3f2c1d</span><span className="td"> feat: livekit voice agent · gemini live + pinecone rag</span></div>
            <div className="tl"><span className="th">b8e91fa</span><span className="td"> feat: lancedb artifact store + convex backend</span></div>
            <div className="tl"><span className="th">c4d72bb</span><span className="td"> feat: opencode cli supervisor w/ sse streaming</span></div>
            <div className="tl"><span className="th">d1a930e</span><span className="td"> research: telugu diffusion lm → huggingface.co</span></div>
            <div className="tl"><span className="th">e7f44c2</span><span className="td"> feat: vind · fmri 20k brain state classifier</span></div>
            <div className="tl"><span className="th">f2b1180</span><span className="td"> feat: langgraph memory · +35% rec accuracy</span></div>
            <div className="tl mt"><span className="tp">❯</span><span className="tc blink">_</span></div>
          </div>
        </div>

      </div>
    </section>
  );
}

// ─── MOUNT ────────────────────────────────────────────────────────────────────

createRoot(document.getElementById("root")).render(
  <React.StrictMode><App /></React.StrictMode>
);
