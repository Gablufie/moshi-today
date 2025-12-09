import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import GuideLogin from './pages/GuideLogin'
import GuideDashboard from './pages/GuideDashboard'
import MoreWays from './components/MoreWays'
import { db } from './firebase'
import { collection, onSnapshot } from 'firebase/firestore'

// SUN & MOON ICONS
const SunIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

const MoonIcon = () => (
  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
    <path d="M21.64 13.36a10 10 0 01-13.28-13.28 10 10 0 1013.28 13.28z" />
  </svg>
)

function MainSite() {
  const [filter, setFilter] = useState('all')
  const [weather, setWeather] = useState(null)
  const [isDark, setIsDark] = useState(true)
  const [tours, setTours] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('moshi-theme')
    if (saved === 'light') setIsDark(false)
  }, [])

  const toggleTheme = () => {
    const newMode = !isDark
    setIsDark(newMode)
    localStorage.setItem('moshi-theme', newMode ? 'dark' : 'light')
  }

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'tours'), (snapshot) => {
      const tourData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setTours(tourData)
    })
    return unsub
  }, [])

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=-3.35&longitude=37.33&current=temperature_2m&timezone=Africa/Dar_es_Salaam')
      .then(r => r.json())
      .then(d => setWeather(Math.round(d.current.temperature_2m)))
      .catch(() => setWeather(28))
  }, [])

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const activeTours = tours
    .filter(tour => tour.active !== false)
    .filter(tour => filter === 'all' || tour.category === filter)

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'adventure', label: 'Adventure' },
    { id: 'water', label: 'Water' },
    { id: 'culture', label: 'Culture' },
    { id: 'food', label: 'Food' },
  ]

  const bg = isDark ? 'bg-black text-white' : 'bg-white text-black'
  const cardBg = isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'

  return (
    <div className={`min-h-screen ${bg} transition-all duration-500 relative`}>
      {/* TOGGLE */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full backdrop-blur-xl shadow-2xl transition-all hover:scale-110 ${
          isDark ? 'bg-white/20 hover:bg-white/30 text-yellow-400' : 'bg-black/20 hover:bg-black/30 text-gray-800'
        }`}
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>

      {/* HERO */}
      <div className="px-4 pt-8 pb-12">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-purple-600 to-blue-600 p-10 md:p-14 text-center shadow-2xl">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-4">MOSHI TODAY</h1>
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            What can you do <span className="text-yellow-300">right now</span>?
          </p>
          <p className="text-sm md:text-base opacity-90 mb-6">Updated {today}</p>

          {weather !== null && (
            <div className="mt-8">
              <div className="text-8xl md:text-9xl font-black text-yellow-400">{weather}°C</div>
              <p className="text-lg md:text-xl mt-4 font-medium">
                {weather > 32 ? 'Hot → go swimming!' : weather < 18 ? 'Cool → perfect for hiking!' : 'Great weather for anything!'}
              </p>
            </div>
          )}

          <div className="mt-10 text-5xl md:text-6xl font-black text-emerald-400">
            {activeTours.reduce((a, b) => a + (b.seats || 0), 0)} seats left today
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="px-4 pb-10">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`py-3.5 rounded-xl font-bold text-sm transition-all ${
                  filter === cat.id
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg scale-105 ring-2 ring-white/30'
                    : isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TOURS GRID — MOBILE PERFECT */}
      <div className="px-4 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {/* TODAY ONLY CARD */}
          <div className="group relative bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl p-6 text-center shadow-xl hover:shadow-red-500/40 transition-all duration-400 hover:scale-105">
            <div className="text-5xl mb-3 animate-pulse">flash</div>
            <h3 className="text-xl font-black mb-1">TODAY ONLY</h3>
            <p className="text-base font-bold">LAST-MINUTE SPOTS</p>
          </div>

          {/* REAL TOURS — MOBILE FRIENDLY */}
          {activeTours.length > 0 ? activeTours.map(tour => (
            <div key={tour.id} className={`group relative ${cardBg} backdrop-blur-xl rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border`}>
              <div className="text-3xl font-black mb-2">{tour.time}</div>
              <div className="bg-red-600 text-white inline-block px-3 py-1 rounded-full text-xs font-bold mb-3">
                {tour.seats} seats left
              </div>
              <h3 className="text-base font-bold mb-2 line-clamp-2 leading-tight">{tour.title}</h3>
              <p className="text-xs opacity-80 mb-3">Guide: {tour.guide}</p>
              <div className="text-2xl font-black bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent mb-3">
                {tour.price}
              </div>
              <button className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-black py-2.5 rounded-xl font-bold text-sm hover:shadow-cyan-500/50 transition">
                Book Now
              </button>
            </div>
          )) : (
            <div className="col-span-full text-center py-20 text-xl opacity-50">
              No tours available right now
            </div>
          )}
        </div>
      </div>

      {/* MORE WAYS — ALSO MOBILE PERFECT */}
      <MoreWays />

      {/* FOOTER */}
      <footer className={`px-6 py-20 text-center border-t transition-all duration-500 ${
        isDark ? 'bg-black text-white border-white/10' : 'bg-white text-black border-gray-200'
      }`}>
        <p className="text-6xl md:text-7xl font-black mb-8">+255 747 914 720</p>
        <p className="text-xl md:text-2xl max-w-xl mx-auto">
          Want to list your tour? →{' '}
          <a href="https://wa.me/255747914720" className={`font-bold underline transition-all hover:scale-105 ${
            isDark ? 'text-emerald-400 hover:text-cyan-300' : 'text-emerald-600 hover:text-emerald-800'
          }`}>
            Message us on WhatsApp
          </a>
        </p>
      </footer>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainSite />} />
      <Route path="/guide" element={<GuideLogin />} />
      <Route path="/guide/dashboard" element={<GuideDashboard />} />
    </Routes>
  )
}

export default App