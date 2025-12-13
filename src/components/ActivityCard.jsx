import { HeartIcon } from './icons' // if you move icons

const ActivityCard = ({ item, onClick, isFavorite, toggleFavorite }) => (
  <div className="group relative rounded-3xl overflow-hidden h-80 cursor-pointer shadow-2xl">
    <div onClick={() => onClick(item)} className="absolute inset-0">
      <img 
        src={item.imageUrl || 'https://via.placeholder.com/800x600?text=No+Image'} 
        alt={item.title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
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
)

export default ActivityCard