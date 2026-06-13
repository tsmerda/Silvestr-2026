import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { VibeStrip } from './components/VibeStrip'
import { Why } from './components/Why'
import { Locations } from './components/Locations'
import { Scenery } from './components/Scenery'
import { Program } from './components/Program'
import { Routes } from './components/Routes'
import { Packing } from './components/Packing'
import { Budget } from './components/Budget'
import { Voting } from './components/Voting'
import { FinalCta } from './components/FinalCta'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        <Hero />
        <div className="-mt-10 mb-4 md:-mt-16">
          <VibeStrip />
        </div>
        <Why />
        <Locations />
        <Scenery />
        <Program />
        <Routes />
        <Packing />
        <Budget />
        <Voting />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}
