import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ParticlesBg from './components/ParticlesBg'
import Home from './pages/Home'
import Competitions from './pages/Competitions'
import Events from './pages/Events'
import Blogs from './pages/Blogs'
import Register from './pages/Register'
import Department from './pages/Department'
import Highlights from './pages/Highlights'

export default function App() {
  return (
    <>
      <ParticlesBg />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/competitions" element={<Competitions />} />
        <Route path="/events" element={<Events />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/register" element={<Register />} />
        <Route path="/department" element={<Department />} />
        <Route path="/highlights" element={<Highlights />} />
      </Routes>
      <Footer />
    </>
  )
}
