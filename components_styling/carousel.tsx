import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, MapPin } from 'lucide-react';

const monasteries = [
  {
    id: 1,
    name: "Rumtek Monastery",
    region: "East Sikkim",
    tagline: "Seat of the Karmapa",
    image: "/images/Center_feature_02.jpg",
    description: "Seat of the Karmapa and crown jewel of Tibetan Buddhism"
  },
  {
    id: 2,
    name: "Pemayangtse",
    region: "West Sikkim",
    tagline: "The Perfect Sublime Lotus",
    image: "/images/Center_featured_01.jpg",
    description: "One of the oldest and most important monasteries in Sikkim"
  },
  {
    id: 3,
    name: "Enchey Monastery",
    region: "East Sikkim",
    tagline: "Sacred sanctuary",
    image: "/images/Enchey_Monastris_03.avif",
    description: "Sacred sanctuary overlooking the Kanchenjunga"
  }
];

const MonasteryCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(1);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % monasteries.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + monasteries.length) % monasteries.length);
  };

  const getVisibleMonasteries = () => {
    const prev = (activeIndex - 1 + monasteries.length) % monasteries.length;
    const next = (activeIndex + 1) % monasteries.length;
    return [monasteries[prev], monasteries[activeIndex], monasteries[next]];
  };

  const visibleMonasteries = getVisibleMonasteries();

  return (
    <section className="w-full py-20 px-4 flex items-center justify-center overflow-hidden bg-[#dac9b2]">
      <div className="relative w-full max-w-5xl flex items-center justify-center">
        
        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-0 md:-left-4 z-40 p-2.5 bg-card/90 rounded-full hover:bg-card transition-all shadow-lg backdrop-blur-sm border border-border/50"
          aria-label="Previous monastery"
        >
          <ChevronLeft size={22} className="text-foreground" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-0 md:-right-4 z-40 p-2.5 bg-card/90 rounded-full hover:bg-card transition-all shadow-lg backdrop-blur-sm border border-border/50"
          aria-label="Next monastery"
        >
          <ChevronRight size={22} className="text-foreground" />
        </button>

        {/* Cards Container */}
        <div className="flex items-center justify-center gap-4 md:gap-6">
          {visibleMonasteries.map((monastery, index) => {
            const isCenter = index === 1;

            return (
              <div
                key={`${monastery.id}-${index}`}
                className={`
                  relative rounded-3xl overflow-hidden transition-all duration-500 ease-out shadow-xl shrink-0
                  ${isCenter
                    ? 'w-[280px] md:w-[320px] h-[420px] md:h-[480px] z-20'
                    : 'hidden md:block w-[240px] h-[380px] z-10 opacity-90'
                  }
                `}
              >
                {/* Background Image */}
                <img
                  src={monastery.image}
                  alt={monastery.name}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                />

                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${isCenter ? 'from-black/85 via-black/30 to-black/5' : 'from-black/80 via-black/20 to-transparent'}`} />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6 text-white">
                  {/* Region Badge */}
                  <div className="mb-2.5">
                    <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1 rounded-full text-[11px] font-medium uppercase tracking-wide">
                      <MapPin size={12} />
                      {monastery.region}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className={`font-serif font-semibold tracking-wide mb-1.5 ${isCenter ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                    {monastery.name}
                  </h3>

                  {/* Description */}
                  {isCenter ? (
                    <div className="animate-fade-in">
                      <p className="text-amber-200/90 text-sm mb-4 italic font-serif">
                        {monastery.tagline}
                      </p>
                      <p className="text-white/70 text-xs mb-4 leading-relaxed">
                        {monastery.description}
                      </p>
                      <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 w-fit transition-all duration-300 hover:shadow-lg">
                        Explore Now <ChevronRight size={16} />
                      </button>
                    </div>
                  ) : (
                    <p className="text-white/70 text-xs line-clamp-2">
                      {monastery.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MonasteryCarousel;