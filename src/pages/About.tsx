import boyImg from '../assets/boy.png'

export default function About() {
  return (
    <main className="about">
      <div className="container">
        <div className="about__inner">
          {/* Left: Text Content */}
          <div className="about__content">
            <h1 className="about__title">My way<br />of AI</h1>

            <div className="about__body">
              <p>
                I have been working on AI systems for about 18 months. I have built
                projects when we were using tools, struggling to get structured
                output from llms, Select times and then Struggling out of low context
                weak memories systems , MCP , Skills , Context Engineering, CLI ,
                Sandboxes. <strong>Now I am more excited than ever.</strong>
              </p>

              <p>
                I love doing whatever I do with a pitch of creativity — I absolutely
                destroy my first idea when solving particular problem coz it's what
                every ones gets. I just believe in consistency more than anything else,
                especially in AI where iteration is everything.
              </p>

              <p>
                The machines are only as precise as the thinking that trains them.
                That's the intersection I live in — <strong>engineering rigour meets
                cognitive depth</strong>.
              </p>
            </div>
          </div>

          {/* Right: Photo */}
          <div className="about__image-wrap">
            <img
              src={boyImg}
              alt="Prahalad at his desk, a dreamlike painting of a figure looking out at an infinite sky"
            />
          </div>
        </div>
      </div>
    </main>
  )
}
