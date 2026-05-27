import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <main className="home">
      {/* Dot-grid background texture */}
      <div className="home__bg" aria-hidden="true" />

      <div className="home__hero">
        <div className="container">
          <div className="home__hero-inner">
            <span className="home__eyebrow">AI Engineer · Builder · Researcher</span>

            <h1 className="home__title">
              Prahalad Reddy.
            </h1>

            <p className="home__subtitle">
              Architecting Agentic Intelligence.
            </p>

            <p className="home__bio">
              AI Engineer specializing in{' '}
              <em>LLM Orchestration</em>,{' '}
              <em>Low-Resource NLP</em>, and{' '}
              <em>Neuromarketing Research</em>.
              Engineering precision at the intersection of human cognition and artificial intelligence.
            </p>

            <div className="home__ctas">
              <Link to="/projects" className="btn btn--outline">
                View Projects →
              </Link>
              <Link to="/connect" className="btn btn--ghost">
                Get In Touch →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
