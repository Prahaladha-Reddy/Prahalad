import Nav from './components/Nav'
import Footer from './components/Footer'
import HeroSection from './sections/HeroSection'
import AboutSection from './sections/AboutSection'
import ExperienceSection from './sections/ExperienceSection'
import ProjectsSection from './sections/ProjectsSection'
import ConnectSection from './sections/ConnectSection'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <ConnectSection />
      </main>
      <Footer />
    </>
  )
}
