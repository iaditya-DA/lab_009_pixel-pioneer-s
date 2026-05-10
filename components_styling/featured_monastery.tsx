import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, ArrowRight, Eye } from 'lucide-react';

const monasteries = [
  {
    id: 1,
    name: 'Rumtek Monastery',
    location: 'East Sikkim',
    region: 'East Sikkim',
    image: 'https://res.cloudinary.com/djeospbqe/image/upload/v1765166329/buddha_image_xypaiq.jpg',
    tagline: 'The Golden Dharma Chakra Center',
    description: 'Seat of the Karmapa and crown jewel of Tibetan Buddhism',
    highlight: '360° Virtual Tour Available'
  },
  {
    id: 2,
    name: 'Pemayangtse Monastery',
    location: 'West Sikkim',
    region: 'West Sikkim',
    image: 'https://res.cloudinary.com/djeospbqe/image/upload/v1765166336/Rumtek_oqi97e.jpg',
    tagline: 'The Perfect Sublime Lotus',
    description: 'One of the oldest and most important monasteries in Sikkim',
    highlight: 'Main Prayer Hall — 360° view'
  },
  {
    id: 3,
    name: 'Enchey Monastery',
    location: 'Gangtok',
    region: 'East Sikkim',
    image: '/images/Enchey_new.webp',
    tagline: 'The Solitary Temple',
    description: 'Sacred sanctuary overlooking the Kanchenjunga',
    highlight: 'Sacred Courtyard Tour'
  }
];

