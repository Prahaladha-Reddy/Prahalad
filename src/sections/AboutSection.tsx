export default function AboutSection() {
  return (
    <section id="about" className="about section">
      <div className="container">
        <div className="about__inner">
          <div className="about__content">
            <h2 className="about__title">My way of <span className="text-accent-red">AI</span></h2>
            <div className="about__body">
              <p>
                I have been working on AI systems for about 18 months. I have built
                projects when we were using tools, struggling to get structured
                output from LLMs, Select times and then struggling out of low context
                weak memory systems, MCP, Skills, Context Engineering, CLI,
                Sandboxes. <strong>Now I am more excited than ever.</strong>
              </p>
              <p>
                I love doing whatever I do with a pitch of creativity — I absolutely
                destroy my first idea when solving a particular problem coz it's what
                everyone gets. I just believe in consistency more than anything else,
                especially in AI where iteration is everything.
              </p>
              <p>
                The machines are only as precise as the thinking that trains them.
                That's the intersection I live in — <strong>engineering rigour meets
                cognitive depth</strong>.
              </p>
            </div>
          </div>

          <div className="about__image-wrap">
            <img
              src="/assets/boy.png"
              alt="Prahalad at his desk — a dreamlike painting of a figure looking out at an infinite sky"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
