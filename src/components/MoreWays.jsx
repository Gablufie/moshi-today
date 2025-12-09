// src/components/MoreWays.jsx
export default function MoreWays() {
    const services = [
      { title: "Airport Transfer", desc: "Private car from JRO to Moshi", price: "from $25", icon: "plane" },
      { title: "Sim Card + eSIM", desc: "4G data the second you land", price: "from $5", icon: "signal" },
      { title: "Kili Climb Deals", desc: "Last-minute climb spots", price: "from $1,200", icon: "mountain" },
      { title: "Restaurant Booking", desc: "Best dinner spots", price: "Free", icon: "utensils" },
      { title: "1-Day Safari", desc: "See wildlife today", price: "from $180", icon: "binoculars" },
    ]
  
    return (
      <div className="px-4 py-20 bg-gradient-to-b from-transparent to-purple-900/20">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-12 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          More Ways We Help You Today
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <div key={i} className="group relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-10 text-center border border-white/20 shadow-2xl hover:shadow-emerald-500/40 hover:border-emerald-400/60 transition-all duration-500 hover:-translate-y-2 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10">
                <div className="text-7xl mb-6 group-hover:animate-bounce">{s.icon}</div>
                <h3 className="text-2xl md:text-3xl font-black mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  {s.title}
                </h3>
                <p className="text-base opacity-90 mb-6">{s.desc}</p>
                <p className="text-3xl font-black text-emerald-400 mb-8">{s.price}</p>
                <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-black px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-cyan-500/50 transition transform hover:scale-110">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }