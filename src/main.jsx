import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { ArrowUpRight, GithubLogo, XLogo } from "@phosphor-icons/react";
import { Application, Container, Graphics, Text } from "pixi.js";
import { CRTFilter, PixelateFilter } from "pixi-filters";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/jetbrains-mono";
import "./styles.css";

const PROJECTS = [
  {
    id: "01",
    tag: "Low-resource NLP",
    title: "Telugu diffusion LM",
    punch: "First diffusion language model built for Telugu.",
    story:
      "IndicBERT reworked into a diffusion architecture, now moving toward a lighter V2 with tool calling and mobile viability.",
    metrics: ["1st", "90M", "phone"],
    stack: ["HuggingFace", "IndicBERT", "Diffusion LM", "Indic NLP"],
    link: "https://huggingface.co/Prahaladha/telugu-diffusion-lm",
  },
  {
    id: "02",
    tag: "Neuromarketing",
    title: "VinD neural focus group",
    punch: "A machine estimate of what held attention and what did not.",
    story:
      "TRIBE v2-based fMRI pipeline mapping 20K+ predicted points into 400 regions and 7 networks for frame-by-frame ad response.",
    metrics: ["20K+", "400", "7"],
    stack: ["TRIBE v2", "fMRI Data", "Python", "Brain Networks"],
    link: "https://github.com/Prahaladha-Reddy/VinD",
  },
  {
    id: "03",
    tag: "Developer tools",
    title: "TeachMe",
    punch: "Learning by debugging real code, not reading passive lessons.",
    story:
      "A VS Code extension that pulls live repos, injects faults, and forces the student into production-grade debugging loops.",
    metrics: ["3", "real", "0"],
    stack: ["VS Code API", "TypeScript", "Spaced Repetition", "Git"],
    link: "https://github.com/Prahaladha-Reddy/Teach-Me",
  },
];

const WORK = [
  {
    company: "Kairos.Computer",
    role: "AI Engineering Intern",
    period: "Dec 2025 - Present",
    bullets: [
      "Agentic production workflows built from real failures, not benchmark theater.",
      "Voice stack with Gemini Live, OpenAI Realtime, Twilio/SIP, and Pinecone task search.",
      "LanceDB artifact storage, OpenCode CLI supervision, SSE streaming, and Convex backend.",
    ],
  },
  {
    company: "Noble Thoughts",
    role: "AI Intern",
    period: "Mar 2025 - Jun 2025",
    bullets: [
      "LangGraph memory systems for personalized education with a 35% recommendation lift.",
      "Multimodal RAG for YouTube using transcript and image chunking over FAISS and ChromaDB.",
    ],
  },
];

const STACK_GROUPS = [
  ["Languages", "Python", "JavaScript", "TypeScript", "React", "Next.js"],
  ["Models", "OpenAI", "Gemini", "Anthropic", "HuggingFace", "LangGraph"],
  ["Storage", "FAISS", "ChromaDB", "LanceDB", "Pinecone", "Qdrant"],
  ["Infra", "Convex", "LiveKit", "Twilio", "Docker", "Playwright"],
];

function useReveal(refreshKey = 0) {
  useEffect(() => {
    const nodes = document.querySelectorAll("[data-reveal]");
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08 }
    );

    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [refreshKey]);
}

function useScramble(text, active) {
  const [output, setOutput] = useState(text);

  useEffect(() => {
    if (!active) {
      setOutput(text);
      return;
    }

    const glyphs = "01[]<>#@$%&";
    let frame = 0;
    const limit = Math.max(14, text.length * 2);
    const interval = window.setInterval(() => {
      const next = text
        .split("")
        .map((char, index) => {
          if (char === " ") return char;
          if (index < frame / 2) return char;
          return glyphs[Math.floor(Math.random() * glyphs.length)];
        })
        .join("");

      setOutput(next);
      frame += 1;
      if (frame > limit) {
        window.clearInterval(interval);
      }
    }, 24);

    return () => window.clearInterval(interval);
  }, [active, text]);

  return output;
}

