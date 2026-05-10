import React from 'react';
import { ArrowRight, Box, Layers } from 'lucide-react';
import Link from 'next/link';

const models = [
    {
     id: 1,
    name: "Dzong-style-temple",
    slug: "dzong-style-temple",
    description: "Intricate 3D recreation of traditional dzong-style-temple  architecture",
    image: "/images/Dzong_style_temple.webp",
    polygons: "85K"
    },
  {
    id: 2,
    name: "Bhutanese Temple",
    slug: "bhutanese_temple",
    description: "Intricate 3D recreation of traditional Bhutanese temple architecture",
    image: "/images/Bhutanes_temple.webp",
    polygons: "125K"
  },
  {
    id: 3,
    name: "Buddha Stupa",
    slug: "bhudistt_stupa",
    description: "Sacred Buddhist stupa with detailed ornamental elements",
    image: "/images/Buddha_stupa_.webp",
    polygons: "89K"
  },
  {
    id: 4,
    name: "Buddhist Temple",
    slug: "buddhist_temple",
    description: "Authentic Buddhist temple with traditional Himalayan design",
    image: "/images/Buddhist_temple.webp",
    polygons: "156K"
  },
  {
    id: 5,
    name: "Gonjang Monastery",
    slug: "Gojang_monastery",
    description: "Historic Gonjang monastery preserved in digital form",
    image: "/images/gonjang_3d.webp",
    polygons: "142K"
  },
  {
    id: 6,
    name: "Labrang Monastery",
    slug: "labrang_monastery",
    description: "One of the largest Tibetan monasteries captured in stunning detail",
    image: "/images/labrang_3d_model.webp",
    polygons: "198K"
  }
];

const Models = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="relative py-12 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Box size={16} />
            <span>3D Heritage Collection</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-semibold text-foreground mb-6 tracking-tight">
            Our 3D Models
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Meticulously crafted 3D models preserving the sacred architecture 
            of Himalayan monasteries and temples.
          </p>
        </div>
      </header>

      {/* Models Grid */}
      <main className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model, index) => (
            <Link
              href={`/model-view/${model.slug}`}
              key={model.id}
              className="block group"
            >
              <article
                className="relative bg-card rounded-2xl overflow-hidden border 
                           border-border/50 shadow-sm hover:shadow-xl transition-all 
                           duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={model.image}
                    alt={model.name}
                    className="w-full h-full object-cover object-center 
                               transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

                  {/* Polygon Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1.5 bg-background/90 
                                     backdrop-blur-sm text-foreground px-3 py-1.5 rounded-full 
                                     text-xs font-medium border border-border/50">
                      <Layers size={12} />
                      {model.polygons} polys
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="font-serif text-xl font-semibold text-foreground mb-2 
                                 group-hover:text-primary transition-colors">
                    {model.name}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {model.description}
                  </p>

                  <span className="inline-flex items-center gap-2 text-primary 
                                   text-sm font-medium group/btn">
                    <span>View Model</span>
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover/btn:translate-x-1"
                    />
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer CTA */}
      <section className="border-t border-border/50 py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-4">
            Custom 3D Modeling Services
          </h2>
          <p className="text-muted-foreground mb-6">
            Need a custom 3D model of a heritage site? We bring sacred architecture to life.
          </p>
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full font-medium text-sm inline-flex items-center gap-2 transition-all duration-300 hover:shadow-lg">
            Get in Touch
            <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Models;
