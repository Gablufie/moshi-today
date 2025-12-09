import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function GuideDashboard() {
  const navigate = useNavigate()
  const [showAddModal, setShowAddModal] = useState(false)
  const [activeTab, setActiveTab] = useState('tours')

  // Fake data (later from Firebase)
  const guide = {
    name: "Amani",
    photo: "https://images.unsplash.com/photo-1555952517-2e7f2c2f0e8b?w=400",
    cover: "https://images.unsplash.com/photo-1555952517-2e7f2c2f0e8b?w=1200",
    bio: "Professional guide for 8 years. Specializing in Materuni waterfall & coffee tours. Fluent in English & Swahili.",
    rating: 4.9,
    totalTours: 312,
    earnings: 1240
  }

  const gallery = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
    "https://images.unsplash.com/photo-1540979389550-7c6e3b6fede1?w=600",
    "https://images.unsplash.com/photo-1555952517-2e7f2c2f0e8b?w=600",
    "https://images.unsplash.com/photo-1518548413148-3d33b7f6e0c3?w=600",
  ]

  const todaysTours = [
    { time: "08:00", title: "Materuni Waterfall + Coffee Tour", price: "$35", seatsLeft: 2, totalSeats: 6 },
    { time: "14:00", title: "Maasai Village Experience", price: "$40", seatsLeft: 5, totalSeats: 8 },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Guide Header */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img src={guide.cover} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <img src={guide.photo} alt={guide.name} className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-2xl" />
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-black">{guide.name}</h1>
              <div className="flex items-center gap-2 justify-center md:justify-start mt-2">
                <span className="text-2xl">★ {guide.rating}</span>
                <span className="text-gray-400">• {guide.totalTours} tours</span>
              </div>
            </div>
            <button onClick={() => navigate('/guide')} className="md:absolute top-6 right-6 bg-white/20 backdrop-blur px-6 py-3 rounded-full font-bold hover:bg-white/30 transition">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-6">
        <div className="max-w-6xl mx-auto flex gap-4 border-b border-white/10">
          {['tours', 'profile', 'earnings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 capitalize font-bold text-lg transition ${activeTab === tab ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-400'}`}
            >
              {tab === 'tours' ? "Today's Tours" : tab === 'profile' ? 'My Profile' : 'Earnings'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">

          {/* TOURS TAB */}
          {activeTab === 'tours' && (
            <>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black">Today's Tours</h2>
                <button onClick={() => setShowAddModal(true)} className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-black px-8 py-4 rounded-full font-black text-lg shadow-xl hover:scale-110 transition">
                  + Add New Tour
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {todaysTours.map((tour, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:scale-105 transition">
                    <div className="text-5xl font-black mb-4">{tour.time}</div>
                    <h3 className="text-2xl font-bold mb-3">{tour.title}</h3>
                    <p className="text-4xl font-black text-emerald-400 mb-4">{tour.price}</p>
                    <div className="flex justify-between items-center">
                      <span className="bg-red-600 px-5 py-2 rounded-full text-sm font-bold">
                        {tour.seatsLeft}/{tour.totalSeats} left
                      </span>
                      <button className="text-cyan-400 font-bold hover:underline">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* PROFILE TAB — THIS IS THE MONEY-MAKER */}
          {activeTab === 'profile' && (
            <div className="space-y-10">
              <div>
                <h3 className="text-2xl font-bold mb-4">Your Bio</h3>
                <textarea className="w-full h-32 bg-white/10 rounded-2xl p-6 border border-white/20 focus:border-emerald-500 transition" defaultValue={guide.bio} />
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4">Cover Photo / Video</h3>
                <div className="bg-white/10 border-2 border-dashed border-white/30 rounded-3xl h-64 flex items-center justify-center text-6xl cursor-pointer hover:border-emerald-500 transition">
                  Upload
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4">Photo Gallery (Tourists will see this!)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {gallery.map((img, i) => (
                    <div key={i} className="relative group">
                      <img src={img} alt="" className="w-full h-48 object-cover rounded-2xl" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-2xl">
                        <span className="text-4xl cursor-pointer">X</span>
                      </div>
                    </div>
                  ))}
                  <div className="bg-white/10 border-2 border-dashed border-white/30 rounded-2xl h-48 flex items-center justify-center text-6xl cursor-pointer hover:border-emerald-500 transition">
                    +
                  </div>
                </div>
              </div>

              <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-black px-12 py-5 rounded-full font-black text-xl shadow-xl hover:scale-110 transition">
                Save Profile
              </button>
            </div>
          )}

          {/* EARNINGS TAB */}
          {activeTab === 'earnings' && (
            <div className="text-center py-20">
              <p className="text-8xl font-black text-emerald-400">${guide.earnings}</p>
              <p className="text-3xl mt-4">Earned this month</p>
              <p className="text-xl text-gray-400 mt-8">Paid every Friday via M-Pesa</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Tour Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-50 p-6">
          <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-3xl p-10 max-w-lg w-full shadow-2xl">
            <h2 className="text-4xl font-black mb-8 text-center">Add New Tour</h2>
            <form className="space-y-6">
              <input placeholder="Tour Name" className="w-full px-6 py-4 bg-white/10 rounded-2xl border border-white/20 focus:border-purple-500 transition" />
              <input placeholder="Price (e.g. $35)" className="w-full px-6 py-4 bg-white/10 rounded-2xl border border-white/20 focus:border-purple-500 transition" />
              <input placeholder="Time (e.g. 09:00)" className="w-full px-6 py-4 bg-white/10 rounded-2xl border border-white/20 focus:border-purple-500 transition" />
              <input placeholder="Total Seats" className="w-full px-6 py-4 bg-white/10 rounded-2xl border border-white/20 focus:border-purple-500 transition" />
              <select className="w-full px-6 py-4 bg-white/10 rounded-2xl border border-white/20">
                <option>Category</option>
                <option>Adventure</option>
                <option>Water</option>
                <option>Culture</option>
                <option>Food</option>
              </select>
              <div className="flex gap-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-white/20 rounded-2xl font-bold hover:bg-white/30 transition">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black rounded-2xl font-black hover:scale-105 transition">
                  Publish Tour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default GuideDashboard