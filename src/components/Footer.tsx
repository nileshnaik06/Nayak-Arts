import { Link } from "react-router-dom";
import { Instagram, Mail, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="gallery-container py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="font-display text-2xl font-medium text-foreground"
            >
              Puran Nayak
            </Link>
            <p className="mt-4 text-muted-foreground font-body leading-relaxed">
              Professional artist specializing in thermocol sculptures,
              paintings, models, and DIY art—crafting beauty across multiple
              mediums.
            </p>
            <Link to="/register" className="py-5 text-[#000000] font-body underline">Register</Link>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-medium text-foreground mb-4">
              Explore
            </h4>
            <ul className="space-y-3">
              {["Gallery", "About", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className="text-muted-foreground hover:text-foreground transition-colors font-body"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-medium text-foreground mb-4">
              Connect
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:hello@artistry.com"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body"
                >
                  <Mail size={16} />
                  hello@artistry.com
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body"
                >
                  <Instagram size={16} />
                  @artistry.studio
                </a>
              </li>
              <li>
                <span className="flex items-center gap-2 text-muted-foreground font-body">
                  <MapPin size={16} />
                  Mumbai, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground font-body">
            © {new Date().getFullYear()} Puran Nayak. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground font-body">
            Crafted with passion
          </p>
        </div>
      </div>
    </footer>
  );
};
