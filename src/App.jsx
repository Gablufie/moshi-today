import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import GuideLogin from './pages/GuideLogin'
import GuideDashboard from './pages/GuideDashboard'
import MoreWays from './components/MoreWays'
import { db } from './firebase'
import { collection, onSnapshot } from 'firebase/firestore'

// SUN & MOON — BREATHE
const SunIcon = () => (
  <svg className="w-8 h-8 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

const MoonIcon = () => (
  <svg className="w-8 h-8 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
    <path d="M21.64 13.36a10 10 0 01-13.28-13.28 10 10 0 1013.28 13.28z" />
  </svg>
)

function MainSite() {
  const [globalFilter, setGlobalFilter] = useState('all')
  const [weather, setWeather] = useState(null)
  const [isDark, setIsDark] = useState(true)
  const [tours, setTours] = useState([])
  const [popupItem, setPopupItem] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

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
    const unsub = onSnapshot(collection(db, 'tours'), (snap) => {
      setTours(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=-3.35&longitude=37.33&current=temperature_2m&timezone=Africa/Dar_es_Salaam')
      .then(r => r.json())
      .then(d => setWeather(Math.round(d.current.temperature_2m)))
      .catch(() => setWeather(28))
  }, [])

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const activeTours = tours
    .filter(t => t.active !== false)
    .filter(t => globalFilter === 'all' || t.category === globalFilter)

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-black'} transition-all duration-2000 relative overflow-x-hidden`}>
      {/* FLOATING ORBS — BREATHING LIFE */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-gradient-to-l from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-t from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* MENU BUTTON — FLOATING MAGIC */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className={`fixed top-6 left-6 z-50 p-4 rounded-full backdrop-blur-2xl shadow-2xl transition-all duration-700 hover:scale-125 border ${isDark ? 'bg-white/20 border-white/30 text-cyan-300' : 'bg-black/20 border-black/30 text-purple-600'} hover:shadow-cyan-500/50`}
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* THEME BUTTON */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-4 rounded-full backdrop-blur-2xl shadow-2xl transition-all duration-700 hover:scale-125 border ${isDark ? 'bg-white/20 border-white/30 text-yellow-300' : 'bg-black/20 border-black/30 text-gray-700'} hover:shadow-yellow-500/50`}
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>

      {/* SLIDING MENU — SMALL CATEGORIES, SCROLLABLE, GLOWING */}
      <div className={`fixed inset-y-0 left-0 h-full w-72 z-40 transform transition-transform duration-700 ${menuOpen ? 'translate-x-0' : '-translate-x-full'} ${isDark ? 'bg-black/95' : 'bg-white/95'} backdrop-blur-3xl shadow-2xl overflow-y-auto`}>
        <div className="p-6 pt-28">
          <h2 className="text-2xl font-black text-center mb-10 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Choose Your Vibe
          </h2>
          <div className="space-y-3">
            {[
              { id: 'all', name: "Everything" },
              { id: 'adventure', name: "Adventure" },
              { id: 'water', name: "Waterfalls" },
              { id: 'culture', name: "Culture" },
              { id: 'food', name: "Food Tours" },
              { id: 'mountain', name: "Mountain" },
              { id: 'safari', name: "Safari" },
              { id: 'restaurants', name: "Restaurants" },
              { id: 'bars', name: "Bars" },
              { id: 'nightclubs', name: "Night Clubs" },
              { id: 'pubs', name: "Pubs & Chill" },
              { id: 'transport', name: "Transport" },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setGlobalFilter(item.id)
                  setMenuOpen(false)
                }}
                className={`w-full py-3 text-base font-bold rounded-xl transition-all duration-500 ${
                  globalFilter === item.id
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black shadow-lg shadow-cyan-500/50'
                    : isDark ? 'bg-white/10 hover:bg-white/15 text-white/70' : 'bg-black/10 hover:bg-black/15 text-black/70'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {menuOpen && <div className="fixed inset-0 bg-black/60 z-30" onClick={() => setMenuOpen(false)} />}

      {/* HERO — CINEMATIC */}
      <div className="relative px-6 pt-32 pb-24 text-center">
        <h1 className="text-7xl sm:text-8xl md:text-9xl font-black mb-6 bg-gradient-to-r from-emerald-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent drop-shadow-2xl animate-pulse">
          MOSHI TODAY
        </h1>
        <p className="text-3xl font-bold mb-6">What can you do right now?</p>
        <p className="text-xl opacity-80 mb-10">Updated {today}</p>
        {weather && <p className="text-10xl font-black text-yellow-400 animate-bounce drop-shadow-2xl">{weather}°C</p>}
      </div>

      {/* TODAY'S TRIPS */}
      <div className="px-6 pb-16">
        <h2 className="text-5xl font-black text-center mb-12 bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-2xl">
          TODAY'S TRIPS
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {activeTours.map(tour => (
            <div
              key={tour.id}
              onClick={() => setPopupItem({ ...tour, start: tour.time, end: 'Around 6PM', desc: tour.desc || 'Unforgettable adventure' })}
              className="group relative bg-white/8 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 hover:scale-108 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-700 cursor-pointer"
            >
              <div className="text-4xl font-black text-emerald-400 mb-4">{tour.time}</div>
              <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-5 py-2 rounded-full text-sm font-bold mb-5 inline-block">
                {tour.seats} seats left
              </div>
              <h3 className="text-2xl font-black mb-4">{tour.title}</h3>
              <p className="text-sm opacity-80 mb-5">Guide: {tour.guide}</p>
              <p className="text-4xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {tour.price}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* MORE ACTIVITIES */}
      <div className="px-6 py-24">
        <h2 className="text-5xl font-black text-center mb-16 bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent drop-shadow-2xl">
          MORE IN MOSHI
        </h2>
        <MoreWays filter={globalFilter} />
      </div>

      {/* POPUP */}
      {popupItem && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6" onClick={() => setPopupItem(null)}>
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-10 max-w-lg w-full border-2 border-emerald-500/50 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-4xl font-black text-center mb-6 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {popupItem.title}
            </h3>
            <p className="text-xl text-center mb-8 opacity-90">{popupItem.desc}</p>
            <div className="text-center space-y-3 mb-10">
              <p>Starts: <span className="font-bold text-emerald-400">{popupItem.start}</span></p>
              <p>Ends: <span className="font-bold text-emerald-400">{popupItem.end}</span></p>
            </div>
            <p className="text-5xl font-black text-center text-yellow-400 mb-10">{popupItem.price}</p>
            <a
              href={`https://wa.me/255747914720?text=BOOKING: ${encodeURIComponent(popupItem.title + " — " + popupItem.price)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-gradient-to-r from-emerald-500 to-cyan-500 text-black py-6 rounded-3xl font-black text-3xl hover:scale-110 transition-all duration-500 shadow-2xl"
            >
              BOOK NOW
            </a>
            <button onClick={() => setPopupItem(null)} className="mt-8 text-gray-400 text-center w-full text-lg">
              Close
            </button>
          </div>
        </div>
      )}

      {/* FOOTER — PORTAL ENERGY */}
      <footer className="relative px-6 py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent"></div>
        <div className="absolute inset-0">
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-600 rounded-full blur-3xl animate-pulse opacity-30"></div>
        </div>
        <div className="relative z-10">
          <p className="text-6xl sm:text-7xl md:text-8xl font-black mb-6 bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl animate-pulse">
            +255 747 914 720
          </p>
          <p className="text-xl mb-10 opacity-80">24/7 — WhatsApp & Call</p>
          <a
            href="https://wa.me/255747914720"
            className="inline-block px-16 py-6 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-black text-2xl rounded-full hover:scale-110 transition-all duration-500 shadow-2xl"
          >
            ADD YOUR BUSINESS
          </a>
          <p className="mt-16 text-sm opacity-50">Made with love for Moshi • © 2025</p>
        </div>
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