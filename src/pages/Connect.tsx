export default function Connect() {
  return (
    <main className="connect">
      <div className="connect__inner">
        <h1 className="connect__title">
          I Love AI.<span className="connect__cursor" aria-hidden="true" />
        </h1>

        <p className="connect__subtitle">
          If you have ideas on napkin papers, broken AI systems,
          spinning 100s of agents, let's talk.
        </p>

        <nav className="connect__links" aria-label="Contact links">
          <a
            id="contact-email"
            href="mailto:prahaladhareddyboreddy@gmail.com"
            className="connect__link"
          >
            prahaladhareddyboreddy@gmail.com
          </a>
          <a
            id="contact-twitter"
            href="https://x.com/PrahaladReddyB"
            className="connect__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://x.com/PrahaladReddyB
          </a>
          <a
            id="contact-linkedin"
            href="https://www.linkedin.com/in/prahaladha-reddy-boreddy/"
            className="connect__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.linkedin.com/in/prahaladha-reddy-boreddy/
          </a>
        </nav>
      </div>
    </main>
  )
}
