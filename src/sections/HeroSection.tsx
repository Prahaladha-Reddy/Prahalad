import { useEffect, useRef } from 'react'

interface Cell {
  baseX: number
  baseY: number
}

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const gridRef = useRef<Cell[]>([])
  const rafRef = useRef<number>(0)

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const SPACING = 18 // Adjust spacing for the ASCII grid

    function buildGrid() {
      if (!canvas) return
      // Add extra columns/rows to ensure it completely overfills the screen bounds
      const cols = Math.ceil(canvas.width / SPACING) + 2
      const rows = Math.ceil(canvas.height / SPACING) + 2
      const cells: Cell[] = []
      
      const offsetX = (canvas.width - cols * SPACING) / 2 + SPACING / 2
      const offsetY = (canvas.height - rows * SPACING) / 2 + SPACING / 2

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          cells.push({
            baseX: offsetX + c * SPACING,
            baseY: offsetY + r * SPACING,
          })
        }
      }
      gridRef.current = cells
    }

    function resize() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      buildGrid()
    }

    const CHARS = ['-', '=', '+', '*', '#', '%', '@']

    function draw() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.font = '14px "Space Mono", monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const time = Date.now() * 0.001

      for (const cell of gridRef.current) {
        const dx = cell.baseX - mx
        const dy = cell.baseY - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        // 1. Proximity intensity
        const MAX_DIST = 700 // Reach further across the screen
        let proximity = 0
        if (mx !== -9999 && dist < MAX_DIST) {
          proximity = 1 - (dist / MAX_DIST)
          // Smoother, wider falloff
          proximity = Math.pow(proximity, 1.4)
        }

        // 2. Autonomous wave intensity
        const waveX = Math.sin(time * 0.5 + cell.baseX * 0.003)
        const waveY = Math.cos(time * 0.4 + cell.baseY * 0.003)
        const wave = (waveX + waveY) * 0.15

        const rawIntensity = proximity + Math.max(0, wave)
        const intensity = Math.max(0, Math.min(1, rawIntensity))

        const charIdx = Math.floor(intensity * (CHARS.length - 1))
        const char = CHARS[charIdx]

        // Base color is a visible deep red, target is glowing hoodie orange
        const r = Math.round(110 + (232 - 110) * intensity)
        const g = Math.round(20 + (78 - 20) * intensity)
        const b = Math.round(20 + (27 - 20) * intensity)
        const a = 0.35 + 0.65 * intensity // Base opacity is much brighter now

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
        ctx.fillText(char, cell.baseX, cell.baseY)
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
