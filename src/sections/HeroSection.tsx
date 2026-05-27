import { useEffect, useRef } from 'react'

interface Dot {
  x: number
  y: number
  baseX: number
  baseY: number
  vx: number
  vy: number
  size: number
  opacity: number
  phase: number
  phaseSpeed: number
}

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const dotsRef = useRef<Dot[]>([])
  const rafRef = useRef<number>(0)

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const SPACING = 28
    const REPEL_R = 110
    const REPEL_F = 55

    function buildDots() {
      if (!canvas) return
      const cols = Math.ceil(canvas.width / SPACING) + 2
      const rows = Math.ceil(canvas.height / SPACING) + 2
      const dots: Dot[] = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const bx = c * SPACING
          const by = r * SPACING
          dots.push({
            x: bx, y: by,
            baseX: bx, baseY: by,
            vx: 0, vy: 0,
            size: Math.random() < 0.1 ? 2 : 1.2,
            opacity: 0.1 + Math.random() * 0.3,
            phase: Math.random() * Math.PI * 2,
            phaseSpeed: 0.006 + Math.random() * 0.01,
          })
        }
      }
      dotsRef.current = dots
    }

    function resize() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      buildDots()
    }

    function draw() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      for (const d of dotsRef.current) {
        // slow autonomous wave drift
        d.phase += d.phaseSpeed
        const tx = d.baseX + Math.sin(d.phase + d.baseY * 0.018) * 14
        const ty = d.baseY + Math.cos(d.phase + d.baseX * 0.018) * 10

        // cursor repulsion
        const dx = d.x - mx
        const dy = d.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < REPEL_R && dist > 0.5) {
          const f = (1 - dist / REPEL_R) * REPEL_F
          d.vx += (dx / dist) * f * 0.12
          d.vy += (dy / dist) * f * 0.12
        }

        d.vx += (tx - d.x) * 0.07
        d.vy += (ty - d.y) * 0.07
        d.vx *= 0.76
        d.vy *= 0.76
        d.x += d.vx
        d.y += d.vy

        // colour shifts to red near cursor
        const prox = Math.max(0, 1 - dist / (REPEL_R * 1.4))
        const alpha = Math.min(d.opacity + prox * 0.55, 0.92)
        const rv = Math.round(130 + prox * 72)
        const gv = Math.round(8 + prox * 8)
        const bv = Math.round(8 + prox * 8)

        ctx.beginPath()
        ctx.arc(d.x, d.y, d.size * (0.9 + Math.sin(d.phase * 2.2) * 0.1), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rv},${gv},${bv},${alpha})`
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    resize()
    rafRef.current = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 } }

    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <section id="hero" className="hero">
      <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />

      <div className="hero__live" aria-hidden="true">
        <span className="hero__live-dot" />
        LIVE_TOPOLOGY_MONITOR
      </div>

      <div className="hero__content container">
        <div className="hero__inner">
          <span className="hero__eyebrow">AI Engineer · Builder · Researcher</span>
          <h1 className="hero__title">Prahalad Reddy.</h1>
          <p className="hero__subtitle">Architecting Agentic Intelligence.</p>
          <p className="hero__bio">
            AI Engineer specializing in LLM Orchestration, Low-Resource NLP, and
            Neuromarketing Research. Engineering precision at the intersection of
            human cognition and artificial intelligence.
          </p>
          <div className="hero__ctas">
            <button className="btn btn--outline" onClick={() => scrollTo('projects')}>
              View Projects ↗
            </button>
            <button className="btn btn--ghost" onClick={() => scrollTo('connect')}>
              Get In Touch →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
