import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import GuideLogin from './pages/GuideLogin'
import GuideDashboard from './pages/GuideDashboard'
import { db } from './firebase'
import { collection, onSnapshot, doc, updateDoc, increment, serverTimestamp } from 'firebase/firestore'
import confetti from 'canvas-confetti'

// Leaflet
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Icons
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

const HeartIcon = ({ filled, onClick }) => (
  <svg 
    onClick={onClick}
    className={`w-8 h-8 cursor-pointer transition-all ${filled ? 'text-red-500 drop-shadow-lg' : 'text-white/60 hover:text-white'}`}
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
)

function MainSite() {
  const [weather, setWeather] = useState(null)
  const [isDark, setIsDark] = useState(true)
  const [tours, setTours] = useState([])
  const [activities, setActivities] = useState([])
  const [allItems, setAllItems] = useState([])
  const [trendingItems, setTrendingItems] = useState([])
  const [dealItems, setDealItems] = useState([])
  const [popupItem, setPopupItem] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [favorites, setFavorites] = useState([])

  // Favorites
  useEffect(() => {
    const saved = localStorage.getItem('moshi-favorites')
    if (saved) setFavorites(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('moshi-favorites', JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = (itemId) => {
    setFavorites(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const isFavorite = (itemId) => favorites.includes(itemId)

  // Theme
  useEffect(() => {
    const saved = localStorage.getItem('moshi-theme')
    if (saved === 'light') setIsDark(false)
  }, [])

  const toggleTheme = () => {
    const newMode = !isDark
    setIsDark(newMode)
    localStorage.setItem('moshi-theme', newMode ? 'dark' : 'light')
  }

  // Data
  useEffect(() => {
    const unsubTours = onSnapshot(collection(db, 'tours'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, type: 'tour', ...d.data() })).filter(t => t.active !== false)
      setTours(data)
    })
    const unsubActs = onSnapshot(collection(db, 'activities'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, type: 'activity', ...d.data() }))
      setActivities(data)
    })
    return () => { unsubTours(); unsubActs() }
  }, [])

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
    
    const deals = combined.filter(item => item.isDealOfTheDay === true)
    setDealItems(deals)
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
      await updateDoc(ref, { clicksThisWeek: increment(1), lastClicked: serverTimestamp() })
    } catch (err) { console.log("Click tracking offline") }
  }

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

  const filteredItems = allItems
    .filter(item => {
      if (selectedCategory === 'saved') return isFavorite(item.id)
      if (selectedCategory === 'all') return true
      return item.category === selectedCategory
    })
    .filter(item => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return (
        item.title?.toLowerCase().includes(query) ||
        item.desc?.toLowerCase().includes(query) ||
        item.category?.includes(query)
      )
    })

  const itemCoordinates = {
    'Materuni Waterfalls': { lat: -3.25025, lng: 37.40007 },
    'Chemka Hot Springs': { lat: -3.4445, lng: 37.1939 },
    'Lake Chala': { lat: -3.3167, lng: 37.6833 },
    'Marangu Waterfall': { lat: -3.25, lng: 37.4 },
    'Coffee Tour': { lat: -3.27, lng: 37.42 },
    'Kilimanjaro Day Hike': { lat: -3.3349, lng: 37.3404 },
  }

  const getCoordinates = (item) => itemCoordinates[item.title] || null

  const categories = [
    { id: 'all', name: 'Everything' },
    { id: 'saved', name: '❤️ Saved' },
    { id: 'map', name: '🗺️ Map' },
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

      {/* THEME TOGGLE */}
      <button onClick={toggleTheme} className="fixed top-6 right-6 z-50 p-4 rounded-full bg-white/20 backdrop-blur-2xl border border-white/30 hover:scale-110 transition-all shadow-2xl">
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>

      {/* HERO */}
      <header className="pt-32 pb-20 text-center px-6">
        <h1 className="text-7xl sm:text-9xl font-black bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
          MOSHI TODAY
        </h1>
        <p className="text-2xl mt-6 opacity-80">What can you do right now?</p>
        <p className="text-lg mt-3 opacity-60">Updated {today}</p>
        {weather && <div className="mt-10"><span className="text-4xl font-bold text-yellow-400 animate-pulse">{weather}°C</span><span className="ml-3 text-lg opacity-70">in Moshi</span></div>}

        {/* GLOWING NEON SEARCH BAR */}
        <div className="max-w-md mx-auto mt-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search experiences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-14 pr-14 text-lg bg-black/40 backdrop-blur-xl rounded-full border-0 outline-none text-white placeholder:text-white/50"
              style={{
                boxShadow: '0 0 30px rgba(147, 51, 234, 0.6), inset 0 0 20px rgba(147, 51, 234, 0.2)'
              }}
            />
            <div className="absolute left-5 top-1/2 -translate-y-1/2 w-8 h-8">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-purple-400 drop-shadow-[0_0_8px_rgba(147,51,234,0.8)]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-purple-400 drop-shadow-[0_0_8px_rgba(147,51,234,0.8)]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* LEFT-ALIGNED NEON CATEGORY CHIPS */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto overflow-x-auto hide-scrollbar">
          <div className="flex gap-5 py-4 min-w-max">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="flex-none px-8 py-4 rounded-full font-bold text-lg whitespace-nowrap transition-all"
                style={{
                  background: selectedCategory === cat.id ? 'linear-gradient(to right, #10b981, #06b6d4)' : 'rgba(0, 0, 0, 0.4)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: selectedCategory === cat.id 
                    ? '0 0 30px rgba(16, 185, 129, 0.8)' 
                    : '0 0 30px rgba(147, 51, 234, 0.4), inset 0 0 20px rgba(147, 51, 234, 0.1)',
                  color: selectedCategory === cat.id ? 'black' : 'white',
                  border: '1px solid rgba(147, 51, 234, 0.3)',
                  transform: selectedCategory === cat.id ? 'scale(1.1)' : 'scale(1)'
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* DEAL OF THE DAY */}
      {dealItems.length > 0 && (
        <section className="px-6 pb-20">
          <h2 className="text-5xl font-black text-center mb-12 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
            🔥 TODAY'S SPECIAL DEALS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {dealItems.map(item => (
              <div key={item.id} className="group relative rounded-3xl overflow-hidden h-96 cursor-pointer shadow-2xl" onClick={() => handleItemClick(item)}>
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* SPECIAL BADGE */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-gradient-to-r from-yellow-400 to-red-600 text-black font-black px-6 py-3 rounded-full text-xl shadow-2xl animate-pulse">
                    TODAY'S SPECIAL
                  </div>
                  {item.dealNote && (
                    <div className="mt-2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-bold">
                      {item.dealNote}
                    </div>
                  )}
                </div>

                {/* HEART */}
                <div className="absolute top-4 right-4 z-10">
                  <HeartIcon filled={isFavorite(item.id)} onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id) }} />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="text-4xl font-black mb-3">{item.title}</h3>
                  {item.originalPrice && (
                    <p className="text-xl opacity-70 line-through mb-2">{item.originalPrice}</p>
                  )}
                  <p className="text-5xl font-black text-yellow-400">{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MAP VIEW */}
      {selectedCategory === 'map' ? (
        <section className="px-6 py-10 h-screen">
          <h2 className="text-5xl font-black text-center mb-12 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            🗺️ Explore Activities Around Moshi
          </h2>
          <div className="h-5/6 rounded-3xl overflow-hidden shadow-2xl">
            <MapContainer center={[-3.35, 37.33]} zoom={11} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
              />
              {allItems.map(item => {
                const coords = getCoordinates(item)
                if (!coords) return null
                return (
                  <Marker key={item.id} position={[coords.lat, coords.lng]}>
                    <Popup>
                      <div className="text-center">
                        {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover rounded-xl mb-4" />}
                        <h3 className="text-xl font-black mb-2">{item.title}</h3>
                        <p className="text-2xl font-bold text-yellow-400 mb-4">{item.price}</p>
                        <a
                          href={`https://wa.me/255747914720?text=${encodeURIComponent(`Hi! I'd like to book: ${item.title} — ${item.price}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } })}
                          className="inline-block py-3 px-6 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold rounded-xl"
                        >
                          BOOK NOW
                        </a>
                      </div>
                    </Popup>
                  </Marker>
                )
              })}
            </MapContainer>
          </div>
        </section>
      ) : (
        <>
          {/* TRENDING - CHANGED TO "Hot Picks This Week" */}
          {trendingItems.length > 0 && (
            <section className="px-6 pb-20">
              <h2 className="text-5xl font-black text-center mb-12 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                Hot Picks This Week
              </h2>
              <div className="overflow-x-auto flex gap-8 pb-8 hide-scrollbar snap-x">
                {trendingItems.map((item, i) => (
                  <div key={item.id} className="flex-none w-96 snap-center group relative rounded-3xl overflow-hidden h-96 cursor-pointer shadow-2xl">
                    <div onClick={() => handleItemClick(item)} className="absolute inset-0">
                      <img src={item.imageUrl || 'https://via.placeholder.com/800x600?text=No+Image'} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </div>
                    <div className="absolute top-4 right-4 z-10">
                      <HeartIcon filled={isFavorite(item.id)} onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id) }} />
                    </div>
                    {i < 3 && (
                      <div className="absolute top-4 left-4 w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center text-black font-black text-xl shadow-2xl z-10">
                        {i === 0 ? '1st' : i === 1 ? '2nd' : '3rd'}
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white pointer-events-none">
                      {item.type === 'tour' && (
                        <>
                          <div className="text-lg font-bold text-emerald-400 mb-1">{item.time || ''}</div>
                          {item.seats && (
                            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-sm px-4 py-2 rounded-full font-bold inline-block mb-3 animate-pulse">
                              {item.seats} seats left
                            </div>
                          )}
                        </>
                      )}
                      <h3 className="text-2xl font-black mb-2">{item.title}</h3>
                      {item.type === 'tour' && item.guide && <p className="text-sm opacity-80 mb-2">Guide: {item.guide}</p>}
                      <p className="text-3xl font-bold text-yellow-400">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* MAIN GRID */}
          <section className="px-6 py-20">
            <h2 className="text-5xl font-black text-center mb-12 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {searchQuery ? `Results for "${searchQuery}"` : selectedCategory === 'saved' ? '❤️ Your Saved Experiences' : selectedCategory === 'all' ? 'EVERYTHING' : selectedCategory.toUpperCase()}
            </h2>
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredItems.length === 0 ? (
                <p className="col-span-full text-center text-2xl opacity-60">
                  {selectedCategory === 'saved' ? 'No saved experiences yet — tap hearts to save!' : 'No results found — try another search!'}
                </p>
              ) : (
                filteredItems.map(item => (
                  <div key={item.id} className="group relative rounded-3xl overflow-hidden h-80 cursor-pointer shadow-2xl">
                    <div onClick={() => handleItemClick(item)} className="absolute inset-0">
                      <img src={item.imageUrl || 'https://via.placeholder.com/800x600?text=No+Image'} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    </div>
                    <div className="absolute top-4 right-4 z-10">
                      <HeartIcon filled={isFavorite(item.id)} onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id) }} />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white pointer-events-none">
                      <h3 className="text-2xl font-black mb-3 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                        {item.title}
                      </h3>
                      <p className="text-sm opacity-90 mb-4 line-clamp-2">{item.desc || ''}</p>
                      <p className="text-3xl font-black text-yellow-400">{item.price}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </>
      )}

      {/* POPUP */}
      {popupItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70" onClick={() => setPopupItem(null)}>
          <div onClick={e => e.stopPropagation()} 
            className={`relative max-w-md w-full rounded-3xl p-10 shadow-2xl border-2
              ${isDark 
                ? 'bg-gradient-to-br from-black/90 via-purple-900/50 to-black/90 backdrop-blur-3xl border-emerald-500/50' 
                : 'bg-gradient-to-br from-white/95 via-purple-100/50 to-white/95 backdrop-blur-3xl border-emerald-400/50'
              }`}>
            <button onClick={() => setPopupItem(null)} className="absolute top-4 right-6 text-4xl opacity-70 hover:opacity-100">×</button>
            
            {popupItem.imageUrl && (
              <img src={popupItem.imageUrl} alt={popupItem.title} className="w-full h-64 object-cover rounded-2xl mb-6" />
            )}
            
            <h3 className="text-4xl font-black text-center mb-6 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">{popupItem.title}</h3>
            <p className={`text-center text-lg mb-8 ${isDark ? 'opacity-90' : 'opacity-80'}`}>{popupItem.desc || 'Unforgettable experience in Moshi'}</p>
            <p className="text-6xl font-black text-center text-yellow-400 mb-10">{popupItem.price}</p>
            <a
              href={`https://wa.me/255747914720?text=${encodeURIComponent(`Hi! I'd like to book: ${popupItem.title} — ${popupItem.price}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                confetti({
                  particleCount: 150,
                  spread: 80,
                  origin: { y: 0.8 },
                  colors: ['#10b981', '#06b6d4', '#a855f7', '#f59e0b'],
                })
              }}
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
      <Route path="/map" element={<MainSite />} />
      <Route path="/guide" element={<GuideLogin />} />
      <Route path="/guide/dashboard" element={<GuideDashboard />} />
    </Routes>
  )
}

export default App