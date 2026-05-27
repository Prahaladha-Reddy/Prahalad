const projects = [
  {
    name: 'Telugu Diffusion LM',
    description:
      'First diffusion language model developed specifically for Indian languages, focusing on high-fidelity text generation and zero-shot capabilities in resource-constrained environments.',
    tags: ['Diffusion Models', 'NLP', 'PyTorch'],
    url: 'https://huggingface.co/Prahaladha/telugu-diffusion-lm',
  },
  {
    name: 'VinD',
    description:
      'Neural Focus Group Simulator engineered to predict complex brain states and cognitive responses using advanced multimodal transformer architectures.',
    tags: ['Transformers', 'Cognitive Modelling', 'Python'],
    url: 'https://github.com/Prahaladha-Reddy/VinD',
  },
  {
    name: 'TeachMe',
    description:
      'An interactive VS Code extension designed to facilitate hands-on technical learning through contextual code analysis and real-time algorithmic guidance.',
    tags: ['TypeScript', 'VS Code API', 'RAG', 'AnalyticsJS'],
    url: 'https://github.com/Prahaladha-Reddy/Teach-Me',
  },
]

export default function ProjectsSection() {
  return (
    <section id="projects" className="projects section">
      <div className="container">
        <header className="section__header">
          <h2 className="section__title">Selected Works</h2>
        </header>

        <ul className="project-list">
          {projects.map((project) => (
            <li key={project.name} className="project-item">
              <div className="project-item__content">
                <h3 className="project-item__name">{project.name}</h3>
                <p className="project-item__desc">{project.description}</p>
                <div className="project-item__tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="project-item__tag">{tag}</span>
                  ))}
                </div>
              </div>
              <a
                href={project.url}
                className="project-item__arrow"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${project.name}`}
              >
                ↗
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
