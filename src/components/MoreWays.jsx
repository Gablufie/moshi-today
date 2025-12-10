// src/components/MoreWays.jsx — FINAL VERSION (ENGAGEMENT MAXED)
export default function MoreWays() {
  const packages = [
    { title: "Marangu Route 6 Days", price: "$1,450 pp", desc: "Coca-Cola route • Dorm huts • Most popular", icon: "mountain" },
    { title: "Machame Route 7 Days", price: "$1,650 pp", desc: "Whiskey route • Best views • Highest success rate", icon: "mountain" },
    { title: "Rongai Route 7 Days", price: "$1,700 pp", desc: "Quiet & scenic • Northern side • Less crowded", icon: "mountain" },
    { title: "2 Days Safari", price: "$450 pp", desc: "Tarangire + Ngorongoro Crater • Budget killer", icon: "binoculars" },
    { title: "3 Days Safari", price: "$600 pp", desc: "Serengeti + Ngorongoro • See the Big 5", icon: "binoculars" },
    { title: "Airport Transfer", price: "$35", desc: "JRO → Moshi/Arusha • Private car", icon: "plane" },
  ]

  return (
    <div className="px-4 py-20 bg-gradient-to-b from-transparent to-purple-900/20">
      {/* PREMIUM HEADING */}
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-center mb-8 bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-500 bg-clip-text text-transparent drop-shadow-2xl">
        Climb Kili • Safari Dreams • Book Today
      </h2>

      {/* NEW ENGAGEMENT LINE — THIS ONE CONVERTS */}
      <div className="text-center mb-12">
        <span className="inline-block px-10 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-black rounded-full text-xl md:text-2xl shadow-2xl animate-pulse">
          Your Adventure Starts Here — Book Now!
        </span>
      </div>

      {/* PACKAGES GRID */}
      <div className="max-w-7xl mx-auto grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {packages.map((p, i) => (
          <div
            key={i}
            className="group relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-5 text-center border border-white/20 shadow-xl hover:shadow-emerald-500/40 hover:border-emerald-400/60 transition-all duration-500 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10">
              <div className="text-6xl mb-3 group-hover:animate-bounce">{p.icon}</div>
              <h3 className="text-lg font-black mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {p.title}
              </h3>
              <p className="text-sm opacity-90 mb-3 leading-tight">{p.desc}</p>
              <p className="text-3xl font-black text-emerald-400 mb-4">{p.price}</p>
              <a
                href={`https://wa.me/255747914720?text=I'm%20interested%20in%20${encodeURIComponent(p.title + " — " + p.price)}%20Let's%20talk!`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-black py-3 rounded-xl font-bold text-sm hover:shadow-cyan-500/50 transition transform hover:scale-105"
              >
                Book via WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}