export function FeaturedMonasteries() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className="relative py-[120px] px-12 md:px-8 sm:px-4 overflow-hidden bg-black">
      {/* Subtle dark texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      />
      
      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2 
            className="text-white mb-6" 
            style={{ 
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.02em'
            }}
          >
            Featured Monasteries
          </h2>
          <p 
            className="text-gray-400 max-w-2xl mx-auto mb-8"
            style={{
              fontSize: '1.125rem',
              lineHeight: 1.6,
              letterSpacing: '0.01em'
            }}
          >
            Discover Sikkim&apos;s sacred spiritual sites
          </p>
          
          {/* Golden divider */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-yellow-400" />
            <div className="w-2 h-2 bg-yellow-400 rounded-full" />
            <div className="w-32 h-px bg-yellow-400" />
            <div className="w-2 h-2 bg-yellow-400 rounded-full" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-yellow-400" />
          </div>
        </motion.div>

        {/* Centered Card Strip - Max width 1100px */}
        <div className="max-w-[1100px] mx-auto px-6 md:px-4 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-[28%_44%_28%] gap-7 lg:gap-7">
            
            {/* LEFT CARD - 28% */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              onMouseEnter={() => setHoveredId(monasteries[0].id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative group cursor-pointer order-1 lg:order-1"
            >
              <motion.div
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
                className="relative overflow-hidden rounded-[20px] h-[400px] lg:h-[500px]"
                style={{
                  boxShadow: '0 10px 25px rgba(250, 204, 21, 0.1), inset 0 1px 0 rgba(250, 204, 21, 0.08)'
                }}
              >
                {/* Slight overlay for side cards */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/[0.15] to-black/[0.05] z-[1]" />
                
                {/* Image with 4:5 aspect ratio */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    y: hoveredId === monasteries[0].id ? -6 : 0
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <img
                    src={monasteries[0].image}
                    alt={monasteries[0].name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-[2]" />
                
                {/* Content */}
                <div className="absolute inset-0 p-7 flex flex-col justify-end z-[3]">
                  {/* Location Badge */}
                  <div 
                    className="inline-flex items-center space-x-2 px-3 py-2 rounded-full mb-3 w-fit"
                    style={{
                      backgroundColor: '#FACC15',
                      boxShadow: '0 2px 8px rgba(250, 204, 21, 0.4)'
                    }}
                  >
                    <MapPin className="w-3.5 h-3.5 text-black" />
                    <span className="text-black text-xs tracking-wide" style={{ fontWeight: 500 }}>
                      {monasteries[0].region}
                    </span>
                  </div>
                  
                  <h3
                    className="text-white mb-2"
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      lineHeight: 1.2
                    }}
                  >
                    {monasteries[0].name}
                  </h3>
                  
                  <p className="text-white/80 text-sm mb-4" style={{ lineHeight: 1.5 }}>
                    {monasteries[0].description}
                  </p>
                  
                  {/* Hover tooltip */}
                  <AnimatePresence>
                    {hoveredId === monasteries[0].id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-yellow-400/20"
                      >
                        <p className="text-yellow-400 text-xs whitespace-nowrap" style={{ fontWeight: 600 }}>
                          {monasteries[0].highlight}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>

            {/* CENTER CARD - 44% (DOMINANT) */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0 }}
              onMouseEnter={() => setHoveredId(monasteries[1].id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative group cursor-pointer order-2 lg:order-2"
            >
              <motion.div
                initial={{ scale: 1.02, y: -8 }}
                whileHover={{ scale: 1.04, y: -12 }}
                transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
                className="relative overflow-hidden rounded-[20px] h-[450px] lg:h-[550px]"
                style={{
                  boxShadow: '0 10px 25px rgba(250, 204, 21, 0.15), inset 0 1px 0 rgba(250, 204, 21, 0.1)',
                  transform: 'translateY(-8px) scale(1.02)'
                }}
              >
                {/* Image with subtle parallax */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    y: hoveredId === monasteries[1].id ? -6 : 0
                  }}
                  transition={{ duration: 0.6 }}
                >
                  <img
                    src={monasteries[1].image}
                    alt={monasteries[1].name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                
                {/* Gradient Overlay - brighter for center card */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent z-[2]" />
                
                {/* Content */}
                <div className="absolute inset-0 p-7 flex flex-col justify-end z-[3]">
                  {/* Location Badge - Premium styling */}
                  <div 
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-4 w-fit"
                    style={{
                      backgroundColor: '#FACC15',
                      boxShadow: '0 4px 12px rgba(250, 204, 21, 0.5)'
                    }}
                  >
                    <MapPin className="w-4 h-4 text-black" />
                    <span className="text-black text-sm tracking-wide" style={{ fontWeight: 500 }}>
                      {monasteries[1].region}
                    </span>
                  </div>
                  
                  <h3
                    className="text-white mb-3"
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      fontSize: '2rem',
                      fontWeight: 700,
                      lineHeight: 1.2,
                      letterSpacing: '-0.01em'
                    }}
                  >
                    {monasteries[1].name}
                  </h3>
                  
                  <p 
                    className="text-yellow-400 mb-2"
                    style={{
                      fontSize: '0.95rem',
                      letterSpacing: '0.05em',
                      fontWeight: 400
                    }}
                  >
                    {monasteries[1].tagline}
                  </p>
                  
                  <p className="text-white/85 mb-5" style={{ fontSize: '1rem', lineHeight: 1.6 }}>
                    {monasteries[1].description}
                  </p>
                  
                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 text-black bg-yellow-400 px-6 py-3 rounded-full w-fit shadow-lg hover:shadow-xl hover:bg-yellow-500 transition-all duration-300"
                  >
                    <span style={{ fontWeight: 500 }}>Explore Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                  
                  {/* Hover tooltip */}
                  <AnimatePresence>
                    {hoveredId === monasteries[1].id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-4 py-2.5 rounded-lg shadow-xl flex items-center space-x-2 border border-yellow-400/20"
                      >
                        <Eye className="w-4 h-4 text-yellow-400" />
                        <p className="text-yellow-400 text-sm whitespace-nowrap" style={{ fontWeight: 600 }}>
                          {monasteries[1].highlight}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>

            {/* RIGHT CARD - 28% */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              onMouseEnter={() => setHoveredId(monasteries[2].id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative group cursor-pointer order-3 lg:order-3"
            >
              <motion.div
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
                className="relative overflow-hidden rounded-[20px] h-[400px] lg:h-[500px]"
                style={{
                  boxShadow: '0 10px 25px rgba(250, 204, 21, 0.1), inset 0 1px 0 rgba(250, 204, 21, 0.08)'
                }}
              >
                {/* Slight overlay for side cards */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/[0.15] to-black/[0.05] z-[1]" />
                
                {/* Image */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    y: hoveredId === monasteries[2].id ? -6 : 0
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <img
                    src={monasteries[2].image}
                    alt={monasteries[2].name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-[2]" />
                
                {/* Content */}
                <div className="absolute inset-0 p-7 flex flex-col justify-end z-[3]">
                  {/* Location Badge */}
                  <div 
                    className="inline-flex items-center space-x-2 px-3 py-2 rounded-full mb-3 w-fit"
                    style={{
                      backgroundColor: '#FACC15',
                      boxShadow: '0 2px 8px rgba(250, 204, 21, 0.4)'
                    }}
                  >
                    <MapPin className="w-3.5 h-3.5 text-black" />
                    <span className="text-black text-xs tracking-wide" style={{ fontWeight: 500 }}>
                      {monasteries[2].region}
                    </span>
                  </div>
                  
                  <h3
                    className="text-white mb-2"
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      lineHeight: 1.2
                    }}
                  >
                    {monasteries[2].name}
                  </h3>
                  
                  <p className="text-white/80 text-sm mb-4" style={{ lineHeight: 1.5 }}>
                    {monasteries[2].description}
                  </p>
                  
                  {/* Hover tooltip */}
                  <AnimatePresence>
                    {hoveredId === monasteries[2].id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-yellow-400/20"
                      >
                        <p className="text-yellow-400 text-xs whitespace-nowrap" style={{ fontWeight: 600 }}>
                          {monasteries[2].highlight}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}