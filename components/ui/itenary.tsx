import { motion } from 'motion/react';

const itineraries = [
  {
    id: 2,
    days: '3 Days',
    destination: 'Yuksom',
    description: 'Visit Dubdi Monastery & explore ancient trails.',
    image: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600'
  },
  {
    id: 3,
    days: '4 Days',
    destination: 'Pelling',
    description: 'Explore Pemayangtse & Rabdentse ruins with stunning views.',
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600'
  },
  {
    id: 4,
    days: '5 Days',
    destination: 'Ravangla',
    description: 'Breathtaking monasteries, Buddha Park & calm retreat.',
    image: '/images/ravangla_image.avif'
  },
  {
    id: 5,
    days: '7 Days',
    destination: 'North Sikkim',
    description: 'Lachen, Lachung, Gurudongmar & divine landscapes.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600'
  }
];

export function CuratedItineraries() {
  return (
    <section 
      className="relative py-32 px-12 md:px-8 sm:px-4 overflow-hidden bg-black"
    >
      {/* Blurred background effect with yellow glow */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(250, 204, 21, 0.2) 0%, transparent 50%)',
        }}
      />

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p 
            className="text-yellow-400 mb-4 tracking-[0.2em]"
            style={{ fontSize: '0.875rem', fontWeight: 600 }}
          >
            DISCOVER SIKKIM
          </p>
          
          <h2 
            className="text-white mb-6"
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: 400,
              fontStyle: 'italic',
              lineHeight: 1.2,
              letterSpacing: '0.02em'
            }}
          >
            Curated Itineraries
          </h2>
          
          <p 
            className="text-gray-400 max-w-3xl mx-auto"
            style={{ fontSize: '1.125rem', lineHeight: 1.7 }}
          >
            Handpicked travel plans designed to help you explore monasteries, culture,
            <br />and breathtaking landscapes.
          </p>
        </motion.div>

        {/* Itinerary Cards */}
        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-10">
          {itineraries.map((itinerary, index) => (
            <motion.div
              key={itinerary.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -12, scale: 1.05 }}
              className="group cursor-pointer"
            >
              {/* Arch-shaped card */}
              <div className="relative w-[240px]">
                {/* Arch container */}
                <div 
                  className="relative overflow-hidden"
                  style={{
                    width: '240px',
                    height: '320px',
                    borderRadius: '120px 120px 20px 20px',
                    boxShadow: '0 10px 30px rgba(250, 204, 21, 0.12), inset 0 1px 0 rgba(250, 204, 21, 0.1)'
                  }}
                >
                  {/* Image */}
                  <img
                    src={itinerary.image}
                    alt={itinerary.destination}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Gradient overlay */}
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 60%)'
                    }}
                  />
                </div>

                {/* Text Content */}
                <div className="mt-6 text-center">
                  <p 
                    className="text-yellow-400 mb-2"
                    style={{ fontSize: '0.9375rem', fontWeight: 600 }}
                  >
                    {itinerary.days}
                  </p>
                  <h3 
                    className="text-white mb-3"
                    style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.2 }}
                  >
                    {itinerary.destination}
                  </h3>
                  <p 
                    className="text-gray-400 max-w-[220px] mx-auto"
                    style={{ fontSize: '0.875rem', lineHeight: 1.5 }}
                  >
                    {itinerary.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}