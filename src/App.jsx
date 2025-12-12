import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import GuideLogin from './pages/GuideLogin'
import GuideDashboard from './pages/GuideDashboard'
import { db } from './firebase'
import { collection, onSnapshot, doc, updateDoc, increment, serverTimestamp } from 'firebase/firestore'

// SUN & MOON
const SunIcon = () => (
  <svg className="w-7 h-7 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5" />
    {[...Array(8)].map((_, i) => (
      <line key={i} x1="12" y1="1" x2="12" y2="3" transform={`rotate(${i * 45} 12 12)`} />
    ))}
  </svg>
)

const MoonIcon = () => (
  <svg className="w-7 h-7 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

function MainSite() {
  const [weather, setWeather] = useState(null)
  const [isDark, setIsDark] = useState(true)
  const [tours, setTours] = useState([])
  const [activities, setActivities] = useState([])
  const [allItems, setAllItems] = useState([])
  const [trendingItems, setTrendingItems] = useState([])
  const [popupItem, setPopupItem] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Theme persistence
  useEffect(() => {
    const saved = localStorage.getItem('moshi-theme')
    if (saved === 'light') setIsDark(false)
  }, [])

  const toggleTheme = () => {
    const newMode = !isDark
    setIsDark(newMode)
    localStorage.setItem('moshi-theme', newMode ? 'dark' : 'light')
  }

  // Firebase data
  useEffect(() => {
    const unsubTours = onSnapshot(collection(db, 'tours'), (snap) => {
      const data = snap.docs
        .map(d => ({ id: d.id, type: 'tour', ...d.data() }))
        .filter(t => t.active !== false)
      setTours(data)
    })

    const unsubActs = onSnapshot(collection(db, 'activities'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, type: 'activity', ...d.data() }))
      setActivities(data)
    })

    return () => { unsubTours(); unsubActs() }
  }, [])

  // Combine + trending logic
  useEffect(() => {
    const combined = [...tours, ...activities].map(item => ({
      ...item,
      category: (item.category || 'experiences').toString().toLowerCase().trim(),
      clicksThisWeek: item.clicksThisWeek || 0
    }))
    setAllItems(combined)

    const trending = [...combined]
      .sort((a, b) => (b.clicksThisWeek || 0) - (a.clicksThisWeek || 0))
      .slice(0, 6)
    setTrendingItems(trending)
  }, [tours, activities])

  // Weather
  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=-3.35&longitude=37.33&current=temperature_2m&timezone=Africa/Dar_es_Salaam')
      .then(r => r.json())
      .then(d => setWeather(Math.round(d.current.temperature_2m)))
      .catch(() => setWeather(28))
  }, [])

  const handleItemClick = async (item) => {
    setPopupItem(item)
    try {
      const ref = doc(db, item.type === 'tour' ? 'tours' : 'activities', item.id)
      await updateDoc(ref, {
        clicksThisWeek: increment(1),
        lastClicked: serverTimestamp()
      })
    } catch (err) {
      console.log("Click tracking failed", err)
    }
  }

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

  const filteredActivities = selectedCategory === 'all'
    ? allItems
    : allItems.filter(a => a.category === selectedCategory)

  const categories = [
    { id: 'all', name: 'Everything' },
    { id: 'mountain', name: 'Mountain' },
    { id: 'safari', name: 'Safari' },
    { id: 'waterfalls', name: 'Waterfalls' },
    { id: 'culture', name: 'Culture' },
    { id: 'food', name: 'Food' },
    { id: 'restaurants', name: 'Restaurants' },
    { id: 'bars', name: 'Bars' },
    { id: 'transport', name: 'Transport' },
    { id: 'experiences', name: 'Experiences' },
  ]

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-1000 ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-black'}`}>
      {/* ORBS */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl animate-pulse"/>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse animation-delay-2000"/>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse animation-delay-4000"/>
      </div>

      {/* MENU + THEME */}
      <button onClick={() => setMenuOpen(!menuOpen)}
        className="fixed top-6 left-6 z-50 p-4 rounded-full bg-white/20 backdrop-blur-2xl border border-white/30 hover:scale-110 transition-all shadow-2xl">
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
            d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      <button onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 p-4 rounded-full bg-white/20 backdrop-blur-2xl border border-white/30 hover:scale-110 transition-all shadow-2xl">
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>

      {/* MENU */}
      <div className={`fixed top-0 left-0 h-full w-80 z-40 transform transition-transform duration-700 ${menuOpen ? 'translate-x-0' : '-translate-x-full'} ${isDark ? 'bg-black/90' : 'bg-white/90'} backdrop-blur-3xl border-r ${isDark ? 'border-white/20' : 'border-black/20'}`}>
        <div className="p-10 pt-32">
          <h2 className="text-3xl font-black mb-10 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Filter</h2>
          <div className="space-y-3">
            {categories.map(cat => (
              <button key={cat.id} onClick={() => { setSelectedCategory(cat.id); setMenuOpen(false) }}
                className={`w-full text-left py-4 px-6 rounded-2xl font-bold text-lg transition-all
                  ${selectedCategory === cat.id 
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black shadow-lg' 
                    : isDark ? 'hover:bg-white/10 text-white/70' : 'hover:bg-black/10 text-black/70'}`}>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* HERO */}
      <header className="pt-32 pb-20 text-center px-6">
        <h1 className="text-7xl sm:text-9xl font-black bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
          MOSHI TODAY
        </h1>
        <p className="text-2xl mt-6 opacity-80">What can you do right now?</p>
        <p className="text-lg mt-3 opacity-60">Updated {today}</p>
        {weather && (
          <div className="mt-10">
            <span className="text-4xl font-bold text-yellow-400 animate-pulse">{weather}°C</span>
            <span className="ml-3 text-lg opacity-70">in Moshi</span>
          </div>
        )}
      </header>

      {/* MOST VISITED THIS WEEK */}
      {trendingItems.length > 0 && (
        <section className="px-6 pb-20">
          <h2 className="text-5xl font-black text-center mb-12 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
            MOST VISITED THIS WEEK
          </h2>
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {trendingItems.map((item, index) => (
              <div key={item.id} onClick={() => handleItemClick(item)}
                className="group relative bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 hover:scale-105 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/40 transition-all cursor-pointer">
                {index < 3 && (
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center text-black font-black text-xl shadow-2xl z-10">
                    {index === 0 ? '1st' : index === 1 ? '2nd' : '3rd'}
                  </div>
                )}
                {item.type === 'tour' ? (
                  <>
                    <div className="text-4xl font-black text-emerald-400 mb-2">{item.time}</div>
                    <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm px-4 py-2 rounded-full font-bold mb-4 inline-block animate-pulse">
                      {item.seats} seats left
                    </div>
                  </>
                ) : (
                  <div className="text-6xl mb-4">{item.icon || 'Fire'}</div>
                )}
                <h3 className="text-2xl font-black mb-3">{item.title}</h3>
                {item.type === 'tour' && <p className="opacity-70 text-sm">Guide: {item.guide}</p>}
                <p className="text-3xl font-bold mt-4 text-yellow-400">{item.price}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MAIN GRID */}
      <section className="px-6 py-20">
        <h2 className="text-5xl font-black text-center mb-12 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          {selectedCategory === 'all' ? 'EVERYTHING' : selectedCategory.toUpperCase()}
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredActivities.map(item => (
            <div key={item.id} onClick={() => handleItemClick(item)}
              className="group relative rounded-3xl p-8 text-center cursor-pointer bg-white/10 backdrop-blur-2xl border border-white/20 hover:scale-105 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all">
              <div className="text-6xl mb-4">{item.icon || 'Star'}</div>
              <h3 className="text-xl font-black mb-3 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">{item.title}</h3>
              <p className="text-sm opacity-80 mb-4">{item.desc}</p>
              <p className="text-2xl font-black text-yellow-400">{item.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* POPUP — NOW FULLY DARK/LIGHT MODE COMPATIBLE */}
      {popupItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 dark:bg-black/70 bg-white/70" onClick={() => setPopupItem(null)}>
          <div 
            onClick={e => e.stopPropagation()} 
            className={`relative max-w-md w-full rounded-3xl p-10 shadow-2xl border-2
              ${isDark 
                ? 'bg-gradient-to-br from-black/90 via-purple-900/50 to-black/90 backdrop-blur-3xl border-emerald-500/50' 
                : 'bg-gradient-to-br from-white/95 via-purple-100/50 to-white/95 backdrop-blur-3xl border-emerald-400/50'
              }`}
          >
            <button onClick={() => setPopupItem(null)} className="absolute top-4 right-6 text-4xl opacity-70 hover:opacity-100">×</button>
            <h3 className={`text-4xl font-black text-center mb-6 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent`}>
              {popupItem.title}
            </h3>
            <p className={`text-center text-lg mb-8 ${isDark ? 'opacity-90' : 'opacity-80'}`}>
              {popupItem.desc || 'Unforgettable experience in Moshi'}
            </p>
            <p className="text-6xl font-black text-center text-yellow-400 mb-10">{popupItem.price}</p>
            <a 
              href={`https://wa.me/255747914720?text=${encodeURIComponent(`Hi! I'd like to book: ${popupItem.title} — ${popupItem.price}`)}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-center py-6 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-2xl font-black rounded-3xl hover:scale-105 transition-all shadow-2xl"
            >
              BOOK NOW
            </a>
          </div>
        </div>
      )}
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