function RasterPanel() {
  const ref = useRef(null);

  useEffect(() => {
    let disposed = false;
    let app;
    let resizeObserver;
    let draw = () => {};

    const host = ref.current;
    if (!host) return undefined;

    const boot = async () => {
      const initialWidth = Math.max(host.clientWidth, 420);
      const initialHeight = Math.max(host.clientHeight, 520);

      app = new Application();
      await app.init({
        width: initialWidth,
        height: initialHeight,
        antialias: false,
        autoDensity: true,
        backgroundAlpha: 0,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
      });

      if (disposed) {
        app.destroy(true, { children: true });
        return;
      }

      host.appendChild(app.canvas);
      app.canvas.className = "raster-canvas";

      const scene = new Container();
      const grid = new Graphics();
      const traces = new Graphics();
      const active = new Graphics();
      const labels = new Container();

      const crtFilter = new CRTFilter({
        curvature: 0.18,
        lineWidth: 1,
        lineContrast: 0.16,
        noise: 0.08,
        noiseSize: 1.2,
        vignetting: 0.2,
        vignettingAlpha: 0.9,
        vignettingBlur: 0.24,
      });

      traces.filters = [new PixelateFilter(2)];
      scene.filters = [crtFilter];

      scene.addChild(grid, traces, active, labels);
      app.stage.addChild(scene);

      const topLeft = new Text({
        text: "EXECUTION SURFACE",
        style: {
          fontFamily: "JetBrains Mono Variable",
          fontSize: 11,
          fill: 0x826b61,
        },
      });

      const topRight = new Text({
        text: "ESC CHANNEL / ACTIVE",
        style: {
          fontFamily: "JetBrains Mono Variable",
          fontSize: 11,
          fill: 0x826b61,
        },
      });

      const footerA = new Text({
        text: "01  voice agents",
        style: {
          fontFamily: "JetBrains Mono Variable",
          fontSize: 12,
          fill: 0xf0e7de,
          fontWeight: "700",
        },
      });

      const footerB = new Text({
        text: "02  eval systems",
        style: {
          fontFamily: "JetBrains Mono Variable",
          fontSize: 12,
          fill: 0xf0e7de,
          fontWeight: "700",
        },
      });

      const footerC = new Text({
        text: "03  low-resource lm",
        style: {
          fontFamily: "JetBrains Mono Variable",
          fontSize: 12,
          fill: 0xf0e7de,
          fontWeight: "700",
        },
      });

      labels.addChild(topLeft, topRight, footerA, footerB, footerC);

      const seeds = Array.from({ length: 34 }, (_, index) => ({
        row: index % 16,
        col: (index * 5) % 26,
        span: 2 + (index % 4),
      }));

      let phase = 0;

      draw = () => {
        const width = app.screen.width;
        const height = app.screen.height;
        const cols = 26;
        const rows = 16;
        const cellW = width / cols;
        const cellH = height / rows;

        topLeft.position.set(14, 12);
        topRight.position.set(width - topRight.width - 14, 12);
        footerA.position.set(14, height - 26);
        footerB.position.set(width * 0.38, height - 26);
        footerC.position.set(width * 0.7, height - 26);

        grid.clear();
        grid.setStrokeStyle({ width: 1, color: 0x2a1511, alpha: 1 });

        for (let col = 0; col <= cols; col += 1) {
          grid.moveTo(col * cellW, 0).lineTo(col * cellW, height).stroke();
        }

        for (let row = 0; row <= rows; row += 1) {
          grid.moveTo(0, row * cellH).lineTo(width, row * cellH).stroke();
        }

        traces.clear();
        traces.setStrokeStyle({ width: 2, color: 0xd43b31, alpha: 0.82 });

        const routeRows = [2, 4, 5.5, 8, 10, 12.5, 14];
        routeRows.forEach((route, index) => {
          const startX = cellW * (1.5 + (index % 3));
          const y = cellH * route;
          traces.moveTo(startX, y);
          traces.lineTo(width * (0.32 + index * 0.02), y);
          traces.lineTo(width * (0.43 + index * 0.05), y + ((index % 2) ? cellH * 0.7 : 0));
          traces.lineTo(width * (0.62 + index * 0.03), y + ((index % 2) ? cellH * 0.7 : 0));
          traces.lineTo(width - cellW * (2 + (index % 2)), y).stroke();
        });

        active.clear();

        seeds.forEach((seed, index) => {
          const drift = Math.sin(phase + index * 0.7) * 0.85;
          const flicker = (Math.sin(phase * 1.7 + index * 2.1) + 1) / 2;
          const row = seed.row + (index % 5 === 0 ? Math.round(drift) : 0);
          const col = seed.col + ((index + 1) % 4 === 0 ? Math.round(drift) : 0);
          const blockW = Math.max(1, seed.span + Math.round(drift));

          for (let step = 0; step < blockW; step += 1) {
            const x = (col + step) * cellW + cellW * 0.15;
            const y = row * cellH + cellH * 0.28;
            const size = Math.min(cellW, cellH) * (0.32 + flicker * 0.12);
            active.rect(x, y, size, size).fill({ color: 0xd43b31, alpha: 0.72 + flicker * 0.28 });
          }
        });

        for (let row = 3; row < rows - 1; row += 2) {
          for (let col = 2; col < cols - 2; col += 3) {
            const noise = (Math.sin(col * 1.21 + row * 1.11 + phase) + 1) / 2;
            if (noise < 0.83) continue;
            const size = Math.min(cellW, cellH) * 0.13;
            active.rect(col * cellW + cellW * 0.44, row * cellH + cellH * 0.44, size, size).fill({
              color: 0x6a352a,
              alpha: 0.7,
            });
          }
        }

        crtFilter.time = phase * 0.45;
      };

      const tick = () => {
        phase += 0.03;
        draw();
      };

      draw();
      app.ticker.add(tick);

      resizeObserver = new ResizeObserver(() => {
        if (disposed || !app?.renderer) return;
        const nextWidth = Math.max(host.clientWidth, 420);
        const nextHeight = Math.max(host.clientHeight, 520);
        app.renderer.resize(nextWidth, nextHeight);
        draw();
      });
      resizeObserver.observe(host);
    };

    boot();

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      if (app?.renderer) {
        app.destroy(true, { children: true });
      }
    };
  }, []);

  return <div className="raster-panel" ref={ref} aria-hidden="true" />;
}

