const experiences = [
  {
    company: 'Kairos.Computer',
    logo: '/assets/kairos.png',
    logoAlt: 'Kairos Computer',
    role: 'AI Engineering Intern',
    dates: 'Jan 2025 – Present',
    bullets: [
      'Building production agentic workflows to automate complex, multi-step engineering tasks.',
      'Developing sophisticated voice agents with real-time processing capabilities for enhanced user interaction.',
    ],
  },
  {
    company: 'Noble Thoughts',
    logo: '/assets/nb.png',
    logoAlt: 'Noble Thoughts',
    role: 'AI Intern',
    dates: 'Nov 2024 – Jan 2025',
    bullets: [
      'Developed agentic memory systems, enabling persistent context retention across extended operational sessions.',
      'Engineered and deployed multimodal RAG pipelines to process diverse data inputs efficiently.',
    ],
  },
]

export default function ExperienceSection() {
  return (
    <section id="experience" className="experience section">
      <div className="container">
        <header className="section__header">
          <h2 className="section__title">Experience</h2>
        </header>

        <ul className="exp-list">
          {experiences.map((exp) => (
            <li key={exp.company} className="exp-item">
              <div className="exp-item__meta">
                <span className="exp-item__dates">{exp.dates}</span>
              </div>
              <div className="exp-item__body">
                <div className="exp-item__company-row">
                  <img src={exp.logo} alt={exp.logoAlt} className="exp-item__logo" />
                  <span className="exp-item__company">{exp.company}</span>
                </div>
                <p className="exp-item__role">{exp.role}</p>
                <ul className="exp-item__bullets">
                  {exp.bullets.map((b, i) => (
                    <li key={i} className="exp-item__bullet">{b}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
