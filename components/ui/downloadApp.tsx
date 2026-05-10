import { motion } from 'motion/react';
import { Download, Apple, Shield, CheckCircle, Smartphone } from 'lucide-react';

export function DownloadAppSection() {
  return (
    <section className="relative overflow-hidden bg-black py-32 lg:py-28 md:py-24 sm:py-20">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L45 15L30 30L15 15Z M30 30L45 45L30 60L15 45Z' fill='%23FACC15' fill-opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Radial Glow Behind Phone */}
      <div
        className="absolute top-1/2 left-[30%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20 blur-[120px] pointer-events-none lg:w-[600px] lg:h-[600px] md:left-[20%] sm:w-[400px] sm:h-[400px]"
        style={{
          background: 'radial-gradient(circle, rgba(250, 204, 21, 0.25) 0%, transparent 70%)'
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-12 lg:px-16 md:px-8 sm:px-6">
        <div className="grid grid-cols-2 gap-20 items-center lg:gap-16 md:grid-cols-1 md:gap-12">
          
          {/* LEFT SIDE - App Showcase */}
          <div className="relative flex items-center justify-center md:justify-center">
            {/* Floating Decorative Elements */}
            
            {/* Mandala Background */}
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.05, 1]
              }}
              transition={{
                rotate: { duration: 60, repeat: Infinity, ease: 'linear' },
                scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
              }}
              className="absolute inset-0 flex items-center justify-center opacity-8 pointer-events-none"
            >
              <svg width="500" height="500" viewBox="0 0 500 500" className="w-full h-full max-w-[500px]">
                <circle cx="250" cy="250" r="200" fill="none" stroke="#FACC15" strokeWidth="1" opacity="0.3" />
                <circle cx="250" cy="250" r="150" fill="none" stroke="#FACC15" strokeWidth="1" opacity="0.3" />
                <circle cx="250" cy="250" r="100" fill="none" stroke="#FACC15" strokeWidth="1.5" opacity="0.4" />
                {[...Array(8)].map((_, i) => (
                  <line
                    key={i}
                    x1="250"
                    y1="250"
                    x2={250 + 200 * Math.cos((i * Math.PI) / 4)}
                    y2={250 + 200 * Math.sin((i * Math.PI) / 4)}
                    stroke="#FACC15"
                    strokeWidth="0.5"
                    opacity="0.2"
                  />
                ))}
              </svg>
            </motion.div>

            {/* Floating Prayer Wheels */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="absolute top-10 left-10 w-16 h-16 opacity-15 lg:w-12 lg:h-12 md:top-5 md:left-5"
            >
              <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 blur-sm" />
            </motion.div>

            <motion.div
              animate={{
                y: [0, 15, 0],
                rotate: [0, -5, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1
              }}
              className="absolute bottom-20 right-10 w-20 h-20 opacity-10 lg:w-16 lg:h-16 md:bottom-10 md:right-5"
            >
              <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 blur-sm" />
            </motion.div>

            {/* Bokeh Lights */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: [0.08, 0.2, 0.08],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.5
                }}
                className="absolute w-12 h-12 rounded-full blur-xl"
                style={{
                  background: i % 2 === 0 ? 'rgba(250, 204, 21, 0.3)' : 'rgba(250, 204, 21, 0.2)',
                  top: `${20 + i * 15}%`,
                  left: `${10 + i * 20}%`
                }}
              />
            ))}

            {/* Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              whileHover={{ y: -10, rotateY: 5 }}
              className="relative z-20"
            >
              {/* Samsung Phone Frame */}
              <div
                className="relative w-[320px] h-[650px] rounded-[40px] shadow-2xl overflow-hidden lg:w-[280px] lg:h-[570px] sm:w-[260px] sm:h-[530px]"
                style={{
                  background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
                  border: '10px solid #1a1a1a',
                  boxShadow: `
                    0 30px 90px rgba(250, 204, 21, 0.15),
                    0 15px 40px rgba(0, 0, 0, 0.5),
                    inset 0 0 0 1px rgba(250, 204, 21, 0.1)
                  `
                }}
              >
                {/* Samsung Punch Hole */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-black rounded-full z-30 shadow-lg" />
                
                {/* Screen Content */}
                <div className="absolute inset-0 bg-white overflow-hidden rounded-[38px]">
                  {/* Mobile App Screenshot - Replace with your image */}
                  {/* 
                    INSTRUCTIONS: Replace the image src below with your mobile app screenshot
                    Put your image file in the public folder (e.g., public/mobile-app.png)
                    Then update the src to: /mobile-app.png (or your filename)
                    
                    Supported formats: .png, .webp, .jpg, .jpeg, .avif
                  */}
                  <img
                    src="/images/WhatsApp Image 2025-12-08 at 10.01.27 AM.jpeg"
                    alt="Monastery360 Mobile App"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Samsung Bottom Bezel with Navigation Hint */}
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-black z-30 flex items-end justify-center pb-1">
                  <div className="w-24 h-0.5 bg-white/20 rounded-full" />
                </div>
              </div>

              {/* Glow Effect Behind Phone */}
              <div
                className="absolute inset-0 -z-10 blur-3xl opacity-30"
                style={{
                  background: 'linear-gradient(135deg, #FACC15 0%, rgba(250, 204, 21, 0.5) 100%)',
                  transform: 'scale(1.1)'
                }}
              />
            </motion.div>
          </div>

          {/* RIGHT SIDE - Download Text & CTAs */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 md:text-center"
          >
            {/* Title */}
            <h2
              className="text-white mb-6"
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                fontWeight: 600,
                lineHeight: 1.15,
                letterSpacing: '-0.02em'
              }}
            >
              Explore Monastery360 on Mobile
            </h2>

            {/* Subtext */}
            <p
              className="text-gray-400 mb-10 max-w-xl md:mx-auto"
              style={{
                fontSize: '1.125rem',
                lineHeight: 1.7,
                fontWeight: 400
              }}
            >
              Experience immersive 360° monastery tours, travel guides, maps, and cultural archives right from your phone.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col space-y-4 mb-8 md:items-center">
              {/* Primary Button - Download APK */}
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-10 py-5 rounded-full shadow-2xl flex items-center justify-center space-x-4 overflow-hidden md:w-full md:max-w-md"
                style={{
                  background: 'linear-gradient(135deg, #FACC15 0%, #EAB308 100%)',
                  boxShadow: '0 12px 40px rgba(250, 204, 21, 0.3), 0 6px 20px rgba(0, 0, 0, 0.3)'
                }}
              >
                {/* Animated Glow Ring */}
                <motion.div
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="absolute inset-0 rounded-full border-2 border-yellow-300"
                />

                <div className="relative flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center">
                    <Download className="w-5 h-5 text-black" />
                  </div>
                  <div className="text-left">
                    <p className="text-black" style={{ fontSize: '1.125rem', fontWeight: 700, lineHeight: 1.2 }}>
                      Download APK
                    </p>
                    <p className="text-black/70" style={{ fontSize: '0.875rem', fontWeight: 400 }}>
                      Android Version
                    </p>
                  </div>
                </div>

                {/* Bouncing Arrow Indicator */}
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="ml-auto"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M7.5 15L12.5 10L7.5 5"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
              </motion.button>
=
            </div>

            {/* Security Note */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center space-x-3 text-gray-400 md:justify-center"
            >
              <Shield className="w-5 h-5 text-yellow-400" />
              <div className="flex items-center space-x-2" style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                <span className="flex items-center space-x-1">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  <span>Secure direct download</span>
                </span>
                <span className="text-gray-600">•</span>
                <span className="flex items-center space-x-1">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  <span>Verified build</span>
                </span>
                <span className="text-gray-600">•</span>
                <span className="flex items-center space-x-1">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  <span>Updated regularly</span>
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Mountain Silhouette Pattern - Very Subtle */}
      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-3 pointer-events-none">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 50L120 20L240 60L360 10L480 40L600 5L720 45L840 15L960 55L1080 25L1200 50L1320 30L1440 60V100H0V50Z"
            fill="#FACC15"
          />
        </svg>
      </div>
    </section>
  );
}