function SignalTile({ variant = 0 }) {
  const cells = useMemo(() => {
    const points = [];

    for (let row = 0; row < 14; row += 1) {
      for (let col = 0; col < 20; col += 1) {
        const diagonal = Math.abs(row - col * 0.45 - variant * 0.8);
        const echo = Math.abs(row - 10 + col * 0.28 - variant);
        const ring = Math.abs(Math.hypot(col - 10, row - 7) - (3.5 + variant * 0.3));
        const lit = diagonal < 0.95 || echo < 0.8 || ring < 0.9;
        points.push({
          key: `${row}-${col}`,
          lit,
          tone: lit ? 0.52 + ((row + col) % 5) * 0.08 : 0.08 + ((row + col) % 3) * 0.04,
        });
      }
    }

    return points;
  }, [variant]);

  return (
    <div className="signal-tile" aria-hidden="true">
      {cells.map((cell) => (
        <span key={cell.key} data-lit={cell.lit} style={{ "--tone": cell.tone }} />
      ))}
    </div>
  );
}

function App() {
  const [introComplete, setIntroComplete] = useState(false);
  useReveal(introComplete);

  return (
    <>
      <a className="skip" href={introComplete ? "#main" : "#intro-video"}>
        Skip to content
      </a>
      <ImageHero />
      {!introComplete ? (
        <VideoGate onComplete={() => setIntroComplete(true)} />
      ) : (
        <SiteContent />
      )}
    </>
  );
}

function SiteContent() {
  return (
    <>
      <Nav />
      <main className="shell" id="main">
        <Projects />
        <Systems />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

function ImageHero() {
  return (
    <section className="image-hero" aria-label="Prahalad Reddy introduction">
      <img src="/assets/hero-desk.png" alt="A person in an orange hoodie working at a desk facing an ocean sky." />
      <div className="image-hero-shade" />
      <div className="image-hero-copy">
        <p>AI Engineer</p>
        <h1>Prahalad Reddy</h1>
        <span>Ex Kairos (Afore Capital)</span>
      </div>
    </section>
  );
}

function VideoGate({ onComplete }) {
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.45) return;
        video.play().catch(() => setReady(true));
      },
      { threshold: [0.45, 0.7] }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const playVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    video.play().then(() => setReady(false)).catch(() => setReady(true));
  };

  return (
    <section className="video-gate" id="intro-video" aria-label="Paste transition">
      <div className="video-stage">
        <video
          ref={videoRef}
          src="/assets/final.mp4"
          muted
          playsInline
          preload="auto"
          onEnded={onComplete}
          aria-label="A hand presses Control C and Control V on a small keyboard."
        />
        <p>Let me copy and paste it for you!</p>
        {ready ? (
          <button className="video-play" type="button" onClick={playVideo}>
            Play transition
          </button>
        ) : null}
      </div>
    </section>
  );
}

