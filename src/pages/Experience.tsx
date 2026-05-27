import kairosLogo from '../assets/kairos.png'
import nbLogo from '../assets/nb.png'

interface ExpEntry {
  company: string
  logo: string
  logoAlt: string
  role: string
  dates: string
  bullets: string[]
}

const experiences: ExpEntry[] = [
  {
    company: 'Kairos.Computer',
    logo: kairosLogo,
    logoAlt: 'Kairos Computer logo',
    role: 'AI Engineering Intern',
    dates: 'Jan 2025 – Present',
    bullets: [
      'Building production agentic workflows to automate complex, multi-step engineering tasks.',
      'Developing sophisticated voice agents with real-time processing capabilities for enhanced user interaction.',
    ],
  },
  {
    company: 'Noble Thoughts',
    logo: nbLogo,
    logoAlt: 'Noble Thoughts logo',
    role: 'AI Intern',
    dates: 'Nov 2024 – Jan 2025',
    bullets: [
      'Developed agentic memory systems, enabling persistent context retention across extended operational sessions.',
      'Engineered and deployed multimodal RAG (Retrieval-Augmented Generation) pipelines to process diverse data inputs efficiently.',
    ],
  },
]

export default function Experience() {
  return (
    <main className="experience">
      <div className="container">
        <header className="experience__header">
          <h1 className="experience__title">Experience</h1>
        </header>

        <ul className="experience__list">
          {experiences.map((exp) => (
            <li key={exp.company} className="exp-item">
              {/* Left: dates */}
              <div className="exp-item__meta">
                <span className="exp-item__dates text-label">{exp.dates}</span>
              </div>

              {/* Right: content */}
              <div className="exp-item__body">
                <div className="exp-item__company-row">
                  <img
                    src={exp.logo}
                    alt={exp.logoAlt}
                    className="exp-item__logo"
                  />
                  <span className="exp-item__company">{exp.company}</span>
                </div>

                <p className="exp-item__role">{exp.role}</p>

                <ul className="exp-item__bullets">
                  {exp.bullets.map((b, i) => (
                    <li key={i} className="exp-item__bullet">
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
