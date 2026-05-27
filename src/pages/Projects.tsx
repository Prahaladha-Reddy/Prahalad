interface Project {
  name: string
  description: string
  tags: string[]
  url?: string
}

const projects: Project[] = [
  {
    name: 'Telugu Diffusion LM',
    description:
      'First diffusion language model developed specifically for Indian languages, focusing on high-fidelity text generation and zero-shot capabilities in resource-constrained environments.',
    tags: ['Diffusion Models', 'NLP', 'PyTorch'],
    url: 'https://github.com/prahaladha-reddy',
  },
  {
    name: 'VinD',
    description:
      'Neural Focus Group Simulator engineered to predict complex brain states and cognitive responses using advanced multimodal transformer architectures.',
    tags: ['Transformers', 'Cognitive Modelling', 'Python'],
    url: 'https://github.com/prahaladha-reddy',
  },
  {
    name: 'TeachMe',
    description:
      'An interactive VS Code extension designed to facilitate hands-on technical learning through contextual code analysis and real-time algorithmic guidance.',
    tags: ['TypeScript', 'VS Code API', 'RAG', 'AnalyticsJS'],
    url: 'https://github.com/prahaladha-reddy',
  },
]

export default function Projects() {
  return (
    <main className="projects">
      <div className="container">
        <header className="projects__header">
          <h1 className="projects__title">Selected Works</h1>
        </header>

        <ul className="project-list">
          {projects.map((project) => (
            <li key={project.name} className="project-item">
              <div className="project-item__content">
                <h2 className="project-item__name">{project.name}</h2>
                <p className="project-item__desc">{project.description}</p>
                <div className="project-item__tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="project-item__tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {project.url && (
                <a
                  href={project.url}
                  className="project-item__arrow"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${project.name} on GitHub`}
                >
                  ↗
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