function Nav() {
  return (
    <nav className="nav" aria-label="Primary navigation">
      <a className="nav-brand" href="#main">
        PRD
      </a>
      <div className="nav-links">
        <a href="#projects">Work</a>
        <a href="#systems">Systems</a>
        <a href="#contact">Contact</a>
        <a href="https://github.com/Prahaladha-Reddy" target="_blank" rel="noopener" aria-label="GitHub">
          <GithubLogo weight="bold" />
        </a>
        <a href="https://x.com/PrahaladReddyB" target="_blank" rel="noopener" aria-label="X">
          <XLogo weight="bold" />
        </a>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="hero module">
      <div className="hero-copy">
        <p className="eyebrow">AI engineer / ECE 2026 / RGUKT</p>
        <h1>
          Prahalad
          <span>Reddy</span>
        </h1>
        <p className="hero-note">
          I build production AI systems around agent loops, evals, inference paths, and execution environments that have to
          survive real use.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#projects">
            View work <ArrowUpRight weight="bold" />
          </a>
          <a className="btn btn-secondary" href="mailto:prahaladhareddyboreddy@gmail.com">
            Email
          </a>
        </div>
        <div className="hero-strip">
          <span>Kairos.Computer</span>
          <span>voice agents</span>
          <span>eval systems</span>
          <span>low-resource lm</span>
        </div>
      </div>
      <div className="hero-visual">
        <RasterPanel />
      </div>
    </section>
  );
}

function ProjectCard({ project, index }) {
  const [active, setActive] = useState(false);
  const title = useScramble(project.title, active);

  return (
    <article
      className={`project-card project-card-${index + 1}`}
      data-reveal
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <div className="card-topline">
        <span>{project.id}</span>
        <span>{project.tag}</span>
      </div>
      <SignalTile variant={index + 1} />
      <h3>{title}</h3>
      <p className="project-punch">{project.punch}</p>
      <p className="project-story">{project.story}</p>
      <div className="project-metrics">
        {project.metrics.map((metric) => (
          <span key={metric}>{metric}</span>
        ))}
      </div>
      <div className="project-tags">
        {project.stack.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <a className="project-link" href={project.link} target="_blank" rel="noopener">
        Open project <ArrowUpRight weight="bold" />
      </a>
    </article>
  );
}

function Projects() {
  return (
    <section className="projects module" id="projects">
      <div className="section-bar" data-reveal>
        <div>
          <p className="eyebrow">Selected work</p>
          <h2>Compact artifacts with real signal.</h2>
        </div>
        <p className="section-copy">Pixels are used as display matter here, not garnish around a normal portfolio card.</p>
      </div>
      <div className="project-grid">
        {PROJECTS.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}

function Systems() {
  return (
    <section className="systems module" id="systems">
      <div className="experience-panel" data-reveal>
        <div className="panel-head">
          <p className="eyebrow">Experience</p>
          <h2>Where the systems shipped.</h2>
        </div>
        <div className="experience-list">
          {WORK.map((job) => (
            <article className="experience-item" key={job.company}>
              <div className="experience-meta">
                <span>{job.period}</span>
                <span>{job.role}</span>
              </div>
              <h3>{job.company}</h3>
              <ul>
                {job.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>

      <aside className="stack-panel" data-reveal>
        <div className="panel-head">
          <p className="eyebrow">Stack</p>
          <h2>Tools I think in.</h2>
        </div>
        <div className="stack-grid">
          {STACK_GROUPS.map(([label, ...items], index) => (
            <section className="stack-group" key={label}>
              <div className="stack-topline">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{label}</h3>
              </div>
              <div className="stack-tags">
                {items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </section>
          ))}
        </div>
      </aside>
    </section>
  );
}

function Contact() {
  return (
    <section className="contact module" id="contact">
      <div className="contact-copy" data-reveal>
        <p className="eyebrow">Contact</p>
        <h2>Bring the strange system problem.</h2>
        <p>
          Voice interfaces, eval pipelines, underrepresented language models, or tools that need a tighter loop between code
          and behavior.
        </p>
      </div>
      <div className="contact-actions" data-reveal>
        <a className="btn btn-primary" href="mailto:prahaladhareddyboreddy@gmail.com">
          Send email <ArrowUpRight weight="bold" />
        </a>
        <a className="btn btn-secondary" href="https://github.com/Prahaladha-Reddy" target="_blank" rel="noopener">
          GitHub
        </a>
        <a className="btn btn-secondary" href="https://x.com/PrahaladReddyB" target="_blank" rel="noopener">
          X
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span>Prahalad Reddy</span>
      <span>Raster layout / esc red / Pixi-backed hero panel</span>
    </footer>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
