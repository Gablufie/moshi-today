// src/components/MoreWays.jsx — NOW ALIVE WITH POPUPS
import { useState } from 'react'

export default function MoreWays({ filter = 'all' }) {
  const [popupItem, setPopupItem] = useState(null)

  const packages = [
    { category: 'mountain', title: "Marangu Route 6 Days", price: "3,625,000 TSH pp", desc: "The easiest Kili route • Dorm huts • 6 days summit trek • Most popular for beginners", icon: "mountain" },
    { category: 'mountain', title: "Machame Route 7 Days", price: "4,125,000 TSH pp", desc: "Whiskey route • Stunning views • 7 days • Higher success rate", icon: "mountain" },
    { category: 'mountain', title: "Rongai Route 7 Days", price: "4,250,000 TSH pp", desc: "Quiet northern approach • Less crowded • 7 days • Scenic and peaceful", icon: "mountain" },
    { category: 'safari', title: "2 Days Safari", price: "1,125,000 TSH pp", desc: "Tarangire + Ngorongoro Crater • Elephants & rhinos • Full day 1, half day 2", icon: "binoculars" },
    { category: 'safari', title: "3 Days Safari", price: "1,500,000 TSH pp", desc: "Serengeti + Ngorongoro • Big 5 guaranteed • 3 full days of wildlife", icon: "binoculars" },
    { category: 'transport', title: "Airport Transfer", price: "87,500 TSH", desc: "JRO Airport to Moshi/Arusha • Private car • 1-2 hours • AC vehicle", icon: "plane" },
    { category: 'restaurants', title: "Union Cafe", price: "20,000 TSH avg", desc: "Best coffee in Moshi • Nyama choma • Local & international • Open 7AM-10PM", icon: "restaurant" },
    { category: 'restaurants', title: "Kilimanjaro Wonders", price: "30,000 TSH avg", desc: "Hotel buffet • Tanzanian & continental • Family-friendly • 6AM-11PM", icon: "restaurant" },
    { category: 'bars', title: "Pub Alberto", price: "5,000 TSH beer", desc: "Cold Kilimanjaro • Live football • Local crowd • Open 4PM-2AM", icon: "bar" },
    { category: 'bars', title: "Glacier Inn", price: "6,000 TSH drink", desc: "Sports bar • Pool table • Happy hour • 3PM-1AM", icon: "bar" },
    { category: 'nightclubs', title: "Redstone Club", price: "10,000 TSH entry", desc: "Bongo flava • VIP tables • Moshi's hottest spot • Fri-Sat 10PM-5AM", icon: "nightclub" },
    { category: 'nightclubs', title: "Club 84", price: "15,000 TSH entry", desc: "Best sound system • International DJs • Dress code • Thu-Sun 9PM-4AM", icon: "nightclub" },
    { category: 'pubs', title: "The Crown Pub", price: "8,000 TSH pint", desc: "Craft beer • Chill vibes • Karaoke nights • 3PM-12AM", icon: "pub" },
    { category: 'pubs', title: "Moscow Pub", price: "7,000 TSH drink", desc: "Local hangout • Cheap drinks • Student favorite • 5PM-late", icon: "pub" },
  ]

  const filtered = filter === 'all' ? packages : packages.filter(p => p.category === filter)

  return (
    <div className="px-4 py-20 bg-gradient-to-b from-transparent to-purple-900/20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((p, i) => (
          <div
            key={i}
            onClick={() => setPopupItem({
              title: p.title,
              desc: p.desc,
              price: p.price,
              start: 'Varies by booking',
              end: 'Varies by booking'
            })}
            className="group relative bg-white/5 backdrop-blur-xl rounded-3xl p-6 text-center border border-white/10 hover:border-emerald-400/60 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:scale-105 cursor-pointer"
          >
            <div className="text-6xl mb-4 group-hover:animate-bounce">{p.icon}</div>
            <h3 className="text-xl font-black mb-2 text-emerald-400">{p.title}</h3>
            <p className="text-sm opacity-90 mb-3">{p.desc}</p>
            <p className="text-2xl font-black text-yellow-400 mb-5">{p.price}</p>
          </div>
        ))}
      </div>

      {/* POPUP */}
      {popupItem && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setPopupItem(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md w-full border border-emerald-500/30" onClick={e => e.stopPropagation()}>
            <h3 className="text-3xl font-black text-center mb-4 text-emerald-400">{popupItem.title}</h3>
            <p className="text-lg text-center mb-6 opacity-90">{popupItem.desc}</p>
            <p className="text-center mb-8">
              <span className="text-sm opacity-80">Starts: {popupItem.start}</span><br/>
              <span className="text-sm opacity-80">Ends: {popupItem.end}</span>
            </p>
            <p className="text-4xl font-black text-center text-yellow-400 mb-8">{popupItem.price}</p>
            <a
              href={`https://wa.me/255747914720?text=Hi! I want to book: ${encodeURIComponent(popupItem.title + " — " + popupItem.price)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-gradient-to-r from-emerald-500 to-cyan-500 text-black py-5 rounded-2xl font-bold text-2xl hover:scale-110 transition"
            >
              BOOK NOW
            </a>
            <button onClick={() => setPopupItem(null)} className="mt-6 text-gray-500 w-full text-center">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}