import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="bg-[#1a1814] text-[#f8f5f0] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl text-[#d4af37] tracking-wide">
              Sacred Heritage
            </h3>
            <p className="text-[#f8f5f0]/70 text-sm leading-relaxed font-sans">
              Exploring the timeless beauty and spiritual essence of Buddhist monasteries through immersive virtual experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg text-[#d4af37] tracking-wide">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-[#f8f5f0]/70 hover:text-[#d4af37] transition-colors duration-300">
                  Virtual Tours
                </a>
              </li>
              <li>
                <a href="/models" className="text-[#f8f5f0]/70 hover:text-[#d4af37] transition-colors duration-300">
                  3D Models
                </a>
              </li>
              <li>
                <a href="#" className="text-[#f8f5f0]/70 hover:text-[#d4af37] transition-colors duration-300">
                  Gallery
                </a>
              </li>
              <li>
                <a href="#" className="text-[#f8f5f0]/70 hover:text-[#d4af37] transition-colors duration-300">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg text-[#d4af37] tracking-wide">
              Connect
            </h4>
            <p className="text-[#f8f5f0]/70 text-sm">
              Sikkim, India
            </p>
            <p className="text-[#f8f5f0]/70 text-sm">
              heritage@sacred.com
            </p>
          </div>
        </div>

        <Separator className="bg-[#d4af37]/20 mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#f8f5f0]/50">
          <p>© 2024 Sacred Heritage. All rights reserved.</p>
          <p className="font-serif italic text-[#d4af37]/60">
            Preserving tradition through technology
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
